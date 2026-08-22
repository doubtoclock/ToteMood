"use client";

import React, { useRef, useLayoutEffect, useMemo } from "react";
import { Canvas, useFrame, useThree, useGraph } from "@react-three/fiber";
import { useGLTF, useTexture, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";
import { GLTF, SkeletonUtils } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Tote_Artwork: THREE.Mesh;
    Tote_Body: THREE.Mesh;
    Tote_Front: THREE.Mesh;
  };
  materials: {
    Artwork_Material: THREE.MeshStandardMaterial;
    Bag_Material: THREE.MeshStandardMaterial;
  };
};

interface ScrollToteCanvasProps {
  scrollYProgress: MotionValue<number>;
}

// Custom shader material for the print reveal effect
const printMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -4,
  polygonOffsetUnits: -4,
});

// We inject custom shader chunks to handle the wipe reveal
printMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uReveal = { value: 0.0 };
  shader.fragmentShader = `
    uniform float uReveal;
    ${shader.fragmentShader}
  `.replace(
    `#include <dithering_fragment>`,
    `#include <dithering_fragment>
    
    // Mask effect: from top-left to bottom-right
    float mask = smoothstep(uReveal - 0.1, uReveal + 0.1, vUv.y + vUv.x * 0.5);
    
    // Very subtle fabric ink absorption effect during reveal
    float inkEffect = smoothstep(uReveal, uReveal + 0.05, vUv.y + vUv.x * 0.5);
    vec3 finalColor = mix(gl_FragColor.rgb * 0.8, gl_FragColor.rgb, inkEffect);
    
    gl_FragColor = vec4(finalColor, gl_FragColor.a * (1.0 - mask));
    `,
  );
  printMaterial.userData.shader = shader;
};

function ScrollToteModel({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { scene } = useGLTF("/3Dmodel/tote_web.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;

  const { gl } = useThree();
  const texture = useTexture("/images/illustration1.png");
  const clonedTexture = useMemo(() => {
    const t = texture.clone();
    t.flipY = true;
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearMipMapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    t.generateMipmaps = true;
    t.generateMipmaps = true;

    // Scale the artwork to ~60% size and center it
    const printScale = 1.6;
    t.repeat.set(printScale, printScale);
    // Offset to center. Add a tiny vertical bump (0.02) to visually center it above the base
    t.offset.set((1 - printScale) / 2, (1 - printScale) / 2 + 0.02);
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;

    t.needsUpdate = true;
    return t;
  }, [texture, gl]);

  const shaderRef = useRef<any>(null);

  const artworkMaterial = useMemo(() => {
    const mat = materials.Artwork_Material.clone();

    // Setup for custom shader
    mat.map = clonedTexture;
    mat.transparent = true;
    mat.toneMapped = false;
    mat.roughness = 0.95; // Matches the bag canvas exactly so print feels embedded
    mat.metalness = 0.0;
    mat.depthWrite = false;
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -4;
    mat.polygonOffsetUnits = -4;

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uReveal = { value: 0.0 };
      shaderRef.current = shader;

      shader.vertexShader = `
        uniform float uReveal;
        ${shader.vertexShader}
      `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
        float progress = uReveal * 1.2 - 0.1;
        // Create a subtle ripple wave at the boundary of the reveal mask
        float dist = abs(uv.x - progress);
        float ripple = sin(dist * 30.0) * exp(-dist * 15.0);
        // Only ripple while printing (0 < uReveal < 1)
        float isPrinting = step(0.01, uReveal) * (1.0 - step(0.99, uReveal));
        transformed.z += ripple * 0.015 * isPrinting;
        `,
      );
      shader.fragmentShader = `
        uniform float uReveal;
        ${shader.fragmentShader}
      `.replace(
        `#include <map_fragment>`,
        `#include <map_fragment>
        
        // Fix edge smearing by making out-of-bounds UVs transparent
        #ifdef USE_MAP
          if (vMapUv.x < 0.01 || vMapUv.x > 0.99 || vMapUv.y < 0.01 || vMapUv.y > 0.99) {
            diffuseColor.a = 0.0;
            gl_FragColor.a = 0.0;
          }
        #endif

        // We use vMapUv.x as our progress coordinate.
        // Because the texture was offset and repeated, vMapUv.x goes from ~ -0.3 to 1.3 across the mesh.
        float progress = uReveal * 1.2 - 0.1; // Scale to cover
        float mask = smoothstep(progress - 0.1, progress + 0.1, vMapUv.x);
        
        gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a * (1.0 - mask));
        `,
      );
      mat.userData.shader = shader;
    };

    mat.needsUpdate = true;
    return mat;
  }, [materials.Artwork_Material, texture]);

  const blackBagMaterial = useMemo(() => {
    const mat = materials.Bag_Material.clone();
    mat.color.set("#151515"); // Premium soft black canvas
    mat.roughness = 0.95;
    mat.metalness = 0.0;
    return mat;
  }, [materials.Bag_Material]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const scroll = scrollYProgress.get();

    // 45% - 70%: Tote scales in from behind the illustration
    const dropProgress = Math.max(0, Math.min(1, (scroll - 0.45) / 0.25));
    // Soft, Apple-style ease out
    const easeDrop = 1 - Math.pow(1 - dropProgress, 4);

    const isMobile = state.size.width < 768;

    // Tote stays centered horizontally but lowered so handles aren't cut off by the header
    groupRef.current.position.y = isMobile ? -0.8 : -1.25;

    // Rotation starts straight and rotates 15 degrees away by 70%
    const startRotY = 0;
    const endRotY = Math.PI / 12; // 15 degrees away during printing

    // During 70-85% (printing), it smoothly rotates back to 0 (front facing)
    const printProgress = Math.max(0, Math.min(1, (scroll - 0.7) / 0.15));
    const easePrint = 1 - Math.pow(1 - printProgress, 3);

    const currentRotY =
      startRotY + (endRotY - startRotY) * easeDrop - endRotY * easePrint;

    groupRef.current.rotation.x = 0;
    groupRef.current.rotation.y = currentRotY;
    groupRef.current.rotation.z = 0;

    // 70% - 90%: Printing mask reveal
    if (shaderRef.current) {
      shaderRef.current.uniforms.uReveal.value = printProgress;
    }

    // No scale pop during print, just smooth scale in during 45-70%
    const baseScale = isMobile ? 0.26 : 0.38; // Scale down for mobile to avoid text overlap
    groupRef.current.scale.setScalar(baseScale * easeDrop);

    // 75% - 85%: Subtle camera zoom/settle
    const zoomProgress = Math.max(0, Math.min(1, (scroll - 0.75) / 0.1));
    const easeZoom = 1 - Math.pow(1 - zoomProgress, 3);
    state.camera.position.z = 8.5 - easeZoom * 0.8; // Zoom in ~10%
    state.camera.position.x = 0; // perfectly centered
  });

  return (
    <group ref={groupRef} dispose={null}>
      <mesh geometry={nodes.Tote_Artwork.geometry} material={artworkMaterial} />
      <mesh geometry={nodes.Tote_Body.geometry} material={blackBagMaterial} />
      <mesh geometry={nodes.Tote_Front.geometry} material={blackBagMaterial} />
    </group>
  );
}

export function ScrollToteCanvas({ scrollYProgress }: ScrollToteCanvasProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 25 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />

        <rectAreaLight
          width={6}
          height={6}
          color="#ffffff"
          intensity={16}
          position={[-3, 4, 3]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />

        <spotLight
          position={[4, 5, -3]}
          intensity={4}
          angle={0.6}
          penumbra={1}
          color="#eaf2ff"
          castShadow
        />

        <React.Suspense fallback={null}>
          <ScrollToteModel scrollYProgress={scrollYProgress} />
        </React.Suspense>

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.65}
          scale={22}
          blur={12}
          far={5}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3Dmodel/tote_web.glb");
useTexture.preload("/images/illustration1.png");

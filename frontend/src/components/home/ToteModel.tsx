import * as THREE from 'three'
import React, { useMemo } from 'react'
import { useGraph, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Tote_Artwork: THREE.Mesh
    Tote_Body: THREE.Mesh
    Tote_Front: THREE.Mesh
  }
  materials: {
    Artwork_Material: THREE.MeshStandardMaterial
    Bag_Material: THREE.MeshStandardMaterial
  }
}

export function ToteModel(props: React.ComponentProps<'group'> & { textureIndex?: number }) {
  const { textureIndex = 0, ...groupProps } = props;

  const { scene } = useGLTF('/3Dmodel/tote_web.glb')
  // Clone the scene so we can reuse the model if needed, and to avoid mutating the original
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult
  
  const { gl } = useThree()
  
  const textureArray = useTexture([
    '/images/illustration1.png',
    '/images/illustration2.png',
    '/images/illustration3.png',
    '/images/illustration4.png',
    '/images/illustration5.png'
  ]);
  
  // Pre-create a material for each texture so we can crossfade them smoothly
  const artworkMaterials = useMemo(() => {
    return textureArray.map((tex, i) => {
      const clonedTexture = tex.clone()
      clonedTexture.flipY = true
      clonedTexture.colorSpace = THREE.SRGBColorSpace
      clonedTexture.minFilter = THREE.LinearMipMapLinearFilter
      clonedTexture.magFilter = THREE.LinearFilter
      clonedTexture.anisotropy = gl.capabilities.getMaxAnisotropy()
      clonedTexture.generateMipmaps = true
      
      // Scale the artwork to ~60% size and center it
      const printScale = 1.6
      clonedTexture.repeat.set(printScale, printScale)
      // Offset to center. Add a tiny vertical bump (0.02) to visually center it above the base
      clonedTexture.offset.set((1 - printScale) / 2, (1 - printScale) / 2 + 0.02)
      clonedTexture.wrapS = THREE.ClampToEdgeWrapping
      clonedTexture.wrapT = THREE.ClampToEdgeWrapping
      
      clonedTexture.needsUpdate = true
      
      const mat = materials.Artwork_Material.clone()
      mat.map = clonedTexture
      mat.transparent = true
      mat.toneMapped = false
      // Initialize only the first material as visible
      mat.opacity = i === 0 ? 1 : 0 
      
      // Fix z-fighting against the base canvas, AND against the other decal layers during crossfade
      mat.depthWrite = false
      mat.polygonOffset = true
      mat.polygonOffsetFactor = -4 - (i * 0.1) 
      mat.polygonOffsetUnits = -4
      
      mat.needsUpdate = true
      return mat
    })
  }, [textureArray, materials.Artwork_Material, gl])

  // Smoothly crossfade opacities on every frame
  useFrame((state, delta) => {
    const activeIndex = textureIndex % textureArray.length
    artworkMaterials.forEach((mat, i) => {
      const targetOpacity = i === activeIndex ? 1 : 0
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 6, delta)
      
      // Prevent additive specular highlights from fully transparent materials (which causes the glow)
      mat.visible = mat.opacity > 0.005
    })
  })
  
  return (
    <group {...groupProps} dispose={null}>
      {/* Decal layers - all 3 render simultaneously to allow smooth crossfading */}
      {artworkMaterials.map((mat, i) => (
        <mesh key={i} geometry={nodes.Tote_Artwork.geometry} material={mat} />
      ))}
      
      {/* Base black cotton layers */}
      <mesh geometry={nodes.Tote_Body.geometry} material={materials.Bag_Material} />
      <mesh geometry={nodes.Tote_Front.geometry} material={materials.Bag_Material} />
    </group>
  )
}

useGLTF.preload('/3Dmodel/tote_web.glb')
useTexture.preload([
  '/images/illustration1.png',
  '/images/illustration2.png',
  '/images/illustration3.png',
  '/images/illustration4.png',
  '/images/illustration5.png'
])

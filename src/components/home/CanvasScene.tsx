import React, { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { ToteModel } from './ToteModel'
import { MotionValue } from 'framer-motion'

interface CanvasSceneProps {
  scrollYProgress: MotionValue<number>;
  textureIndex: number;
}

export function CanvasScene({ scrollYProgress, textureIndex }: CanvasSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const rectLightRef = useRef<THREE.RectAreaLight>(null)
  
  // Easing values for smooth interpolation
  const currentRotation = useRef(new THREE.Vector2(0, 0))
  const targetRotation = useRef(new THREE.Vector2(0, 0))
  
  useLayoutEffect(() => {
    if (rectLightRef.current) {
      rectLightRef.current.lookAt(0, 0, 0)
    }
  }, [])
  
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const scroll = scrollYProgress.get()

    // 1. Continuous Floating Animation (10 seconds cycle)
    const time = state.clock.getElapsedTime()
    const floatY = Math.sin(time * 0.628) * 0.04
    const floatRotX = Math.sin(time * 0.628) * (Math.PI / 90) // ±2 degrees
    const floatRotY = Math.cos(time * 0.628) * (Math.PI / 90)
    
    // 2. Mouse Interaction (Max 4 degrees)
    const maxRot = Math.PI / 45 // 4 degrees in radians
    targetRotation.current.x = (state.pointer.y * maxRot)
    targetRotation.current.y = (state.pointer.x * maxRot)
    
    // Damped interpolation for smooth mouse tracking (heavy, apple-like)
    currentRotation.current.x = THREE.MathUtils.damp(currentRotation.current.x, targetRotation.current.x, 3, delta)
    currentRotation.current.y = THREE.MathUtils.damp(currentRotation.current.y, targetRotation.current.y, 3, delta)

    const isMobile = state.size.width < 768;

    // 3. Apply combined transformations
    // Lower the bag slightly so the composition feels grounded
    const baseY = isMobile ? -1.75 : -1.4
    groupRef.current.position.y = baseY + floatY
    
    // Scroll rotation changes slightly (e.g. 5 degrees max)
    const scrollRotY = scroll * (Math.PI / 36)
    
    // Base rotation (11 degrees Y) so it has more depth but front is clearly visible
    const baseRotY = Math.PI / 16
    
    // Base tilt (7 degrees Z clockwise) for premium editorial look
    const baseRotZ = -Math.PI / 25
    
    // Base rotation + float + mouse + scroll
    groupRef.current.rotation.x = floatRotX + currentRotation.current.x
    groupRef.current.rotation.y = baseRotY + floatRotY + currentRotation.current.y + scrollRotY
    groupRef.current.rotation.z = baseRotZ

    // Keep the tote bag consistently on the right side of the screen
    // by positioning it relative to the viewport width, preventing text overlap.
    // On mobile, center it horizontally.
    const targetX = isMobile ? 0 : state.viewport.width * 0.2
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 2, delta)

    // 4. Cinematic Scroll Scaling & Camera
    // Increased scale by 10-15% as requested
    const targetScale = isMobile ? THREE.MathUtils.lerp(0.34, 0.38, scroll) : THREE.MathUtils.lerp(0.42, 0.46, scroll)
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta))
    
    // Camera starts at 7 and pushes in to 6.2
    const targetCamZ = THREE.MathUtils.lerp(7, 6.2, scroll)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCamZ, 4, delta)
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      
      {/* Stronger key light to reveal fabric folds */}
      <rectAreaLight 
        ref={rectLightRef}
        width={6} 
        height={6} 
        color="#ffffff" 
        intensity={16} 
        position={[-3, 4, 3]} 
      />
      
      {/* Stronger rim light for background separation */}
      <spotLight 
        position={[4, 5, -3]} 
        intensity={4} 
        angle={0.6} 
        penumbra={1} 
        color="#eaf2ff"
        castShadow
      />

      <group ref={groupRef}>
        <ToteModel textureIndex={textureIndex} />
      </group>

      {/* 1. Large, heavily blurred ambient shadow behind the tote for spatial depth */}
      <ContactShadows
        position={[0, -0.5, -1.5]} 
        rotation={[Math.PI / 2, 0, 0]}
        opacity={0.2} 
        scale={14} 
        blur={8} 
        far={4} 
        color="#2A3218" 
      />

      {/* 2. Secondary grounded contact shadow underneath */}
      <ContactShadows 
        position={[0, -1.45, 0]} 
        opacity={0.25} 
        scale={8} 
        blur={4} 
        far={2} 
        color="#2A3218"
      />
    </>
  )
}

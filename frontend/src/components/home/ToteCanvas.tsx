import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { CanvasScene } from './CanvasScene'
import { MotionValue } from 'framer-motion'

interface ToteCanvasProps {
  scrollYProgress: MotionValue<number>;
  textureIndex: number;
}

export function ToteCanvas({ scrollYProgress, textureIndex }: ToteCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0.15, 7], fov: 25 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <CanvasScene scrollYProgress={scrollYProgress} textureIndex={textureIndex} />
        </Suspense>
      </Canvas>
    </div>
  )
}

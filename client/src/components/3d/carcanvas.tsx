import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Environment, OrbitControls, Bounds } from '@react-three/drei'
import CarModel from './CarModel'
import Loader from './Loader'

export default function CarCanvas() {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative' }}>
      <Canvas shadows dpr={[1,2]} camera={{ fov:45, position:[4,2,6], near:0.1, far:100 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5,10,5]} intensity={1.2} castShadow shadow-mapSize={[1024,1024]} />
        <Suspense fallback={<Loader />}>
          <Environment preset="city" />
          <Bounds fit clip observe margin={1.2}>
            <CarModel />
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enableDamping />
      </Canvas>
    </div>
  )
}

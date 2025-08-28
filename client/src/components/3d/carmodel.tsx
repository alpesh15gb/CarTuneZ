import { useEffect } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const GLB_PATH = '/models/car.glb' // file must exist at client/public/models/car.glb

export default function CarModel({ color = '#1565c0' }: { color?: string }) {
  const { scene } = useGLTF(GLB_PATH)

  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!(m as any).isMesh) return
      const orig = m.material as THREE.MeshStandardMaterial | undefined
      if (orig) m.material = orig.clone() // avoid shared-material bugs in prod
      const mat = m.material as THREE.MeshStandardMaterial
      if (m.name.toLowerCase().includes('body')) {
        mat.color = new THREE.Color(color)
        mat.metalness = 0.7
        mat.roughness = 0.3
      }
      m.castShadow = m.receiveShadow = true
    })
  }, [scene, color])

  return <primitive object={scene} />
}

useGLTF.preload(GLB_PATH)

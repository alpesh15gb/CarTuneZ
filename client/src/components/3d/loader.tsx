import { Html, useProgress } from '@react-three/drei'
export default function Loader() {
  const { progress, active, item } = useProgress()
  if (!active) return null
  return (
    <Html center>
      <div style={{padding:'10px 14px',borderRadius:12,background:'rgba(0,0,0,0.6)',color:'#fff'}}>
        Loading… {Math.round(progress)}%
        <div style={{opacity:.7}}>{item || 'assets'}</div>
      </div>
    </Html>
  )
}

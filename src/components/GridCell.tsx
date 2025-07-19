import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface GridCellProps {
  x: number
  z: number
  hasBuilding: boolean
  isHovered: boolean
  canPlace: boolean
  isDeleteMode: boolean
  onClick: () => void
}

export default function GridCell({ 
  x, 
  z, 
  hasBuilding, 
  canPlace, 
  isDeleteMode, 
  onClick 
}: GridCellProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && (canPlace || isDeleteMode)) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3 + x + z) * 0.02
    }
  })

  const getColor = () => {
    if (isDeleteMode) return '#ef4444'
    if (canPlace && hovered) return '#10b981'
    if (canPlace) return '#374151'
    return '#1f2937'
  }

  const getOpacity = () => {
    if (hasBuilding) return 0.1
    if (canPlace || isDeleteMode) return 0.8
    return 0.3
  }

  return (
    <mesh
      ref={meshRef}
      position={[x - 5 + 0.5, -0.01, z - 5 + 0.5]}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[0.9, 0.02, 0.9]} />
      <meshStandardMaterial 
        color={getColor()} 
        transparent 
        opacity={getOpacity()}
        emissive={hovered && (canPlace || isDeleteMode) ? getColor() : '#000000'}
        emissiveIntensity={hovered && (canPlace || isDeleteMode) ? 0.2 : 0}
      />
    </mesh>
  )
}
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { Building } from '../types/game'

interface Building3DProps {
  building: Building
  position: [number, number, number]
}

export default function Building3D({ building, position }: Building3DProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.05 + getBuildingHeight() / 2
    } else if (meshRef.current) {
      meshRef.current.position.y = getBuildingHeight() / 2
    }
  })

  const getBuildingHeight = () => {
    switch (building.type) {
      case 'house': return 1
      case 'office': return 2
      case 'park': return 0.5
      case 'road': return 0.1
      default: return 1
    }
  }

  const getBuildingColor = () => {
    switch (building.type) {
      case 'house': return '#3B82F6'
      case 'office': return '#8B5CF6'
      case 'park': return '#10B981'
      case 'road': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const getBuildingGeometry = () => {
    const height = getBuildingHeight()
    switch (building.type) {
      case 'house':
        return <boxGeometry args={[0.7, height, 0.7]} />
      case 'office':
        return <boxGeometry args={[0.8, height, 0.8]} />
      case 'park':
        return <cylinderGeometry args={[0.3, 0.3, height, 8]} />
      case 'road':
        return <boxGeometry args={[0.9, height, 0.9]} />
      default:
        return <boxGeometry args={[0.7, height, 0.7]} />
    }
  }

  const getEmissiveIntensity = () => {
    if (hovered) return 0.3
    if (building.type === 'office') return 0.1
    return 0
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {getBuildingGeometry()}
        <meshStandardMaterial 
          color={getBuildingColor()}
          emissive={getBuildingColor()}
          emissiveIntensity={getEmissiveIntensity()}
        />
      </mesh>
      
      {/* Office building windows */}
      {building.type === 'office' && (
        <>
          <mesh position={[0.35, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.35, 0.5, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.5, 0.35]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.5, -0.35]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
      
      {/* Park trees */}
      {building.type === 'park' && (
        <>
          <mesh position={[0.2, 0.6, 0.2]}>
            <coneGeometry args={[0.1, 0.4, 6]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[-0.2, 0.6, -0.2]}>
            <coneGeometry args={[0.1, 0.4, 6]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          <mesh position={[0.2, 0.6, -0.2]}>
            <coneGeometry args={[0.08, 0.3, 6]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </>
      )}
    </group>
  )
}
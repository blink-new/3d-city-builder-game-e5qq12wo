import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Building } from '../types/game'
import { BUILDING_CONFIGS } from '../data/buildingConfigs'

interface Enhanced3DBuildingProps {
  building: Building
  isSelected?: boolean
  onUpgrade?: () => void
}

export default function Enhanced3DBuilding({ 
  building, 
  isSelected = false,
  onUpgrade 
}: Enhanced3DBuildingProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [constructionAnimation, setConstructionAnimation] = useState(0)
  
  const config = BUILDING_CONFIGS[building.type]

  // Construction animation
  useEffect(() => {
    if (building.isConstructing) {
      const interval = setInterval(() => {
        setConstructionAnimation(prev => {
          const newProgress = prev + 0.02
          if (newProgress >= 1) {
            clearInterval(interval)
            return 1
          }
          return newProgress
        })
      }, 50)
      return () => clearInterval(interval)
    } else {
      setConstructionAnimation(1)
    }
  }, [building.isConstructing])

  // Floating animation for selected buildings
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + getBaseHeight()
    }
  })

  if (!config) return null

  function getBaseHeight(): number {
    const baseHeights: Record<string, number> = {
      house: 1.5,
      apartment: 3,
      mansion: 2.5,
      shop: 2,
      office: 4,
      skyscraper: 8,
      park: 0.2,
      fountain: 1,
      stadium: 3,
      road: 0.1,
      bridge: 1.5,
      highway: 0.2,
      factory: 3.5,
      powerplant: 5,
      airport: 2
    }
    return (baseHeights[building.type] || 1) * building.level * 0.3 + baseHeights[building.type] || 1
  }

  function getBuildingGeometry() {
    const height = getBaseHeight() * constructionAnimation
    const color = config.color

    switch (building.type) {
      case 'house':
        return (
          <group>
            {/* Main structure */}
            <mesh position={[0, height/2, 0]}>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshLambertMaterial color={color} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, height + 0.2, 0]}>
              <coneGeometry args={[0.6, 0.4, 4]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            {/* Door */}
            <mesh position={[0, height/4, 0.41]}>
              <boxGeometry args={[0.2, height/2, 0.02]} />
              <meshLambertMaterial color="#654321" />
            </mesh>
            {/* Windows */}
            <mesh position={[0.3, height*0.7, 0.41]}>
              <boxGeometry args={[0.15, 0.15, 0.02]} />
              <meshLambertMaterial color="#87CEEB" />
            </mesh>
            <mesh position={[-0.3, height*0.7, 0.41]}>
              <boxGeometry args={[0.15, 0.15, 0.02]} />
              <meshLambertMaterial color="#87CEEB" />
            </mesh>
          </group>
        )

      case 'apartment':
        return (
          <group>
            {/* Main building */}
            <mesh position={[0, height/2, 0]}>
              <boxGeometry args={[0.9, height, 0.9]} />
              <meshLambertMaterial color={color} />
            </mesh>
            {/* Balconies */}
            {Array.from({ length: Math.floor(height) }, (_, i) => (
              <mesh key={i} position={[0.46, (i + 0.5) * (height / Math.floor(height)), 0]}>
                <boxGeometry args={[0.08, 0.1, 0.6]} />
                <meshLambertMaterial color="#666" />
              </mesh>
            ))}
            {/* Windows grid */}
            {Array.from({ length: Math.floor(height * 2) }, (_, i) => (
              <group key={i}>
                <mesh position={[0.2, (i + 0.5) * (height / (Math.floor(height * 2))), 0.46]}>
                  <boxGeometry args={[0.1, 0.1, 0.02]} />
                  <meshLambertMaterial color="#87CEEB" />
                </mesh>
                <mesh position={[-0.2, (i + 0.5) * (height / (Math.floor(height * 2))), 0.46]}>
                  <boxGeometry args={[0.1, 0.1, 0.02]} />
                  <meshLambertMaterial color="#87CEEB" />
                </mesh>
              </group>
            ))}
          </group>
        )

      case 'skyscraper':
        return (
          <group>
            {/* Main tower */}
            <mesh position={[0, height/2, 0]}>
              <boxGeometry args={[0.7, height, 0.7]} />
              <meshLambertMaterial color={color} />
            </mesh>
            {/* Glass facade */}
            <mesh position={[0, height/2, 0.36]}>
              <boxGeometry args={[0.6, height * 0.95, 0.02]} />
              <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.36, height/2, 0]}>
              <boxGeometry args={[0.02, height * 0.95, 0.6]} />
              <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
            </mesh>
            {/* Antenna */}
            <mesh position={[0, height + 0.5, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1]} />
              <meshLambertMaterial color="#FF0000" />
            </mesh>
            {/* Blinking light */}
            <mesh position={[0, height + 1, 0]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="#FF0000" />
            </mesh>
          </group>
        )

      case 'park':
        return (
          <group>
            {/* Grass base */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.9, 0.1, 0.9]} />
              <meshLambertMaterial color="#228B22" />
            </mesh>
            {/* Trees */}
            <mesh position={[0.2, 0.3, 0.2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0.2, 0.6, 0.2]}>
              <sphereGeometry args={[0.15]} />
              <meshLambertMaterial color="#228B22" />
            </mesh>
            <mesh position={[-0.2, 0.25, -0.2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
            <mesh position={[-0.2, 0.5, -0.2]}>
              <sphereGeometry args={[0.12]} />
              <meshLambertMaterial color="#228B22" />
            </mesh>
            {/* Bench */}
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.4, 0.05, 0.1]} />
              <meshLambertMaterial color="#8B4513" />
            </mesh>
          </group>
        )

      case 'factory':
        return (
          <group>
            {/* Main building */}
            <mesh position={[0, height/2, 0]}>
              <boxGeometry args={[1, height, 0.8]} />
              <meshLambertMaterial color={color} />
            </mesh>
            {/* Smokestacks */}
            <mesh position={[0.3, height + 0.5, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 1]} />
              <meshLambertMaterial color="#666" />
            </mesh>
            <mesh position={[-0.3, height + 0.3, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.6]} />
              <meshLambertMaterial color="#666" />
            </mesh>
            {/* Smoke particles */}
            <mesh position={[0.3, height + 1.2, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#888" transparent opacity={0.5} />
            </mesh>
          </group>
        )

      case 'road':
        return (
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.9, 0.04, 0.9]} />
            <meshLambertMaterial color={color} />
          </mesh>
        )

      default:
        return (
          <mesh position={[0, height/2, 0]}>
            <boxGeometry args={[0.8, height, 0.8]} />
            <meshLambertMaterial color={color} />
          </mesh>
        )
    }
  }

  return (
    <group
      ref={meshRef}
      position={[building.x, isSelected ? getBaseHeight() : getBaseHeight(), building.z]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onUpgrade}
    >
      {getBuildingGeometry()}
      
      {/* Level indicator */}
      {building.level > 1 && (
        <Text
          position={[0, getBaseHeight() + 0.5, 0]}
          fontSize={0.2}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          Lv.{building.level}
        </Text>
      )}
      
      {/* Construction progress */}
      {building.isConstructing && (
        <Text
          position={[0, getBaseHeight() + 0.8, 0]}
          fontSize={0.15}
          color="#00FF00"
          anchorX="center"
          anchorY="middle"
        >
          {Math.floor(building.constructionProgress * 100)}%
        </Text>
      )}
      
      {/* Hover effect */}
      {hovered && (
        <mesh position={[0, 0.01, 0]}>
          <ringGeometry args={[0.6, 0.8, 16]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Selection effect */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]}>
          <ringGeometry args={[0.7, 0.9, 16]} />
          <meshBasicMaterial color="#00FF00" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Building, BuildingType } from '../types/game'
import GridCell from './GridCell'
import Building3D from './Building3D'

interface CityGridProps {
  buildings: Building[]
  onCellClick: (x: number, z: number) => void
  selectedBuildingType: BuildingType | null
  isDeleteMode: boolean
}

const GRID_SIZE = 10

export default function CityGrid({ 
  buildings, 
  onCellClick, 
  selectedBuildingType, 
  isDeleteMode 
}: CityGridProps) {
  const gridRef = useRef<any>()

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })

  const cells = []
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      const hasBuilding = buildings.some(b => b.x === x && b.z === z)
      cells.push(
        <GridCell
          key={`${x}-${z}`}
          x={x}
          z={z}
          hasBuilding={hasBuilding}
          isHovered={false}
          canPlace={!hasBuilding && selectedBuildingType !== null}
          isDeleteMode={isDeleteMode && hasBuilding}
          onClick={() => onCellClick(x, z)}
        />
      )
    }
  }

  return (
    <group ref={gridRef}>
      {/* Grid cells */}
      {cells}
      
      {/* Buildings */}
      {buildings.map((building) => (
        <Building3D
          key={building.id}
          building={building}
          position={[building.x - GRID_SIZE/2 + 0.5, 0, building.z - GRID_SIZE/2 + 0.5]}
        />
      ))}
    </group>
  )
}
import { useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useGameEngine } from '../hooks/useGameEngine'
import ProgressiveGameUI from './ProgressiveGameUI'
import Enhanced3DBuilding from './Enhanced3DBuilding'
import { BuildingType } from '../types/game'

// Enhanced 3D Grid Component
function Enhanced3DGrid({ 
  buildings, 
  onCellClick, 
  selectedBuildingType, 
  isDeleteMode 
}: {
  buildings: any[]
  onCellClick: (x: number, z: number) => void
  selectedBuildingType: BuildingType | null
  isDeleteMode: boolean
}) {
  const gridSize = 20
  const cellSize = 1

  // Generate grid cells
  const gridCells = []
  for (let x = -gridSize/2; x < gridSize/2; x++) {
    for (let z = -gridSize/2; z < gridSize/2; z++) {
      const hasBuilding = buildings.some(b => b.x === x && b.z === z)
      
      gridCells.push(
        <mesh
          key={`${x}-${z}`}
          position={[x, 0, z]}
          onClick={() => onCellClick(x, z)}
          onPointerEnter={(e) => {
            e.object.material.color.setHex(
              hasBuilding ? 0x444444 : 
              isDeleteMode ? 0xff4444 : 
              selectedBuildingType ? 0x44ff44 : 0x333333
            )
          }}
          onPointerLeave={(e) => {
            e.object.material.color.setHex(hasBuilding ? 0x222222 : 0x111111)
          }}
        >
          <boxGeometry args={[cellSize * 0.95, 0.05, cellSize * 0.95]} />
          <meshLambertMaterial 
            color={hasBuilding ? 0x222222 : 0x111111} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      )
    }
  }

  return (
    <group>
      {/* Grid cells */}
      {gridCells}
      
      {/* Buildings */}
      {buildings.map(building => (
        <Enhanced3DBuilding
          key={building.id}
          building={building}
          isSelected={false}
        />
      ))}
      
      {/* Ground plane */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[gridSize, 0.1, gridSize]} />
        <meshLambertMaterial color="#0a0a0a" />
      </mesh>
    </group>
  )
}

export default function ProgressiveCityBuilder() {
  const { 
    gameState, 
    setGameState,
    placeBuilding, 
    deleteBuilding, 
    upgradeBuilding,
    calculateStats 
  } = useGameEngine()
  
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  
  const stats = calculateStats()

  const handleCellClick = useCallback((x: number, z: number) => {
    if (gameState.isDeleteMode) {
      deleteBuilding(x, z)
    } else if (gameState.selectedBuildingType) {
      placeBuilding(x, z, gameState.selectedBuildingType)
    }
  }, [gameState.selectedBuildingType, gameState.isDeleteMode, placeBuilding, deleteBuilding])

  const handleBuildingSelect = (type: BuildingType | null) => {
    setGameState(prev => ({
      ...prev,
      selectedBuildingType: type,
      isDeleteMode: false
    }))
  }

  const handleDeleteModeToggle = () => {
    setGameState(prev => ({
      ...prev,
      isDeleteMode: !prev.isDeleteMode,
      selectedBuildingType: null
    }))
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [12, 12, 12], fov: 60 }}
        className="w-full h-full"
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[20, 20, 10]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#4A90E2" />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* 3D Scene */}
        <Enhanced3DGrid 
          buildings={gameState.buildings}
          onCellClick={handleCellClick}
          selectedBuildingType={gameState.selectedBuildingType}
          isDeleteMode={gameState.isDeleteMode}
        />
        
        {/* Enhanced Camera Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={8}
          maxDistance={30}
          panSpeed={1}
          zoomSpeed={1.2}
          rotateSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Progressive UI Overlay */}
      <ProgressiveGameUI
        gameState={gameState}
        onBuildingSelect={handleBuildingSelect}
        onDeleteModeToggle={handleDeleteModeToggle}
        incomePerSecond={stats.incomePerSecond}
      />

      {/* Level Up Notification */}
      {/* This would be triggered by the game engine when level increases */}
      
      {/* Achievement Unlock Notification */}
      {/* This would be triggered when achievements are unlocked */}
      
      {/* Construction Complete Notifications */}
      {/* This would show when buildings finish construction */}
    </div>
  )
}
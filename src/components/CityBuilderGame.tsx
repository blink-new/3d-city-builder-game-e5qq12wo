import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GameState, BuildingType, Building } from '../types/game'
import GameUI from './GameUI'
import CityGrid from './CityGrid'

const BUILDING_CONFIGS = {
  house: { name: 'House', cost: 500, population: 4, happiness: 0, color: '#3B82F6', icon: '🏠' },
  office: { name: 'Office', cost: 1000, population: 8, happiness: 0, color: '#8B5CF6', icon: '🏢' },
  park: { name: 'Park', cost: 300, population: 0, happiness: 5, color: '#10B981', icon: '🌳' },
  road: { name: 'Road', cost: 100, population: 0, happiness: 0, color: '#6B7280', icon: '🛣️' }
}

export default function CityBuilderGame() {
  const [gameState, setGameState] = useState<GameState>({
    money: 10000,
    population: 0,
    happiness: 50,
    buildings: [],
    selectedBuildingType: null,
    isDeleteMode: false
  })

  const handleCellClick = useCallback((x: number, z: number) => {
    if (gameState.isDeleteMode) {
      // Delete building
      const buildingToDelete = gameState.buildings.find(b => b.x === x && b.z === z)
      if (buildingToDelete) {
        const refund = Math.floor(buildingToDelete.cost * 0.5)
        setGameState(prev => ({
          ...prev,
          money: prev.money + refund,
          buildings: prev.buildings.filter(b => b.id !== buildingToDelete.id),
          population: prev.population - BUILDING_CONFIGS[buildingToDelete.type].population,
          happiness: Math.max(0, prev.happiness - BUILDING_CONFIGS[buildingToDelete.type].happiness)
        }))
      }
    } else if (gameState.selectedBuildingType) {
      // Place building
      const config = BUILDING_CONFIGS[gameState.selectedBuildingType]
      const existingBuilding = gameState.buildings.find(b => b.x === x && b.z === z)
      
      if (!existingBuilding && gameState.money >= config.cost) {
        const newBuilding: Building = {
          id: `${gameState.selectedBuildingType}-${x}-${z}-${Date.now()}`,
          type: gameState.selectedBuildingType,
          x,
          z,
          cost: config.cost
        }

        setGameState(prev => ({
          ...prev,
          money: prev.money - config.cost,
          buildings: [...prev.buildings, newBuilding],
          population: prev.population + config.population,
          happiness: Math.min(100, prev.happiness + config.happiness)
        }))
      }
    }
  }, [gameState.selectedBuildingType, gameState.isDeleteMode, gameState.buildings, gameState.money])

  const handleBuildingSelect = useCallback((type: BuildingType | null) => {
    setGameState(prev => ({
      ...prev,
      selectedBuildingType: type,
      isDeleteMode: false
    }))
  }, [])

  const handleDeleteModeToggle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isDeleteMode: !prev.isDeleteMode,
      selectedBuildingType: null
    }))
  }, [])

  return (
    <div className="w-full h-screen bg-slate-900 relative overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <CityGrid 
          buildings={gameState.buildings}
          onCellClick={handleCellClick}
          selectedBuildingType={gameState.selectedBuildingType}
          isDeleteMode={gameState.isDeleteMode}
        />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={25}
        />
      </Canvas>

      {/* UI Overlay */}
      <GameUI
        gameState={gameState}
        buildingConfigs={BUILDING_CONFIGS}
        onBuildingSelect={handleBuildingSelect}
        onDeleteModeToggle={handleDeleteModeToggle}
      />
    </div>
  )
}
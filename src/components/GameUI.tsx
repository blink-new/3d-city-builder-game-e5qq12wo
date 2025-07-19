import { GameState, BuildingType } from '../types/game'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Trash2, Home, Building2, Trees, Minus } from 'lucide-react'

interface GameUIProps {
  gameState: GameState
  buildingConfigs: Record<BuildingType, any>
  onBuildingSelect: (type: BuildingType | null) => void
  onDeleteModeToggle: () => void
}

const BUILDING_ICONS = {
  house: Home,
  office: Building2,
  park: Trees,
  road: Minus
}

export default function GameUI({ 
  gameState, 
  buildingConfigs, 
  onBuildingSelect, 
  onDeleteModeToggle 
}: GameUIProps) {
  return (
    <>
      {/* Stats Panel */}
      <Card className="absolute top-4 left-4 p-4 bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-400">💰</span>
            <span className="font-medium">${gameState.money.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">👥</span>
            <span className="font-medium">{gameState.population.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">😊</span>
            <span className="font-medium">{gameState.happiness}%</span>
          </div>
        </div>
      </Card>

      {/* Building Toolbar */}
      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-slate-800/90 border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {Object.entries(buildingConfigs).map(([type, config]) => {
            const IconComponent = BUILDING_ICONS[type as BuildingType]
            const isSelected = gameState.selectedBuildingType === type
            const canAfford = gameState.money >= config.cost
            
            return (
              <Button
                key={type}
                variant={isSelected ? "default" : "outline"}
                size="lg"
                className={`flex flex-col items-center gap-1 h-auto py-3 px-4 ${
                  isSelected 
                    ? 'bg-blue-600 hover:bg-blue-700 border-blue-500' 
                    : canAfford 
                      ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                }`}
                onClick={() => onBuildingSelect(type as BuildingType)}
                disabled={!canAfford}
                title={`${config.name} - $${config.cost}`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{config.name}</span>
                <span className="text-xs opacity-75">${config.cost}</span>
              </Button>
            )
          })}
          
          {/* Delete Tool */}
          <Button
            variant={gameState.isDeleteMode ? "destructive" : "outline"}
            size="lg"
            className={`flex flex-col items-center gap-1 h-auto py-3 px-4 ${
              gameState.isDeleteMode 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white'
            }`}
            onClick={onDeleteModeToggle}
            title="Delete buildings (50% refund)"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-xs font-medium">Delete</span>
            <span className="text-xs opacity-75">50% back</span>
          </Button>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="absolute top-4 right-4 p-4 bg-slate-800/90 border-slate-700 text-white backdrop-blur-sm max-w-xs">
        <h3 className="font-semibold mb-2">How to Play</h3>
        <ul className="text-sm space-y-1 opacity-90">
          <li>• Select a building and click on the grid to place it</li>
          <li>• Use mouse to zoom, pan, and rotate the camera</li>
          <li>• Houses and offices add population</li>
          <li>• Parks increase city happiness</li>
          <li>• Roads connect your city infrastructure</li>
          <li>• Use delete tool to remove buildings (50% refund)</li>
        </ul>
      </Card>
    </>
  )
}
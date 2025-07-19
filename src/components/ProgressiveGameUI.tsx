import { useState } from 'react'
import { GameState, BuildingType } from '../types/game'
import { BUILDING_CONFIGS, getRequiredXP } from '../data/buildingConfigs'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Trophy, 
  Star, 
  Coins, 
  Users, 
  Heart, 
  Zap,
  Home,
  Building2,
  Trees,
  Minus,
  Factory,
  Trash2,
  Menu,
  TrendingUp,
  Award,
  Target
} from 'lucide-react'

interface ProgressiveGameUIProps {
  gameState: GameState
  onBuildingSelect: (type: BuildingType | null) => void
  onDeleteModeToggle: () => void
  incomePerSecond: number
}

const BUILDING_ICONS = {
  house: Home,
  apartment: Building2,
  mansion: Home,
  shop: Building2,
  office: Building2,
  skyscraper: Building2,
  park: Trees,
  fountain: Trees,
  stadium: Building2,
  road: Minus,
  bridge: Minus,
  highway: Minus,
  factory: Factory,
  powerplant: Zap,
  airport: Building2
}

const CATEGORY_COLORS = {
  residential: 'bg-blue-500',
  commercial: 'bg-purple-500',
  recreation: 'bg-green-500',
  infrastructure: 'bg-gray-500',
  industrial: 'bg-orange-500'
}

export default function ProgressiveGameUI({ 
  gameState, 
  onBuildingSelect, 
  onDeleteModeToggle,
  incomePerSecond 
}: ProgressiveGameUIProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('residential')
  
  const requiredXP = getRequiredXP(gameState.level)
  const xpProgress = (gameState.experience / requiredXP) * 100
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked)
  const availableBuildings = Object.values(BUILDING_CONFIGS).filter(config => 
    gameState.unlockedBuildings.includes(config.type) && config.category === selectedCategory
  )

  const categories = [
    { id: 'residential', name: 'Homes', icon: Home },
    { id: 'commercial', name: 'Business', icon: Building2 },
    { id: 'recreation', name: 'Fun', icon: Trees },
    { id: 'infrastructure', name: 'Roads', icon: Minus },
    { id: 'industrial', name: 'Industry', icon: Factory }
  ]

  // Desktop Stats Panel
  const StatsPanel = () => (
    <Card className="p-4 bg-slate-800/95 border-slate-700 text-white backdrop-blur-sm">
      <div className="space-y-3">
        {/* Level and XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Level {gameState.level}</span>
            </div>
            <span className="text-sm text-slate-300">{gameState.experience}/{requiredXP} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Resources */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">${gameState.money.toLocaleString()}</span>
            </div>
            <div className="text-xs text-green-400">+${incomePerSecond.toFixed(1)}/s</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">{gameState.population.toLocaleString()}</span>
            </div>
            <div className="text-xs text-slate-400">Population</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium">{gameState.happiness}%</span>
            </div>
            <div className="text-xs text-slate-400">Happiness</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">{unlockedAchievements.length}</span>
            </div>
            <div className="text-xs text-slate-400">Achievements</div>
          </div>
        </div>
      </div>
    </Card>
  )

  // Building Categories
  const BuildingCategories = () => (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {categories.map(category => {
        const IconComponent = category.icon
        const isSelected = selectedCategory === category.id
        const availableCount = Object.values(BUILDING_CONFIGS).filter(config => 
          gameState.unlockedBuildings.includes(config.type) && config.category === category.id
        ).length
        
        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 whitespace-nowrap ${
              isSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <IconComponent className="w-4 h-4" />
            <span>{category.name}</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {availableCount}
            </Badge>
          </Button>
        )
      })}
    </div>
  )

  // Building Grid
  const BuildingGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {availableBuildings.map(config => {
        const IconComponent = BUILDING_ICONS[config.type] || Building2
        const isSelected = gameState.selectedBuildingType === config.type
        const canAfford = gameState.money >= config.baseCost
        const isUnlocked = gameState.level >= config.unlockLevel
        
        return (
          <Button
            key={config.type}
            variant={isSelected ? "default" : "outline"}
            className={`flex flex-col items-center gap-2 h-auto py-4 px-3 relative ${
              isSelected 
                ? 'bg-blue-600 hover:bg-blue-700 border-blue-500' 
                : canAfford && isUnlocked
                  ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            }`}
            onClick={() => isUnlocked && canAfford ? onBuildingSelect(config.type) : null}
            disabled={!canAfford || !isUnlocked}
            title={`${config.name} - $${config.baseCost} (Level ${config.unlockLevel})`}
          >
            {!isUnlocked && (
              <div className="absolute top-1 right-1">
                <Badge variant="secondary" className="text-xs">
                  Lv.{config.unlockLevel}
                </Badge>
              </div>
            )}
            
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${CATEGORY_COLORS[config.category]}`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium">{config.name}</div>
              <div className="text-xs opacity-75">${config.baseCost}</div>
              {config.baseIncome > 0 && (
                <div className="text-xs text-green-400">+${config.baseIncome}/5s</div>
              )}
            </div>
          </Button>
        )
      })}
      
      {/* Delete Tool */}
      <Button
        variant={gameState.isDeleteMode ? "destructive" : "outline"}
        className={`flex flex-col items-center gap-2 h-auto py-4 px-3 ${
          gameState.isDeleteMode 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white'
        }`}
        onClick={onDeleteModeToggle}
        title="Delete buildings (50% refund)"
      >
        <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-white" />
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">Delete</div>
          <div className="text-xs opacity-75">50% back</div>
        </div>
      </Button>
    </div>
  )

  // Achievements Panel
  const AchievementsPanel = () => (
    <div className="space-y-3">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-400" />
        Achievements ({unlockedAchievements.length}/{gameState.achievements.length})
      </h3>
      
      <div className="grid gap-2 max-h-60 overflow-y-auto">
        {gameState.achievements.slice(0, 8).map(achievement => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border ${
              achievement.unlocked 
                ? 'bg-green-900/30 border-green-600' 
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className={`font-medium ${achievement.unlocked ? 'text-green-400' : 'text-white'}`}>
                  {achievement.name}
                </div>
                <div className="text-sm text-slate-400">{achievement.description}</div>
                <div className="mt-1">
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-1"
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {achievement.progress}/{achievement.maxProgress}
                  </div>
                </div>
              </div>
              {achievement.unlocked && (
                <Trophy className="w-5 h-5 text-yellow-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Mobile Bottom Sheet
  if (gameState.showMobileControls) {
    return (
      <>
        {/* Mobile Stats Bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <Card className="p-3 bg-slate-800/95 border-slate-700 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">${(gameState.money / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">{gameState.population}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">Lv.{gameState.level}</span>
                </div>
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900 border-slate-700 text-white">
                  <SheetHeader>
                    <SheetTitle className="text-white">Game Menu</SheetTitle>
                  </SheetHeader>
                  
                  <Tabs defaultValue="stats" className="mt-6">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                      <TabsTrigger value="achievements">Awards</TabsTrigger>
                      <TabsTrigger value="info">Info</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="stats" className="mt-4">
                      <StatsPanel />
                    </TabsContent>
                    
                    <TabsContent value="achievements" className="mt-4">
                      <AchievementsPanel />
                    </TabsContent>
                    
                    <TabsContent value="info" className="mt-4">
                      <Card className="p-4 bg-slate-800 border-slate-700 text-white">
                        <h3 className="font-semibold mb-3">How to Play</h3>
                        <ul className="text-sm space-y-2 text-slate-300">
                          <li>• Tap buildings to place them on the grid</li>
                          <li>• Buildings generate income automatically</li>
                          <li>• Level up to unlock new buildings</li>
                          <li>• Complete achievements for rewards</li>
                          <li>• Keep citizens happy with parks and recreation</li>
                        </ul>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            </div>
          </Card>
        </div>

        {/* Mobile Building Panel */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="p-4 bg-slate-800/95 border-slate-700 backdrop-blur-sm">
            <BuildingCategories />
            <BuildingGrid />
          </Card>
        </div>
      </>
    )
  }

  // Desktop Layout
  return (
    <>
      {/* Desktop Stats Panel */}
      <div className="absolute top-4 left-4 z-10">
        <StatsPanel />
      </div>

      {/* Desktop Achievements Panel */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="p-4 bg-slate-800/95 border-slate-700 text-white backdrop-blur-sm">
          <AchievementsPanel />
        </Card>
      </div>

      {/* Desktop Building Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="p-4 bg-slate-800/95 border-slate-700 backdrop-blur-sm min-w-[600px]">
          <BuildingCategories />
          <BuildingGrid />
        </Card>
      </div>

      {/* Income Notification */}
      {incomePerSecond > 0 && (
        <div className="absolute top-1/2 left-4 z-10">
          <Card className="p-2 bg-green-900/80 border-green-600 text-green-100 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+${incomePerSecond.toFixed(1)}/s</span>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
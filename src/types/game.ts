export interface Building {
  id: string
  type: BuildingType
  x: number
  z: number
  cost: number
  level: number
  constructionProgress: number
  lastIncomeTime: number
  isConstructing: boolean
}

export interface GameState {
  // Core resources
  money: number
  population: number
  happiness: number
  experience: number
  level: number
  
  // Buildings and city
  buildings: Building[]
  selectedBuildingType: BuildingType | null
  isDeleteMode: boolean
  
  // Progression
  unlockedBuildings: BuildingType[]
  achievements: Achievement[]
  dailyChallenge: DailyChallenge | null
  lastPlayTime: number
  
  // Game settings
  autoSaveEnabled: boolean
  soundEnabled: boolean
  
  // Mobile UI
  showMobileControls: boolean
  bottomSheetOpen: boolean
}

export type BuildingType = 
  | 'house' | 'apartment' | 'mansion'
  | 'shop' | 'office' | 'skyscraper'
  | 'park' | 'fountain' | 'stadium'
  | 'road' | 'bridge' | 'highway'
  | 'factory' | 'powerplant' | 'airport'

export interface BuildingConfig {
  type: BuildingType
  name: string
  description: string
  baseCost: number
  basePopulation: number
  baseHappiness: number
  baseIncome: number
  color: string
  icon: string
  unlockLevel: number
  category: 'residential' | 'commercial' | 'recreation' | 'infrastructure' | 'industrial'
  maxLevel: number
  constructionTime: number // in seconds
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  reward: {
    type: 'money' | 'xp' | 'unlock'
    amount?: number
    buildingType?: BuildingType
  }
}

export interface DailyChallenge {
  id: string
  name: string
  description: string
  target: number
  progress: number
  reward: {
    money: number
    xp: number
  }
  expiresAt: number
}

export interface GameStats {
  totalBuildings: number
  totalIncome: number
  cityValue: number
  playTime: number
  buildingsBuilt: Record<BuildingType, number>
}
import { BuildingConfig, BuildingType } from '../types/game'

export const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig> = {
  // Residential Buildings
  house: {
    type: 'house',
    name: 'House',
    description: 'A cozy family home that houses 4 people',
    baseCost: 500,
    basePopulation: 4,
    baseHappiness: 2,
    baseIncome: 50,
    color: '#3B82F6',
    icon: '🏠',
    unlockLevel: 1,
    category: 'residential',
    maxLevel: 5,
    constructionTime: 3
  },
  apartment: {
    type: 'apartment',
    name: 'Apartment',
    description: 'Multi-story housing for more families',
    baseCost: 1200,
    basePopulation: 12,
    baseHappiness: 1,
    baseIncome: 120,
    color: '#6366F1',
    icon: '🏢',
    unlockLevel: 3,
    category: 'residential',
    maxLevel: 8,
    constructionTime: 5
  },
  mansion: {
    type: 'mansion',
    name: 'Mansion',
    description: 'Luxury housing for wealthy citizens',
    baseCost: 5000,
    basePopulation: 2,
    baseHappiness: 8,
    baseIncome: 300,
    color: '#8B5CF6',
    icon: '🏰',
    unlockLevel: 10,
    category: 'residential',
    maxLevel: 3,
    constructionTime: 10
  },

  // Commercial Buildings
  shop: {
    type: 'shop',
    name: 'Shop',
    description: 'Small retail store providing goods',
    baseCost: 800,
    basePopulation: 0,
    baseHappiness: 3,
    baseIncome: 100,
    color: '#10B981',
    icon: '🏪',
    unlockLevel: 2,
    category: 'commercial',
    maxLevel: 5,
    constructionTime: 4
  },
  office: {
    type: 'office',
    name: 'Office',
    description: 'Business building providing jobs',
    baseCost: 1500,
    basePopulation: 0,
    baseHappiness: 1,
    baseIncome: 200,
    color: '#8B5CF6',
    icon: '🏢',
    unlockLevel: 4,
    category: 'commercial',
    maxLevel: 6,
    constructionTime: 6
  },
  skyscraper: {
    type: 'skyscraper',
    name: 'Skyscraper',
    description: 'Massive commercial tower',
    baseCost: 10000,
    basePopulation: 0,
    baseHappiness: 5,
    baseIncome: 800,
    color: '#1E40AF',
    icon: '🏙️',
    unlockLevel: 15,
    category: 'commercial',
    maxLevel: 10,
    constructionTime: 20
  },

  // Recreation Buildings
  park: {
    type: 'park',
    name: 'Park',
    description: 'Green space that makes citizens happy',
    baseCost: 300,
    basePopulation: 0,
    baseHappiness: 8,
    baseIncome: 0,
    color: '#10B981',
    icon: '🌳',
    unlockLevel: 1,
    category: 'recreation',
    maxLevel: 3,
    constructionTime: 2
  },
  fountain: {
    type: 'fountain',
    name: 'Fountain',
    description: 'Beautiful water feature',
    baseCost: 800,
    basePopulation: 0,
    baseHappiness: 12,
    baseIncome: 0,
    color: '#06B6D4',
    icon: '⛲',
    unlockLevel: 5,
    category: 'recreation',
    maxLevel: 3,
    constructionTime: 4
  },
  stadium: {
    type: 'stadium',
    name: 'Stadium',
    description: 'Sports venue for entertainment',
    baseCost: 8000,
    basePopulation: 0,
    baseHappiness: 25,
    baseIncome: 400,
    color: '#DC2626',
    icon: '🏟️',
    unlockLevel: 12,
    category: 'recreation',
    maxLevel: 3,
    constructionTime: 15
  },

  // Infrastructure Buildings
  road: {
    type: 'road',
    name: 'Road',
    description: 'Basic transportation infrastructure',
    baseCost: 100,
    basePopulation: 0,
    baseHappiness: 1,
    baseIncome: 0,
    color: '#6B7280',
    icon: '🛣️',
    unlockLevel: 1,
    category: 'infrastructure',
    maxLevel: 3,
    constructionTime: 1
  },
  bridge: {
    type: 'bridge',
    name: 'Bridge',
    description: 'Connects areas across water',
    baseCost: 2000,
    basePopulation: 0,
    baseHappiness: 3,
    baseIncome: 0,
    color: '#78716C',
    icon: '🌉',
    unlockLevel: 8,
    category: 'infrastructure',
    maxLevel: 2,
    constructionTime: 8
  },
  highway: {
    type: 'highway',
    name: 'Highway',
    description: 'High-speed transportation route',
    baseCost: 5000,
    basePopulation: 0,
    baseHappiness: 5,
    baseIncome: 100,
    color: '#374151',
    icon: '🛤️',
    unlockLevel: 18,
    category: 'infrastructure',
    maxLevel: 2,
    constructionTime: 12
  },

  // Industrial Buildings
  factory: {
    type: 'factory',
    name: 'Factory',
    description: 'Industrial production facility',
    baseCost: 3000,
    basePopulation: 0,
    baseHappiness: -5,
    baseIncome: 400,
    color: '#F59E0B',
    icon: '🏭',
    unlockLevel: 6,
    category: 'industrial',
    maxLevel: 5,
    constructionTime: 8
  },
  powerplant: {
    type: 'powerplant',
    name: 'Power Plant',
    description: 'Generates electricity for the city',
    baseCost: 15000,
    basePopulation: 0,
    baseHappiness: -10,
    baseIncome: 600,
    color: '#EF4444',
    icon: '⚡',
    unlockLevel: 20,
    category: 'industrial',
    maxLevel: 3,
    constructionTime: 25
  },
  airport: {
    type: 'airport',
    name: 'Airport',
    description: 'International transportation hub',
    baseCost: 50000,
    basePopulation: 0,
    baseHappiness: 15,
    baseIncome: 1500,
    color: '#6366F1',
    icon: '✈️',
    unlockLevel: 25,
    category: 'industrial',
    maxLevel: 2,
    constructionTime: 30
  }
}

// Experience calculation
export function getRequiredXP(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Building income calculation
export function getBuildingIncome(building: any): number {
  const config = BUILDING_CONFIGS[building.type as BuildingType]
  if (!config || building.isConstructing) return 0
  
  const levelMultiplier = 1 + (building.level - 1) * 0.5
  return Math.floor(config.baseIncome * levelMultiplier)
}

// Get buildings by category
export function getBuildingsByCategory(category: string): BuildingConfig[] {
  return Object.values(BUILDING_CONFIGS).filter(config => config.category === category)
}

// Check if building is unlocked
export function isBuildingUnlocked(buildingType: BuildingType, playerLevel: number): boolean {
  const config = BUILDING_CONFIGS[buildingType]
  return config ? playerLevel >= config.unlockLevel : false
}

// Calculate building upgrade cost
export function getUpgradeCost(building: any): number {
  const config = BUILDING_CONFIGS[building.type as BuildingType]
  if (!config || building.level >= config.maxLevel) return 0
  
  return Math.floor(config.baseCost * Math.pow(1.5, building.level))
}
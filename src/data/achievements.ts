import { Achievement } from '../types/game'

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Building Achievements
  {
    id: 'first_house',
    name: 'First Home',
    description: 'Build your first house',
    icon: '🏠',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    reward: { type: 'money', amount: 500 }
  },
  {
    id: 'builder_novice',
    name: 'Builder Novice',
    description: 'Build 10 buildings',
    icon: '🔨',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    reward: { type: 'xp', amount: 100 }
  },
  {
    id: 'builder_expert',
    name: 'Builder Expert',
    description: 'Build 50 buildings',
    icon: '🏗️',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    reward: { type: 'money', amount: 5000 }
  },
  {
    id: 'master_builder',
    name: 'Master Builder',
    description: 'Build 100 buildings',
    icon: '👷',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    reward: { type: 'unlock', buildingType: 'mansion' }
  },

  // Population Achievements
  {
    id: 'small_town',
    name: 'Small Town',
    description: 'Reach 100 population',
    icon: '👥',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    reward: { type: 'xp', amount: 150 }
  },
  {
    id: 'growing_city',
    name: 'Growing City',
    description: 'Reach 500 population',
    icon: '🏙️',
    unlocked: false,
    progress: 0,
    maxProgress: 500,
    reward: { type: 'money', amount: 3000 }
  },
  {
    id: 'metropolis',
    name: 'Metropolis',
    description: 'Reach 1000 population',
    icon: '🌆',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
    reward: { type: 'unlock', buildingType: 'skyscraper' }
  },

  // Money Achievements
  {
    id: 'first_thousand',
    name: 'First Thousand',
    description: 'Earn $1,000',
    icon: '💰',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
    reward: { type: 'xp', amount: 50 }
  },
  {
    id: 'wealthy_mayor',
    name: 'Wealthy Mayor',
    description: 'Have $50,000 in the bank',
    icon: '💎',
    unlocked: false,
    progress: 0,
    maxProgress: 50000,
    reward: { type: 'money', amount: 10000 }
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Have $1,000,000 in the bank',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1000000,
    reward: { type: 'unlock', buildingType: 'airport' }
  },

  // Happiness Achievements
  {
    id: 'happy_citizens',
    name: 'Happy Citizens',
    description: 'Reach 80% happiness',
    icon: '😊',
    unlocked: false,
    progress: 0,
    maxProgress: 80,
    reward: { type: 'xp', amount: 200 }
  },
  {
    id: 'paradise_city',
    name: 'Paradise City',
    description: 'Reach 95% happiness',
    icon: '🌈',
    unlocked: false,
    progress: 0,
    maxProgress: 95,
    reward: { type: 'money', amount: 15000 }
  },

  // Special Achievements
  {
    id: 'green_city',
    name: 'Green City',
    description: 'Build 20 parks',
    icon: '🌱',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    reward: { type: 'unlock', buildingType: 'stadium' }
  },
  {
    id: 'industrial_tycoon',
    name: 'Industrial Tycoon',
    description: 'Build 10 factories',
    icon: '🏭',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    reward: { type: 'unlock', buildingType: 'powerplant' }
  },
  {
    id: 'infrastructure_master',
    name: 'Infrastructure Master',
    description: 'Build 50 roads',
    icon: '🛣️',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    reward: { type: 'unlock', buildingType: 'highway' }
  },

  // Level Achievements
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    reward: { type: 'money', amount: 2000 }
  },
  {
    id: 'level_10',
    name: 'Experienced Mayor',
    description: 'Reach level 10',
    icon: '🎖️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    reward: { type: 'money', amount: 5000 }
  },
  {
    id: 'level_20',
    name: 'Master Mayor',
    description: 'Reach level 20',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    reward: { type: 'money', amount: 20000 }
  }
]

export function checkAchievements(gameState: any, achievements: Achievement[]): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.unlocked) return achievement

    let progress = 0

    switch (achievement.id) {
      case 'first_house':
        progress = gameState.buildings.filter((b: any) => b.type === 'house').length > 0 ? 1 : 0
        break
      case 'builder_novice':
      case 'builder_expert':
      case 'master_builder':
        progress = gameState.buildings.length
        break
      case 'small_town':
      case 'growing_city':
      case 'metropolis':
        progress = gameState.population
        break
      case 'first_thousand':
      case 'wealthy_mayor':
      case 'millionaire':
        progress = gameState.money
        break
      case 'happy_citizens':
      case 'paradise_city':
        progress = gameState.happiness
        break
      case 'green_city':
        progress = gameState.buildings.filter((b: any) => b.type === 'park').length
        break
      case 'industrial_tycoon':
        progress = gameState.buildings.filter((b: any) => b.type === 'factory').length
        break
      case 'infrastructure_master':
        progress = gameState.buildings.filter((b: any) => b.type === 'road').length
        break
      case 'level_5':
      case 'level_10':
      case 'level_20':
        progress = gameState.level
        break
    }

    const unlocked = progress >= achievement.maxProgress
    return {
      ...achievement,
      progress: Math.min(progress, achievement.maxProgress),
      unlocked
    }
  })
}
import { useState, useEffect, useCallback } from 'react'
import { GameState, Building, Achievement } from '../types/game'
import { BUILDING_CONFIGS, getRequiredXP, getBuildingIncome } from '../data/buildingConfigs'
import { INITIAL_ACHIEVEMENTS, checkAchievements } from '../data/achievements'

const SAVE_KEY = 'city-builder-save'
const INCOME_INTERVAL = 5000 // 5 seconds
const CONSTRUCTION_TICK = 100 // 100ms

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load saved game or create new
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          ...parsed,
          achievements: INITIAL_ACHIEVEMENTS.map(achievement => {
            const saved = parsed.achievements?.find((a: Achievement) => a.id === achievement.id)
            return saved || achievement
          })
        }
      } catch (e) {
        console.error('Failed to load save:', e)
      }
    }
    
    return {
      money: 5000,
      population: 0,
      happiness: 50,
      experience: 0,
      level: 1,
      buildings: [],
      selectedBuildingType: null,
      isDeleteMode: false,
      unlockedBuildings: ['house', 'park', 'road'],
      achievements: INITIAL_ACHIEVEMENTS,
      dailyChallenge: null,
      lastPlayTime: Date.now(),
      autoSaveEnabled: true,
      soundEnabled: true,
      showMobileControls: window.innerWidth <= 768,
      bottomSheetOpen: false
    }
  })

  // Auto-save game state
  useEffect(() => {
    if (gameState.autoSaveEnabled) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState))
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [gameState])

  // Income generation
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = Date.now()
        let totalIncome = 0
        
        const updatedBuildings = prev.buildings.map(building => {
          if (!building.isConstructing && now - building.lastIncomeTime >= INCOME_INTERVAL) {
            const income = getBuildingIncome(building)
            totalIncome += income
            return { ...building, lastIncomeTime: now }
          }
          return building
        })

        if (totalIncome > 0) {
          return {
            ...prev,
            money: prev.money + totalIncome,
            buildings: updatedBuildings
          }
        }
        return prev
      })
    }, INCOME_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  // Construction progress
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const updatedBuildings = prev.buildings.map(building => {
          if (building.isConstructing) {
            const config = BUILDING_CONFIGS[building.type]
            const progressIncrement = CONSTRUCTION_TICK / (config.constructionTime * 1000)
            const newProgress = building.constructionProgress + progressIncrement
            
            if (newProgress >= 1) {
              return {
                ...building,
                constructionProgress: 1,
                isConstructing: false,
                lastIncomeTime: Date.now()
              }
            }
            
            return {
              ...building,
              constructionProgress: newProgress
            }
          }
          return building
        })

        return { ...prev, buildings: updatedBuildings }
      })
    }, CONSTRUCTION_TICK)

    return () => clearInterval(interval)
  }, [])

  // Achievement checking
  useEffect(() => {
    setGameState(prev => {
      const updatedAchievements = checkAchievements(prev, prev.achievements)
      const newlyUnlocked = updatedAchievements.filter((achievement, index) => 
        achievement.unlocked && !prev.achievements[index].unlocked
      )

      if (newlyUnlocked.length > 0) {
        let newMoney = prev.money
        let newXP = prev.experience
        const newUnlocked = [...prev.unlockedBuildings]

        newlyUnlocked.forEach(achievement => {
          if (achievement.reward.type === 'money' && achievement.reward.amount) {
            newMoney += achievement.reward.amount
          } else if (achievement.reward.type === 'xp' && achievement.reward.amount) {
            newXP += achievement.reward.amount
          } else if (achievement.reward.type === 'unlock' && achievement.reward.buildingType) {
            if (!newUnlocked.includes(achievement.reward.buildingType)) {
              newUnlocked.push(achievement.reward.buildingType)
            }
          }
        })

        return {
          ...prev,
          money: newMoney,
          experience: newXP,
          unlockedBuildings: newUnlocked,
          achievements: updatedAchievements
        }
      }

      return {
        ...prev,
        achievements: updatedAchievements
      }
    })
  }, [gameState.buildings.length, gameState.population, gameState.money, gameState.happiness, gameState.level])

  // Level calculation
  useEffect(() => {
    const requiredXP = getRequiredXP(gameState.level)
    if (gameState.experience >= requiredXP) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        money: prev.money + prev.level * 1000 // Level up bonus
      }))
    }
  }, [gameState.experience, gameState.level])

  // Calculate derived stats
  const calculateStats = useCallback(() => {
    let totalPopulation = 0
    let totalHappiness = 0
    let totalIncome = 0

    gameState.buildings.forEach(building => {
      if (!building.isConstructing) {
        const config = BUILDING_CONFIGS[building.type]
        const levelMultiplier = 1 + (building.level - 1) * 0.3
        
        totalPopulation += Math.floor(config.basePopulation * levelMultiplier)
        totalHappiness += Math.floor(config.baseHappiness * levelMultiplier)
        totalIncome += getBuildingIncome(building)
      }
    })

    const happiness = Math.max(0, Math.min(100, 50 + totalHappiness))
    
    return {
      population: totalPopulation,
      happiness,
      incomePerSecond: totalIncome / (INCOME_INTERVAL / 1000)
    }
  }, [gameState.buildings])

  // Update derived stats
  useEffect(() => {
    const stats = calculateStats()
    setGameState(prev => ({
      ...prev,
      population: stats.population,
      happiness: stats.happiness
    }))
  }, [calculateStats])

  const placeBuilding = useCallback((x: number, z: number, type: string) => {
    const config = BUILDING_CONFIGS[type]
    if (!config || gameState.money < config.baseCost) return false

    const existingBuilding = gameState.buildings.find(b => b.x === x && b.z === z)
    if (existingBuilding) return false

    const newBuilding: Building = {
      id: `${type}-${x}-${z}-${Date.now()}`,
      type: type as any,
      x,
      z,
      cost: config.baseCost,
      level: 1,
      constructionProgress: 0,
      lastIncomeTime: Date.now(),
      isConstructing: true
    }

    setGameState(prev => ({
      ...prev,
      money: prev.money - config.baseCost,
      buildings: [...prev.buildings, newBuilding],
      experience: prev.experience + Math.floor(config.baseCost / 10)
    }))

    return true
  }, [gameState.money, gameState.buildings])

  const deleteBuilding = useCallback((x: number, z: number) => {
    const building = gameState.buildings.find(b => b.x === x && b.z === z)
    if (!building) return false

    const refund = Math.floor(building.cost * 0.5)
    
    setGameState(prev => ({
      ...prev,
      money: prev.money + refund,
      buildings: prev.buildings.filter(b => b.id !== building.id)
    }))

    return true
  }, [gameState.buildings])

  const upgradeBuilding = useCallback((buildingId: string) => {
    const building = gameState.buildings.find(b => b.id === buildingId)
    if (!building) return false

    const config = BUILDING_CONFIGS[building.type]
    if (!config || building.level >= config.maxLevel) return false

    const upgradeCost = Math.floor(config.baseCost * Math.pow(1.5, building.level))
    if (gameState.money < upgradeCost) return false

    setGameState(prev => ({
      ...prev,
      money: prev.money - upgradeCost,
      buildings: prev.buildings.map(b => 
        b.id === buildingId 
          ? { ...b, level: b.level + 1, cost: b.cost + upgradeCost }
          : b
      ),
      experience: prev.experience + Math.floor(upgradeCost / 5)
    }))

    return true
  }, [gameState.money, gameState.buildings])

  return {
    gameState,
    setGameState,
    placeBuilding,
    deleteBuilding,
    upgradeBuilding,
    calculateStats
  }
}
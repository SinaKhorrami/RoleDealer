// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: 'roledealer_gameState',
  GAME_ROLES: 'roledealer_gameRoles',
  PLAYERS: 'roledealer_players',
  GAME_NOTES: 'roledealer_gameNotes'
}

// Get game state from localStorage
export function getGameState() {
  try {
    const state = localStorage.getItem(STORAGE_KEYS.GAME_STATE)
    return state || null
  } catch (e) {
    console.error('Error reading game state:', e)
    return null
  }
}

// Save game state
export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, state)
  } catch (e) {
    console.error('Error saving game state:', e)
  }
}

// Get game roles
export function getGameRoles() {
  try {
    const roles = localStorage.getItem(STORAGE_KEYS.GAME_ROLES)
    return roles ? JSON.parse(roles) : null
  } catch (e) {
    console.error('Error reading game roles:', e)
    return null
  }
}

// Save game roles
export function saveGameRoles(roles) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_ROLES, JSON.stringify(roles))
  } catch (e) {
    console.error('Error saving game roles:', e)
  }
}

// Get players list
export function getPlayers() {
  try {
    const players = localStorage.getItem(STORAGE_KEYS.PLAYERS)
    return players ? JSON.parse(players) : null
  } catch (e) {
    console.error('Error reading players:', e)
    return null
  }
}

// Save players list
export function savePlayers(players) {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players))
  } catch (e) {
    console.error('Error saving players:', e)
  }
}

// Get game notes
export function getGameNotes() {
  try {
    const notes = localStorage.getItem(STORAGE_KEYS.GAME_NOTES)
    return notes || ''
  } catch (e) {
    console.error('Error reading game notes:', e)
    return ''
  }
}

// Save game notes
export function saveGameNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_NOTES, notes)
  } catch (e) {
    console.error('Error saving game notes:', e)
  }
}

// Clear all game data
export function clearAllGameData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE)
    localStorage.removeItem(STORAGE_KEYS.GAME_ROLES)
    localStorage.removeItem(STORAGE_KEYS.PLAYERS)
    localStorage.removeItem(STORAGE_KEYS.GAME_NOTES)
  } catch (e) {
    console.error('Error clearing game data:', e)
  }
}

// Check if there's saved game data
export function hasSavedGameData() {
  return getGameState() !== null
}

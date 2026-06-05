<template>
  <div class="app">
    <RoleInput v-if="gameState === 'setup'" @start="startGame" @resume="resumeGame" :hasSavedGame="hasSavedGame" />
    <GameBoard v-else-if="gameState === 'playing'" :roles="gameRoles" @finish="finishGame" />
    <GameSummary v-else-if="gameState === 'summary'" :players="players" @playAgain="playAgain" @backToSetup="resetGame" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import RoleInput from './components/RoleInput.vue'
import GameBoard from './components/GameBoard.vue'
import GameSummary from './components/GameSummary.vue'
import { getGameState, getGameRoles, getPlayers, saveGameState, saveGameRoles, savePlayers, clearAllGameData } from './utils/storage.js'

export default {
  name: 'App',
  components: {
    RoleInput,
    GameBoard,
    GameSummary
  },
  setup() {
    const gameState = ref('setup')
    const gameRoles = ref([])
    const players = ref([])
    const hasSavedGame = ref(false)

    onMounted(() => {
      // Check if there's saved game data
      const savedState = getGameState()
      if (savedState) {
        hasSavedGame.value = true
      }
    })

    const startGame = (roles) => {
      gameRoles.value = roles
      gameState.value = 'playing'
      saveGameState('playing')
      saveGameRoles(roles)
    }

    const resumeGame = () => {
      const savedState = getGameState()
      const savedRoles = getGameRoles()
      const savedPlayers = getPlayers()

      if (savedState === 'summary' && savedPlayers) {
        // Resume to summary
        players.value = savedPlayers
        gameState.value = 'summary'
      } else if (savedState === 'playing' && savedRoles) {
        // Resume to playing
        gameRoles.value = savedRoles
        gameState.value = 'playing'
      }
    }

    const finishGame = (playerList) => {
      players.value = playerList
      gameState.value = 'summary'
      saveGameState('summary')
      savePlayers(playerList)
    }

    const playAgain = () => {
      // Reshuffle the roles
      const shuffledRoles = [...gameRoles.value]
      for (let i = shuffledRoles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j], shuffledRoles[i]]
      }
      gameRoles.value = shuffledRoles
      
      // Play again with same roles - go back to playing state
      gameState.value = 'playing'
      players.value = []
      saveGameState('playing')
      clearAllGameData() // Clear notes but keep roles
      saveGameRoles(gameRoles.value)
    }

    const resetGame = () => {
      // Full reset - go back to setup
      gameState.value = 'setup'
      gameRoles.value = []
      players.value = []
      hasSavedGame.value = false
      clearAllGameData() // Clear all data including notes and roles
    }

    return {
      gameState,
      gameRoles,
      players,
      hasSavedGame,
      startGame,
      resumeGame,
      finishGame,
      playAgain,
      resetGame
    }
  }
}
</script>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>

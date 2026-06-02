<template>
  <div class="app">
    <RoleInput v-if="gameState === 'setup'" @start="startGame" />
    <GameBoard v-else @back="resetGame" :roles="gameRoles" />
  </div>
</template>

<script>
import { ref } from 'vue'
import RoleInput from './components/RoleInput.vue'
import GameBoard from './components/GameBoard.vue'

export default {
  name: 'App',
  components: {
    RoleInput,
    GameBoard
  },
  setup() {
    const gameState = ref('setup')
    const gameRoles = ref([])

    const startGame = (roles) => {
      gameRoles.value = roles
      gameState.value = 'playing'
    }

    const resetGame = () => {
      gameState.value = 'setup'
      gameRoles.value = []
    }

    return {
      gameState,
      gameRoles,
      startGame,
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

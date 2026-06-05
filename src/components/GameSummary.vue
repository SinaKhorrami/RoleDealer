<template>
  <div class="summary-container">
    <div class="header">
      <button @click="goBackToSetup" class="back-btn">← Back</button>
      <h1>🎭 RoleDealer</h1>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <h2>Game Summary</h2>
      <p class="subtitle">All players and their roles:</p>

      <div class="players-list">
        <div v-for="(player, index) in players" :key="index" class="player-card">
          <div class="player-info">
            <span class="player-name">{{ player.name }}</span>
            <span class="arrow">→</span>
            <span class="player-role">{{ player.role }}</span>
          </div>
        </div>
      </div>

      <div class="notes-section">
        <label for="game-notes">📝 Game Notes:</label>
        <textarea
          id="game-notes"
          v-model="gameNotes"
          @input="handleNotesInput"
          placeholder="Add any notes about the game here..."
          class="notes-textarea"
        ></textarea>
      </div>

      <div class="buttons-group">
        <button @click="playAgain" class="play-again-btn">
          Play Again
        </button>
        <button @click="goBackToSetup" class="back-to-setup-btn">
          Back to Setup
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getGameNotes, saveGameNotes } from '../utils/storage.js'

export default {
  name: 'GameSummary',
  props: {
    players: {
      type: Array,
      required: true
    }
  },
  emits: ['playAgain', 'backToSetup'],
  setup(props, { emit }) {
    const gameNotes = ref('')

    onMounted(() => {
      // Load saved notes
      gameNotes.value = getGameNotes()
      // Auto-expand textarea after loading
      setTimeout(() => autoExpandTextarea(), 0)
    })

    const autoExpandTextarea = () => {
      const textarea = document.getElementById('game-notes')
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'
      }
    }

    const handleNotesInput = () => {
      saveNotes()
      autoExpandTextarea()
    }

    const saveNotes = () => {
      saveGameNotes(gameNotes.value)
    }

    const playAgain = () => {
      if (confirm('Start a new game with the same roles?')) {
        emit('playAgain')
      }
    }

    const goBackToSetup = () => {
      if (confirm('Start a new game with different roles?')) {
        emit('backToSetup')
      }
    }

    return {
      gameNotes,
      handleNotesInput,
      playAgain,
      goBackToSetup
    }
  }
}
</script>

<style scoped>
.summary-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.header {
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.2s;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.header h1 {
  margin: 0;
  color: white;
  font-size: 1.5em;
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 60px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  overflow-y: auto;
}

.content h2 {
  margin: 0;
  font-size: 1.6em;
  color: white;
  text-align: center;
}

.subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9em;
  text-align: center;
  margin-bottom: 5px;
}

.players-list {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow-y: auto;
  max-height: 35vh;
  padding-right: 5px;
}

.player-card {
  background: white;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.player-info {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: space-between;
}

.player-name {
  font-weight: 700;
  color: #333;
  font-size: 0.95em;
  flex: 1;
}

.arrow {
  color: #667eea;
  font-weight: bold;
  font-size: 0.85em;
}

.player-role {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 18px;
  font-weight: 600;
  font-size: 0.8em;
  min-width: fit-content;
}

.notes-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  flex: 1;
  min-height: 0;
}

.notes-section label {
  font-weight: 600;
  color: #333;
  font-size: 0.95em;
}

.notes-textarea {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9em;
  font-family: inherit;
  resize: none;
  flex: 1;
  min-height: 400px;
  overflow-y: auto;
  transition: border-color 0.3s;
  box-sizing: border-box;
  line-height: 1.5;
}

.notes-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.buttons-group {
  display: flex;
  gap: 12px;
}

.play-again-btn,
.back-to-setup-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.play-again-btn {
  background: white;
  color: #667eea;
}

.back-to-setup-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.play-again-btn:active {
  transform: scale(0.98);
}

.back-to-setup-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.98);
}

/* Mobile-specific optimizations */
@media (max-width: 480px) {
  .header {
    padding: 12px 15px;
  }

  .back-btn {
    font-size: 0.8em;
    padding: 6px 10px;
  }

  .header h1 {
    font-size: 1.1em;
  }

  .header-spacer {
    width: 40px;
  }

  .content {
    padding: 12px;
    gap: 10px;
  }

  .content h2 {
    font-size: 1.5em;
  }

  .player-card {
    padding: 12px 15px;
  }

  .player-name {
    font-size: 1em;
  }

  .player-role {
    font-size: 0.85em;
    padding: 5px 10px;
  }

  .notes-section {
    padding: 12px;
  }

  .notes-textarea {
    min-height: 80px;
    max-height: 120px;
    font-size: 0.9em;
  }

  .buttons-group {
    gap: 8px;
  }

  .play-again-btn,
  .back-to-setup-btn {
    padding: 12px 16px;
    font-size: 0.95em;
  }
}
</style>

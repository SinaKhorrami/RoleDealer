<template>
  <div class="game-board-container">
    <div class="header">
      <button @click="goBack" class="back-btn">← Back</button>
      <h1>🎭 RoleDealer</h1>
      <div class="header-spacer"></div>
    </div>

    <div class="tiles-grid">
      <div
        v-for="(role, index) in roles"
        :key="role.id"
        class="tile-wrapper"
      >
        <div
          :class="['tile', { flipped: flippedTile === index, disabled: revealedRoles.has(index) }]"
          @click="flipTile(index)"
        >
          <div class="tile-inner">
            <div class="tile-front">
              <span class="tile-number">{{ index + 1 }}</span>
            </div>
            <div class="tile-back">
              <span class="role-name">{{ role.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Tap a tile to reveal your role</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'GameBoard',
  props: {
    roles: {
      type: Array,
      required: true
    }
  },
  emits: ['back'],
  setup(props, { emit }) {
    const flippedTile = ref(null)
    const revealedRoles = ref(new Set())

    const flipTile = (index) => {
      // Don't allow interaction with already revealed tiles
      if (revealedRoles.value.has(index)) {
        return
      }

      if (flippedTile.value === index) {
        // Second click - mark as revealed and disable
        revealedRoles.value.add(index)
        flippedTile.value = null
      } else {
        // First click - flip the tile
        flippedTile.value = index
      }
    }

    const goBack = () => {
      if (confirm('Are you sure you want to go back? All progress will be lost.')) {
        emit('back')
      }
    }

    return {
      flippedTile,
      flipTile,
      revealedRoles,
      goBack,
      roles: props.roles
    }
  }
}
</script>

<style scoped>
.game-board-container {
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

.tiles-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  padding: 20px;
  overflow-y: auto;
  align-content: start;
}

.tile-wrapper {
  perspective: 1000px;
  width: 100%;
}

.tile {
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.tile.flipped {
  transform: rotateY(180deg);
}

.tile.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tile.disabled .tile-front {
  background: linear-gradient(135deg, #999 0%, #666 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.tile-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.tile-front,
.tile-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: bold;
  backface-visibility: hidden;
}

.tile-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile-number {
  font-size: 1.8em;
  font-weight: 700;
}

.tile-back {
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.1);
  color: #333;
  transform: rotateY(180deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  padding: 10px;
}

.role-name {
  font-size: 1.1em;
  text-align: center;
  word-break: break-word;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  padding: 15px 20px;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  color: white;
  backdrop-filter: blur(10px);
}

.footer p {
  margin: 0;
  font-size: 0.9em;
  opacity: 0.9;
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  .tiles-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 15px;
  }

  .header h1 {
    font-size: 1.2em;
  }

  .tile-number {
    font-size: 1.5em;
  }

  .role-name {
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .tiles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 12px;
  }

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

  .tile-number {
    font-size: 1.3em;
  }

  .role-name {
    font-size: 0.8em;
  }
}
</style>

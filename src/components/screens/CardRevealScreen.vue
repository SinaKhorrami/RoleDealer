<template>
  <section class="reveal-card chooser-card">
    <p class="small-label">Player selected</p>
    <h3>{{ selectedPlayer.name }}</h3>
    <p class="tile-hint">
      {{ availableTiles.length }} face-down tiles remain. Let this player tap one tile to reveal their role.
    </p>
    <button
      type="button"
      class="secondary-btn"
      @click="changePlayer"
    >
      Change player
    </button>
    <div
      class="tile-grid player-pool-grid face-down-grid"
      role="group"
      aria-label="Choose a face-down tile"
    >
      <div
        v-for="(assignment, index) in availableTiles"
        :key="assignment.id"
        :class="[
          'tile-card',
          'player-pool-tile',
          'face-down-tile',
          { selected: selectedAssignmentId === assignment.id }
        ]"
        role="button"
        tabindex="0"
        :aria-label="`Face-down tile ${index + 1}`"
        @click="chooseTile(assignment.id)"
        @keydown.enter.prevent="chooseTile(assignment.id)"
        @keydown.space.prevent="chooseTile(assignment.id)"
      >
        <span class="tile-label">Face down</span>
        <span class="tile-note">Tap to Reveal</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CardRevealScreen',
    props: {
        selectedPlayer: {
            type: Object,
            required: true
        },
        availableTiles: {
            type: Array,
            required: true
        },
        selectedAssignmentId: {
            type: [String, Number],
            default: null
        }
    },
  emits: ['change-player', 'choose-tile'],
  setup(props, { emit }) {
    const changePlayer = () => {
      emit('change-player')
    }

    const chooseTile = (assignmentId) => {
      emit('choose-tile', assignmentId)
    }

    return {
      changePlayer,
      chooseTile
    }
  }
}
</script>

<style scoped>
.reveal-card {
  width: min(620px, 100%);
  min-height: 340px;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #1b1b1b;
  padding: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
}

.chooser-card {
  gap: 18px;
}

.small-label {
  margin: 0;
  color: #c8aa65;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h3 {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.25;
}

.tile-hint {
  margin: 0;
  color: #bdb6aa;
  font-size: 0.9rem;
  line-height: 1.4;
}

.secondary-btn {
  border: 0;
  border-radius: 8px;
  background: #2c2c2c;
  color: #f8f1e7;
  font-weight: 800;
  cursor: pointer;
  padding: 10px 12px;
}

.tile-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.player-pool-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
}

.face-down-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
}

.tile-card {
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: linear-gradient(180deg, #242424 0%, #161616 100%);
  color: #f8f1e7;
  padding: 16px 10px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.tile-card:hover {
  transform: translateY(-2px);
  border-color: #6b6b6b;
}

.tile-card.selected {
  border-color: #c8aa65;
  box-shadow: 0 0 0 2px rgba(200, 170, 101, 0.12);
}

.player-pool-tile {
  min-height: 24px;
  max-height: 68px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.face-down-tile {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.face-down-tile .tile-label {
  font-size: 1rem;
}

.face-down-tile .tile-note {
  margin-top: -2px;
}

.tile-label {
  width: 100%;
  font-size: 0.82rem;
  font-weight: 800;
  color: #aaa;
  word-break: break-word;
  text-align: center;
}

.tile-note {
  color: #8f8f8f;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 620px) {
  .reveal-card {
    padding: 20px;
    min-height: 0;
  }

  .tile-card {
    min-height: 48px;
  }
}
</style>

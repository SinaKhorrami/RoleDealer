<template>
  <div class="reveal-container">
    <header class="top-bar">
      <button type="button" class="ghost-btn" @click="goBack">Back</button>
      <div>
        <p class="eyebrow">{{ scenario?.name || 'Scenario' }}</p>
        <h1>Role Reveal</h1>
      </div>
      <span class="progress">{{ progressCount }} / {{ assignments.length }}</span>
    </header>

    <main class="reveal-stage">
      <section v-if="!selectedPlayer" class="reveal-card chooser-card">
        <p class="small-label">Choose next player</p>
        <h2>Select the player to wake</h2>
        <p class="tile-hint">{{ unrevealedPlayers.length }} players remain. Tap a name to start that player’s reveal.</p>
        <div class="tile-grid player-pool-grid" role="group" aria-label="Choose the next player">
          <button
            v-for="player in unrevealedPlayers"
            :key="player.id"
            type="button"
            class="tile-card player-pool-tile"
            @click="choosePlayer(player.id)"
          >
            <span class="tile-icon">{{ player.name.charAt(0).toUpperCase() }}</span>
            <span class="tile-label">{{ player.name }}</span>
            <span class="tile-note">Wake player</span>
          </button>
        </div>
      </section>

      <section v-else-if="selectedPlayer && !selectedAssignmentId" class="reveal-card chooser-card">
        <p class="small-label">Player selected</p>
        <h2>{{ selectedPlayer.name }}</h2>
        <p class="tile-hint">{{ availableTiles.length }} face-down tiles remain. Let this player tap one tile to reveal their role.</p>
        <div class="tile-grid face-down-grid" role="group" aria-label="Choose a face-down tile">
          <button
            v-for="(assignment, index) in availableTiles"
            :key="assignment.id"
            type="button"
            class="tile-card face-down-tile"
            :aria-label="`Face-down tile ${index + 1}`"
            @click="chooseTile(assignment.id)"
          >
            <span class="tile-icon">?</span>
            <span class="tile-label">Face down</span>
            <span class="tile-note">Tap to reveal</span>
          </button>
        </div>
        <button type="button" class="secondary-btn" @click="clearPlayerSelection">Change player</button>
      </section>

      <section v-else-if="selectedPlayer" :class="['reveal-card', 'role-visible', roleCardClass]">
        <p class="small-label">Selected player</p>
        <h2>{{ selectedPlayer.name }}</h2>
        <div class="reveal-role">
          <span class="role-caption">Role</span>
          <strong>{{ selectedPlayer.role }}</strong>
        </div>
        <button type="button" class="primary-btn" @click="confirmRole">Got it</button>
      </section>

      <section v-else class="reveal-card">
        <p class="small-label">Complete</p>
        <h2>All roles are assigned</h2>
        <button type="button" class="primary-btn" @click="finishReveal">View Summary</button>
      </section>
    </main>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { getRoleSide } from '../scenarios.js'
import { saveGameRoles, savePlayers } from '../utils/storage.js'

export default {
  name: 'GameBoard',
  props: {
    roles: {
      type: Array,
      required: true
    },
    scenario: {
      type: Object,
      default: null
    }
  },
  emits: ['finish'],
  setup(props, { emit }) {
    const assignments = ref(props.roles.map((assignment) => ({ ...assignment })))
    const selectedPlayerId = ref(null)
    const selectedAssignmentId = ref(null)
    const unrevealedPlayers = computed(() => assignments.value.filter((assignment) => !assignment.revealed))
    const selectedPlayer = computed(() => {
      return assignments.value.find((assignment) => assignment.id === selectedPlayerId.value) || null
    })
    const availableTiles = computed(() => {
      return assignments.value.filter((assignment) => !assignment.revealed)
    })
    const progressCount = computed(() => {
      return assignments.value.filter((assignment) => assignment.revealed).length + (selectedPlayer.value ? 1 : 0)
    })
    const currentRoleSide = computed(() => {
      return getRoleSide(props.scenario, selectedPlayer.value?.role)
    })
    const roleCardClass = computed(() => {
      return currentRoleSide.value === 'Mafia' ? 'role-mafia' : 'role-citizen'
    })

    const persist = () => {
      saveGameRoles(assignments.value)
      savePlayers(assignments.value.filter((assignment) => assignment.revealed))
    }

    const choosePlayer = (playerId) => {
      selectedPlayerId.value = playerId
      selectedAssignmentId.value = null
    }

    const chooseTile = (assignmentId) => {
      selectedAssignmentId.value = assignmentId
    }

    const confirmRole = () => {
      if (!selectedPlayer.value || !selectedAssignmentId.value) return

      const assignment = assignments.value.find((entry) => entry.id === selectedPlayerId.value)
      if (!assignment) return

      assignment.revealed = true
      selectedPlayerId.value = null
      selectedAssignmentId.value = null
      persist()

      if (!unrevealedPlayers.value.length) {
        finishReveal()
      }
    }

    const clearPlayerSelection = () => {
      selectedPlayerId.value = null
      selectedAssignmentId.value = null
    }

    const finishReveal = () => {
      emit('finish', assignments.value)
    }

    const goBack = () => {
      if (confirm('Go back to setup? Current reveal progress is saved.')) {
        persist()
        window.location.reload()
      }
    }

    return {
      assignments,
      unrevealedPlayers,
      availableTiles,
      selectedPlayerId,
      selectedAssignmentId,
      selectedPlayer,
      progressCount,
      roleCardClass,
      choosePlayer,
      chooseTile,
      clearPlayerSelection,
      confirmRole,
      finishReveal,
      goBack
    }
  }
}
</script>

<style scoped>
.reveal-container {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: #111;
  color: #f8f1e7;
}

.top-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  background: #1d1d1d;
  border-bottom: 1px solid #333;
}

.eyebrow,
.small-label {
  margin: 0;
  color: #c8aa65;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1,
h2 {
  margin: 0;
}

h1 {
  font-size: 1.25rem;
}

.progress {
  font-weight: 800;
  color: #c8aa65;
}

.ghost-btn,
.primary-btn {
  border: 0;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
}

.ghost-btn {
  background: #2c2c2c;
  color: #f8f1e7;
  padding: 10px 12px;
}

.reveal-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
}

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

.reveal-card h2 {
  max-width: 100%;
  overflow-wrap: anywhere;
  font-size: clamp(2rem, 7vw, 4rem);
  line-height: 1.05;
}

.role-visible {
  border-width: 2px;
}

.tile-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.face-down-grid {
  max-height: 44vh;
  overflow-y: auto;
  padding-right: 2px;
}

.player-pool-grid {
  max-height: 30vh;
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
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.tile-card:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: #6b6b6b;
}

.tile-card.selected {
  border-color: #c8aa65;
  box-shadow: 0 0 0 2px rgba(200, 170, 101, 0.12);
}

.tile-card.locked {
  opacity: 0.45;
  cursor: not-allowed;
}

.player-tile {
  min-height: 96px;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}

.player-pool-tile {
  min-height: 88px;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}

.face-down-tile {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.face-down-tile .tile-icon {
  width: 46px;
  height: 46px;
  font-size: 1.3rem;
  background: #0f0f0f;
  border-color: #4a4a4a;
}

.tile-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #101010;
  border: 1px solid #3c3c3c;
  font-size: 1.2rem;
  font-weight: 900;
}

.tile-label {
  font-size: 0.82rem;
  font-weight: 800;
  color: #aaa;
  word-break: break-word;
}

.tile-note {
  color: #8f8f8f;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tile-hint {
  margin: 0;
  color: #bdb6aa;
  font-size: 0.9rem;
  line-height: 1.4;
}

.reveal-role {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 18px 16px;
  display: grid;
  gap: 8px;
  text-align: left;
}

.role-caption {
  color: #b7b0a5;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.reveal-role strong {
  overflow-wrap: anywhere;
  font-size: 1.35rem;
  line-height: 1.2;
}

.role-mafia {
  background: #2b1414;
  border-color: #b33a3a;
}

.role-citizen {
  background: #142718;
  border-color: #3d9a55;
}

.role-citizen .small-label {
  color: #95d7a3;
}

.role-citizen .primary-btn {
  background: #2f8f48;
}

.role-mafia .small-label {
  color: #f08f8f;
}

.role-mafia .primary-btn {
  background: #b33a3a;
}

.primary-btn {
  min-height: 52px;
  padding: 0 24px;
  background: #9f2929;
  color: white;
  font-size: 1rem;
}

.secondary-btn {
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #232323;
  color: #f8f1e7;
  min-height: 44px;
  padding: 0 16px;
  font-weight: 800;
  cursor: pointer;
}

.queue {
  display: none;
}

@media (max-width: 620px) {
  .top-bar {
    grid-template-columns: 1fr auto;
  }

  .ghost-btn {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .reveal-stage {
    padding: 16px;
  }

  .reveal-card {
    min-height: 300px;
    padding: 24px 18px;
  }

  .tile-grid {
    grid-template-columns: 1fr;
  }

  .tile-card {
    min-height: 86px;
    flex-direction: row;
    justify-content: flex-start;
    padding: 12px 14px;
  }

  .face-down-grid {
    max-height: 38vh;
  }

  .player-pool-grid {
    max-height: 24vh;
  }
}
</style>

<template>
  <div class="summary-container">
    <header class="summary-header">
      <div>
        <p class="eyebrow">{{ scenario?.name || 'Scenario' }}</p>
        <h1>Game Summary</h1>
      </div>
      <div class="top-actions">
        <span class="progress">{{ players.length }} players</span>
        <button type="button" class="menu-btn" aria-label="Open menu" @click="drawerOpen = true">
          <span class="menu-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>

    <main class="summary-content">
      <nav class="tabs" aria-label="Summary sections">
        <button
          type="button"
          :class="['tab-btn', { active: activeTab === 'players' }]"
          @click="activeTab = 'players'"
        >
          Players
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: activeTab === 'notes' }]"
          @click="activeTab = 'notes'"
        >
          Game Notes
        </button>
      </nav>

      <section v-if="activeTab === 'players'" class="summary-panel">
        <div class="panel-header">
          <p class="eyebrow">Assignments</p>
          <div class="side-summary">
            <span v-for="side in sideCounts" :key="side.name" :class="['side-pill', side.className]">
              {{ side.name }} {{ side.count }}
            </span>
          </div>
        </div>

        <nav class="inner-tabs" aria-label="Player sections">
          <button
            type="button"
            :class="['inner-tab-btn', { active: playerSection === 'active' }]"
            @click="playerSection = 'active'"
          >
            Active
          </button>
          <button
            type="button"
            :class="['inner-tab-btn', { active: playerSection === 'graveyard' }]"
            @click="playerSection = 'graveyard'"
          >
            Graveyard
          </button>
        </nav>

        <div v-if="playerSection === 'active'" class="players-list">
          <div
            v-for="(player, index) in activePlayers"
            :key="player.id || `${player.name}-${index}`"
            :class="['player-card', player.className, { disabled: player.disabled }]"
            @click="openLinkedNight(player)"
          >
            <span class="player-index">{{ index + 1 }}</span>
            <button
              v-if="editingPlayerId !== player.id"
              type="button"
              class="player-name-display"
              @click.stop="startEditingPlayer(player)"
            >
              {{ player.name }}
            </button>
            <input
              v-else
              v-model="player.name"
              type="text"
              class="player-name-input"
              :data-player-edit-id="player.id"
              maxlength="30"
              @click.stop
              @blur="finishEditingPlayer"
              @keydown.enter.prevent="finishEditingPlayer"
              @keydown.escape.prevent="finishEditingPlayer"
              @input="persistPlayers"
            />
            <span class="player-role">{{ player.role }}</span>
            <label class="status-toggle" @click.stop.prevent="requestToggleChange(player)">
              <input :checked="player.disabled" type="checkbox" readonly aria-hidden="true" />
              <span class="toggle-track" aria-hidden="true">
                <span class="toggle-thumb"></span>
              </span>
            </label>
            <div v-if="player.disabled" class="disable-controls" @click.stop>
              <select v-model="player.disabledReason" class="status-select" @change="handleReasonChange(player)">
                <option value="voting">Voting</option>
                <option value="night">Night</option>
              </select>
              <select
                v-if="player.disabledReason === 'night'"
                v-model.number="player.disabledNight"
                class="status-select"
                @change="persistPlayers"
              >
                <option v-for="(_, nightIndex) in nightNotes" :key="nightIndex" :value="nightIndex">
                  Night {{ nightIndex + 1 }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-else ref="graveyardListRef" class="players-list graveyard-list">
          <div class="death-summary">
            <span class="death-pill death-mafia">Mafia died {{ deadCounts.Mafia }}</span>
            <span class="death-pill death-citizen">Citizen died {{ deadCounts.Citizen }}</span>
            <span class="death-pill death-independent">Independent died {{ deadCounts.Independent }}</span>
          </div>
          <div
            v-for="(player, index) in graveyardPlayers"
            :key="player.id || `${player.name}-${index}`"
            :class="['player-card', player.className, 'graveyard-card', { disabled: player.disabled }]"
            :ref="(el) => setPlayerRowRef(player.id, el)"
            @click="openLinkedNight(player)"
          >
            <span class="player-index">{{ index + 1 }}</span>
            <button
              v-if="editingPlayerId !== player.id"
              type="button"
              class="player-name-display"
              @click.stop="startEditingPlayer(player)"
            >
              {{ player.name }}
            </button>
            <input
              v-else
              v-model="player.name"
              type="text"
              class="player-name-input"
              :data-player-edit-id="player.id"
              maxlength="30"
              @click.stop
              @blur="finishEditingPlayer"
              @keydown.enter.prevent="finishEditingPlayer"
              @keydown.escape.prevent="finishEditingPlayer"
              @input="persistPlayers"
            />
            <span class="player-role">{{ player.role }}</span>
            <label class="status-toggle" @click.stop.prevent="requestToggleChange(player)">
              <input :checked="player.disabled" type="checkbox" readonly aria-hidden="true" />
              <span class="toggle-track" aria-hidden="true">
                <span class="toggle-thumb"></span>
              </span>
            </label>
            <div v-if="player.disabled" class="disable-controls" @click.stop>
              <select v-model="player.disabledReason" class="status-select" @change="handleReasonChange(player)">
                <option value="voting">Voting</option>
                <option value="night">Night</option>
              </select>
              <select
                v-if="player.disabledReason === 'night'"
                v-model.number="player.disabledNight"
                class="status-select"
                @change="persistPlayers"
              >
                <option v-for="(_, nightIndex) in nightNotes" :key="nightIndex" :value="nightIndex">
                  Night {{ nightIndex + 1 }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="summary-panel notes-panel">
        <div class="panel-header">
          <p class="eyebrow">Game notes for</p>
          <div class="notes-state">Saved locally</div>
        </div>
        <div class="night-tabs" aria-label="Night notes">
          <button
            v-for="(_, index) in nightNotes"
            :key="index"
            type="button"
            :class="['night-tab-btn', { active: activeNightIndex === index, filled: nightNotes[index].trim() }]"
            @click="activeNightIndex = index"
          >
            Night {{ index + 1 }}
          </button>
        </div>
        <label class="night-note-editor">
          <span>Night {{ activeNightIndex + 1 }}</span>
          <textarea
            v-model="nightNotes[activeNightIndex]"
            @input="handleNotesInput"
            :placeholder="`Notes for Night ${activeNightIndex + 1}`"
            class="notes-textarea"
          ></textarea>
        </label>
      </section>
    </main>

    <DrawerMenu
      :open="drawerOpen"
      title="Game Menu"
      eyebrow="Summary"
      @close="drawerOpen = false"
    >
      <button type="button" class="drawer-action-btn" @click="playAgain">Play Again</button>
      <button type="button" class="drawer-action-btn" @click="goBackToSetup">New Setup</button>
      <button type="button" class="drawer-action-btn" @click="goBackToSetup">Back</button>
    </DrawerMenu>

    <div v-if="confirmDialog" class="dialog-backdrop" role="presentation" @click="closeConfirmDialog">
      <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" @click.stop>
        <p class="eyebrow">Confirm action</p>
        <h2 id="confirm-title">{{ confirmDialog.title }}</h2>
        <p class="dialog-message">{{ confirmDialog.message }}</p>
        <div class="dialog-actions">
          <button type="button" class="dialog-secondary-btn" @click="closeConfirmDialog">Cancel</button>
          <button type="button" class="dialog-primary-btn" @click="confirmAction">
            {{ confirmDialog.confirmLabel }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { computed, nextTick, ref, onMounted } from 'vue'
import DrawerMenu from './DrawerMenu.vue'
import { getRoleSide } from '../scenarios.js'
import { getGameNotes, saveGameNotes, savePlayers } from '../utils/storage.js'

export default {
  name: 'GameSummary',
  components: {
    DrawerMenu
  },
  props: {
    players: {
      type: Array,
      required: true
    },
    scenario: {
      type: Object,
      default: null
    }
  },
  emits: ['playAgain', 'backToSetup', 'updatePlayers'],
  setup(props, { emit }) {
    const nightNotes = ref(Array.from({ length: 10 }, () => ''))
    const editablePlayers = ref([])
    const activeTab = ref('players')
    const playerSection = ref('active')
    const activeNightIndex = ref(0)
    const editingPlayerId = ref(null)
    const confirmDialog = ref(null)
    const drawerOpen = ref(false)
    const graveyardListRef = ref(null)
    const graveyardRowRefs = ref({})
    const sideClassByName = {
      Mafia: 'side-mafia',
      Citizen: 'side-citizen',
      Independent: 'side-independent'
    }

    const getSide = (roleName) => {
      return getRoleSide(props.scenario, roleName) || 'Citizen'
    }

    const playerRows = computed(() => {
      const sideOrder = {
        Mafia: 0,
        Independent: 1,
        Citizen: 2
      }

      return editablePlayers.value.map((player, originalIndex) => {
        const side = getSide(player.role)
        player.originalIndex = originalIndex
        player.side = side
        player.className = sideClassByName[side] || 'side-citizen'
        return player
      }).sort((firstPlayer, secondPlayer) => {
        const firstOrder = sideOrder[firstPlayer.side] ?? 3
        const secondOrder = sideOrder[secondPlayer.side] ?? 3

        if (firstOrder !== secondOrder) return firstOrder - secondOrder
        return firstPlayer.originalIndex - secondPlayer.originalIndex
      })
    })

    const activePlayers = computed(() => {
      return playerRows.value.filter((player) => !player.disabled)
    })

    const graveyardPlayers = computed(() => {
      return playerRows.value.filter((player) => player.disabled)
    })

    const sideCounts = computed(() => {
      const counts = playerRows.value.reduce((result, player) => {
        result[player.side] = (result[player.side] || 0) + 1
        return result
      }, {})

      return Object.entries(counts).map(([name, count]) => ({
        name,
        count,
        className: sideClassByName[name] || 'side-citizen'
      }))
    })

    const deadCounts = computed(() => {
      return playerRows.value.reduce(
        (result, player) => {
          if (!player.disabled) return result

          if (player.side === 'Mafia') result.Mafia += 1
          else if (player.side === 'Independent') result.Independent += 1
          else result.Citizen += 1

          return result
        },
        { Mafia: 0, Citizen: 0, Independent: 0 }
      )
    })

    onMounted(() => {
      editablePlayers.value = props.players.map((player) => ({
        ...player,
        name: player.name || '',
        disabled: Boolean(player.disabled),
        disabledReason: player.disabledReason || 'voting',
        disabledNight: Number.isInteger(player.disabledNight) ? player.disabledNight : 0
      }))
      loadNotes()
    })

    const loadNotes = () => {
      const savedNotes = getGameNotes()

      if (!savedNotes) return

      try {
        const parsedNotes = JSON.parse(savedNotes)

        if (Array.isArray(parsedNotes)) {
          nightNotes.value = Array.from({ length: 10 }, (_, index) => parsedNotes[index] || '')
          return
        }
      } catch (error) {
        // Legacy notes were stored as plain text.
      }

      nightNotes.value[0] = savedNotes
    }

    const handleNotesInput = () => {
      saveNotes()
    }

    const saveNotes = () => {
      saveGameNotes(JSON.stringify(nightNotes.value))
    }

    const persistPlayers = () => {
      const playersToSave = editablePlayers.value.map((player) => ({
        id: player.id,
        name: player.name.trim(),
        role: player.role,
        revealed: player.revealed,
        disabled: Boolean(player.disabled),
        disabledReason: player.disabled ? player.disabledReason : null,
        disabledNight: player.disabled && player.disabledReason === 'night' ? player.disabledNight : null
      }))

      savePlayers(playersToSave)
      emit('updatePlayers', playersToSave)
    }

    const setPlayerRowRef = (playerId, el) => {
      if (el) graveyardRowRefs.value[playerId] = el
      else delete graveyardRowRefs.value[playerId]
    }

    const handleReasonChange = (player) => {
      if (player.disabledReason === 'night' && !Number.isInteger(player.disabledNight)) {
        player.disabledNight = 0
      }

      persistPlayers()
    }

    const requestToggleChange = (player) => {
      const targetState = !player.disabled
      openConfirmDialog({
        title: targetState ? 'Disable player?' : 'Enable player?',
        message: targetState
          ? `Disable ${player.name} now? You can set whether this is a voting or night disable after confirming.`
          : `Enable ${player.name} again? Their disable reason will be cleared.`,
        confirmLabel: targetState ? 'Disable' : 'Enable',
        action: () => {
          player.disabled = targetState

          if (!player.disabled) {
            player.disabledReason = 'voting'
            player.disabledNight = 0
          } else if (!player.disabledReason) {
            player.disabledReason = 'voting'
          }

          persistPlayers()
          if (player.disabled) {
            playerSection.value = 'graveyard'
            activeTab.value = 'players'
            nextTick(() => {
              const row = graveyardRowRefs.value[player.id]
              row?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            })
          } else {
            playerSection.value = 'active'
          }
        }
      })
    }

    const openLinkedNight = (player) => {
      if (!player.disabled || player.disabledReason !== 'night') return

      activeTab.value = 'notes'
      activeNightIndex.value = player.disabledNight || 0
    }

    const startEditingPlayer = async (player) => {
      editingPlayerId.value = player.id
      await nextTick()

      const input = document.querySelector(`[data-player-edit-id="${player.id}"]`)
      input?.focus()
      input?.select()
    }

    const finishEditingPlayer = () => {
      editingPlayerId.value = null
      persistPlayers()
    }

    const openConfirmDialog = (dialog) => {
      confirmDialog.value = dialog
    }

    const closeConfirmDialog = () => {
      confirmDialog.value = null
    }

    const confirmAction = () => {
      const action = confirmDialog.value?.action
      closeConfirmDialog()
      action?.()
    }

    const playAgain = () => {
      openConfirmDialog({
        title: 'Play again?',
        message: 'This starts a new game with the same players and roles. Current night notes and player statuses will be cleared.',
        confirmLabel: 'Play Again',
        action: () => emit('playAgain')
      })
    }

    const goBackToSetup = () => {
      openConfirmDialog({
        title: 'Start new setup?',
        message: 'This clears the current game, player statuses, and night notes so you can choose a new scenario and player list.',
        confirmLabel: 'New Setup',
        action: () => emit('backToSetup')
      })
    }

    return {
      nightNotes,
      activeTab,
      playerSection,
      activeNightIndex,
      editingPlayerId,
      confirmDialog,
      drawerOpen,
      graveyardListRef,
      playerRows,
      activePlayers,
      graveyardPlayers,
      sideCounts,
      deadCounts,
      handleNotesInput,
      persistPlayers,
      setPlayerRowRef,
      handleReasonChange,
      requestToggleChange,
      openLinkedNight,
      startEditingPlayer,
      finishEditingPlayer,
      closeConfirmDialog,
      confirmAction,
      playAgain,
      goBackToSetup
    }
  }
}
</script>

<style scoped>
.summary-container {
  height: 100vh;
  min-height: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  background: #111;
  color: #f8f1e7;
  overflow: hidden;
}

.summary-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  background: #1d1d1d;
  border-bottom: 1px solid #333;
}

.top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.summary-content {
  width: min(900px, 100%);
  margin: 0 auto;
  padding: 22px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.summary-panel {
  min-height: 0;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #1b1b1b;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #171717;
  padding: 6px;
}

.tab-btn {
  min-height: 44px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-weight: 800;
}

.tab-btn.active {
  background: #2c2c2c;
  color: #f8f1e7;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.eyebrow {
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

h2 {
  font-size: 1.1rem;
}

.progress {
  color: #c8aa65;
  font-weight: 800;
}

.menu-btn {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: #252525;
  color: #f8f1e7;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.menu-icon {
  width: 18px;
  display: grid;
  gap: 3px;
}

.menu-icon span {
  display: block;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
}

.side-summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.side-pill,
.player-role {
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 800;
  padding: 6px 10px;
}

.death-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}

.death-pill {
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 6px 10px;
}

.death-mafia {
  background: #7b2525;
  color: #ffe4e4;
}

.death-citizen {
  background: #2e6f45;
  color: #e3ffe9;
}

.death-independent {
  background: #8b6a24;
  color: #fff4d5;
}

.section-label {
  color: #c8aa65;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.graveyard-label {
  margin-top: 2px;
}

.inner-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #171717;
  padding: 6px;
}

.inner-tab-btn {
  min-height: 40px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-weight: 800;
}

.inner-tab-btn.active {
  background: #2c2c2c;
  color: #f8f1e7;
}

.player-role {
  grid-area: role;
  justify-self: start;
  max-width: 100%;
  overflow-wrap: anywhere;
  text-align: center;
}

.players-list {
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
}

.graveyard-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.player-card {
  display: grid;
  grid-template-areas:
    "index name toggle"
    ". role role"
    ". disabled disabled";
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #222;
  padding: 11px 12px;
}

.player-card.disabled {
  background: #2a2a2a;
  cursor: pointer;
  opacity: 0.72;
  filter: grayscale(0.35);
}

.graveyard-card {
  border-style: dashed;
}

.player-name-display,
.player-name-input,
.status-select {
  min-width: 0;
  color: #f8f1e7;
  font-family: inherit;
  font-weight: 800;
}

.player-name-display {
  grid-area: name;
  width: 100%;
  border: 0;
  background: transparent;
  cursor: text;
  overflow-wrap: anywhere;
  padding: 10px 0;
  text-align: left;
}

.player-name-input {
  grid-area: name;
  width: 100%;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #121212;
  padding: 10px 11px;
}

.status-select {
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #121212;
}

.player-name-input:focus,
.status-select:focus {
  outline: none;
  border-color: #c8aa65;
}

.player-index {
  grid-area: index;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #2d2d2d;
  color: #aaa;
  font-weight: 800;
}

.status-toggle {
  grid-area: toggle;
  justify-self: end;
  min-height: 38px;
  color: #aaa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  font-size: 0.86rem;
  font-weight: 800;
}

.status-toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

.toggle-track {
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: #2e6f45;
  display: inline-flex;
  align-items: center;
  padding: 3px;
  transition: background 0.2s ease;
}

.toggle-thumb {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #f8f1e7;
  transform: translateX(18px);
  transition: transform 0.2s ease;
}

.status-toggle input:checked + .toggle-track {
  background: #9f2929;
}

.status-toggle input:checked + .toggle-track .toggle-thumb {
  transform: translateX(0);
}

.disable-controls {
  grid-area: disabled;
  display: grid;
  grid-template-columns: minmax(0, 108px) minmax(0, 120px);
  gap: 8px;
}

.status-select {
  min-height: 34px;
  padding: 0 8px;
  font-size: 0.78rem;
}

.side-mafia {
  border-color: #7b2525;
}

.side-mafia .player-role,
.side-pill.side-mafia {
  background: #7b2525;
  color: #ffe4e4;
}

.side-citizen {
  border-color: #2e6f45;
}

.side-citizen .player-role,
.side-pill.side-citizen {
  background: #2e6f45;
  color: #e3ffe9;
}

.side-independent {
  border-color: #8b6a24;
}

.side-independent .player-role,
.side-pill.side-independent {
  background: #8b6a24;
  color: #fff4d5;
}

.night-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  flex-shrink: 0;
}

.night-tab-btn {
  min-width: 88px;
  min-height: 40px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #222;
  color: #aaa;
  cursor: pointer;
  flex-shrink: 0;
  font-weight: 800;
}

.night-tab-btn.active {
  border-color: #c8aa65;
  background: #2c2c2c;
  color: #f8f1e7;
}

.night-tab-btn.filled:not(.active) {
  border-color: #2e6f45;
  color: #9ac8a8;
}

.night-note-editor {
  min-height: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 9px;
}

.night-note-editor span {
  color: #c8aa65;
  font-size: 0.9rem;
  font-weight: 800;
}

.notes-textarea {
  min-height: 0;
  width: 100%;
  flex: 1;
  resize: none;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #121212;
  color: #f8f1e7;
  padding: 13px 14px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.45;
  overflow-y: auto;
}

.notes-panel {
  min-height: 0;
}

.notes-state {
  color: #9ac8a8;
  font-size: 0.86rem;
  font-weight: 800;
}

.notes-textarea::placeholder {
  color: #777;
}

.notes-textarea:focus {
  outline: none;
  border-color: #c8aa65;
}

.ghost-btn,
.primary-btn,
.secondary-btn {
  min-height: 48px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
}

.ghost-btn {
  min-height: 40px;
  background: #2c2c2c;
  color: #f8f1e7;
  padding: 0 12px;
}

.primary-btn {
  background: #9f2929;
  color: white;
}

.secondary-btn {
  background: #2f2f2f;
  color: #f8f1e7;
}

.drawer-action-btn {
  border: 0;
  border-radius: 8px;
  background: #252525;
  color: #f8f1e7;
  min-height: 44px;
  padding: 0 16px;
  font-weight: 800;
  cursor: pointer;
  text-align: left;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.68);
  padding: 18px;
}

.confirm-dialog {
  width: min(420px, 100%);
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #1b1b1b;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
  color: #f8f1e7;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
}

.dialog-message {
  margin: 0;
  color: #bdb6aa;
  font-size: 0.95rem;
  line-height: 1.45;
}

.dialog-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.dialog-primary-btn,
.dialog-secondary-btn {
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
}

.dialog-primary-btn {
  background: #9f2929;
  color: white;
}

.dialog-secondary-btn {
  background: #2f2f2f;
  color: #f8f1e7;
}

@media (max-width: 620px) {
  .summary-header {
    grid-template-columns: 1fr;
  }

  .eyebrow {
    font-size: 0.68rem;
  }

  h1 {
    font-size: 1rem;
  }

  h2 {
    font-size: 0.92rem;
  }

  .progress,
  .side-pill,
  .player-role,
  .death-pill,
  .section-label,
  .night-tab-btn,
  .notes-state,
  .night-note-editor span,
  .dialog-message,
  .tab-btn,
  .inner-tab-btn,
  .player-name-display,
  .player-name-input,
  .status-select {
    font-size: 0.76rem;
  }

  .notes-textarea {
    font-size: 0.88rem;
  }

  .player-name-input,
  .status-select,
  .notes-textarea {
    min-height: 34px;
    padding: 10px 11px;
  }

  .player-name-input {
    font-size: 0.82rem;
  }

  .status-select {
    font-size: 0.74rem;
  }

  .summary-header > div:first-child,
  .summary-header .progress {
    display: none;
  }

  .ghost-btn {
    justify-self: start;
  }

  .summary-content {
    padding: 14px;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 10px;
  }

  .primary-btn,
  .secondary-btn {
    min-height: 38px;
    padding: 0 14px;
    border: 1px solid #3c3c3c;
    font-size: 0.86rem;
  }

  .ghost-btn {
    min-height: 34px;
    padding: 0 10px;
    font-size: 0.8rem;
  }

  .menu-btn {
    width: 36px;
    height: 36px;
  }

  .drawer-action-btn {
    min-height: 40px;
    font-size: 0.86rem;
  }

  .tab-btn,
  .inner-tab-btn,
  .night-tab-btn,
  .dialog-primary-btn,
  .dialog-secondary-btn {
    min-height: 36px;
    font-size: 0.78rem;
  }

  .panel-header {
    flex-direction: column;
  }

  .side-summary {
    justify-content: flex-start;
  }

  .death-summary {
    flex-direction: column;
  }

  .graveyard-list {
    max-height: 100%;
  }

  .inner-tabs {
    gap: 6px;
  }

  .inner-tab-btn {
    min-height: 38px;
    font-size: 0.86rem;
  }

  .player-card {
    grid-template-areas:
      "index name toggle"
      ". role role"
      ". disabled";
    grid-template-columns: 30px minmax(0, 1fr) auto;
    align-items: start;
    gap: 9px 10px;
  }

  .status-toggle {
    padding: 0;
    min-height: 34px;
    gap: 5px;
    font-size: 0.78rem;
  }

  .disable-controls {
    grid-template-columns: minmax(0, 92px) minmax(0, 102px);
    gap: 6px;
  }

  .status-select {
    min-height: 32px;
    padding: 0 6px;
    font-size: 0.72rem;
  }

  .dialog-message {
    font-size: 0.8rem;
  }
}
</style>

<template>
  <div class="setup-container">
    <main class="setup-panel">
      <section class="setup-header">
        <p class="eyebrow">Russian Mafia Organizer</p>
        <h1>RoleDealer</h1>
        <p class="subtitle">Pick a scenario, set the table size, complete the role list, then enter players.</p>
      </section>

      <div v-if="hasSavedGame" class="saved-game-section">
        <button @click="$emit('resume')" class="secondary-btn">Resume Saved Game</button>
      </div>

      <section class="section">
        <h2>Scenario</h2>
        <div class="scenario-grid">
          <button
            v-for="scenario in scenarios"
            :key="scenario.id"
            type="button"
            :class="['scenario-option', { selected: selectedScenarioId === scenario.id }]"
            @click="selectScenario(scenario.id)"
          >
            <span class="scenario-name">{{ scenario.name }}</span>
            <span class="scenario-description">{{ scenario.description }}</span>
            <span class="scenario-meta">Standard {{ scenario.standardRoles.length }} players</span>
          </button>
        </div>
      </section>

      <section class="section">
        <h2>Number of Players</h2>
        <div class="number-row">
          <button type="button" class="stepper-btn" @click="decrementPlayers">-</button>
          <input v-model.number="playerCount" class="number-input" type="number" min="1" max="30" />
          <button type="button" class="stepper-btn" @click="incrementPlayers">+</button>
        </div>
        <p class="helper-text">
          {{ selectedScenario.name }} has {{ recommendedRoleCount }} recommended roles for this table.
        </p>
      </section>

      <section v-if="selectedScenario.roleDetails?.length" class="section scenario-details">
        <div class="section-title-row">
          <h2>Scenario Calls</h2>
          <span class="count-pill">{{ selectedScenario.minPlayers }}+ players</span>
        </div>

        <div class="rules-grid">
          <div v-for="role in selectedScenario.roleDetails" :key="role.name" class="rule-row">
            <div>
              <strong>{{ role.name }}</strong>
              <span>{{ role.side || role.team }}</span>
            </div>
            <p v-if="role.ability">{{ role.ability }}</p>
          </div>
        </div>

        <div v-if="selectedScenario.investigationNotes?.length" class="info-panel">
          <h3>Detective Results</h3>
          <p v-for="note in selectedScenario.investigationNotes" :key="note">{{ note }}</p>
        </div>

        <div v-if="selectedScenario.winConditions?.length" class="info-panel">
          <h3>Win Conditions</h3>
          <p v-for="condition in selectedScenario.winConditions" :key="condition">{{ condition }}</p>
        </div>
      </section>

      <section class="section">
        <div class="section-title-row">
          <h2>Roles</h2>
          <span class="count-pill">{{ completedRoles.length }} / {{ normalizedPlayerCount }}</span>
        </div>

        <div class="role-tags">
          <span v-for="role in rolePreview" :key="role.name" class="role-tag">
            {{ role.name }} x{{ role.count }}
          </span>
        </div>

        <div v-if="missingRoleCount > 0" class="missing-role-panel">
          <p class="helper-text">
            Add {{ missingRoleCount }} more {{ missingRoleCount === 1 ? 'role' : 'roles' }} for this player count.
          </p>
          <form class="player-form" @submit.prevent="addExtraRole">
            <input
              v-model="extraRoleName"
              type="text"
              placeholder="Missing role name"
              maxlength="30"
              class="text-input"
            />
            <button type="submit" class="add-btn">Add Role</button>
          </form>
        </div>

        <div v-if="extraRoles.length" class="players-list">
          <div v-for="(role, index) in extraRoles" :key="`${role}-${index}`" class="player-row">
            <span>{{ role }}</span>
            <button type="button" class="remove-btn" @click="removeExtraRole(index)">Remove</button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title-row">
          <h2>Players</h2>
          <span class="count-pill">{{ completedPlayerCount }} / {{ normalizedPlayerCount }}</span>
        </div>

        <div class="player-inputs">
          <label v-for="(_, index) in playerNames" :key="index" class="player-input-row">
            <span>Player {{ index + 1 }}</span>
            <input
              v-model="playerNames[index]"
              type="text"
              :placeholder="`Player ${index + 1} name`"
              maxlength="30"
              required
              class="text-input"
              @input="errors = []"
            />
          </label>
        </div>
      </section>

      <div v-if="errors.length" class="error-messages">
        <p v-for="error in errors" :key="error" class="error">{{ error }}</p>
      </div>

      <button type="button" class="start-btn" @click="startGame">Start Role Reveal</button>
    </main>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { SCENARIOS, getRolesForPlayerCount, getScenarioById, shuffle, summarizeRoles } from '../scenarios.js'

export default {
  name: 'RoleInput',
  props: {
    hasSavedGame: {
      type: Boolean,
      default: false
    }
  },
  emits: ['start', 'resume'],
  setup(props, { emit }) {
    const scenarios = SCENARIOS
    const selectedScenarioId = ref(SCENARIOS[0].id)
    const playerCount = ref(SCENARIOS[0].standardRoles.length)
    const extraRoleName = ref('')
    const extraRoles = ref([])
    const playerNames = ref(Array.from({ length: SCENARIOS[0].standardRoles.length }, () => ''))
    const errors = ref([])

    const selectedScenario = computed(() => getScenarioById(selectedScenarioId.value))
    const normalizedPlayerCount = computed(() => Math.max(1, Number(playerCount.value) || 1))
    const recommendedRoles = computed(() => {
      return getRolesForPlayerCount(selectedScenario.value, normalizedPlayerCount.value)
    })
    const recommendedRoleCount = computed(() => {
      return Math.min(recommendedRoles.value.length, normalizedPlayerCount.value)
    })
    const standardRolesForCount = computed(() => {
      return recommendedRoles.value.slice(0, normalizedPlayerCount.value)
    })
    const missingRoleCount = computed(() => {
      return Math.max(0, normalizedPlayerCount.value - standardRolesForCount.value.length - extraRoles.value.length)
    })
    const completedRoles = computed(() => {
      return [...standardRolesForCount.value, ...extraRoles.value].slice(0, normalizedPlayerCount.value)
    })
    const rolePreview = computed(() => summarizeRoles(completedRoles.value))
    const trimmedPlayerNames = computed(() => playerNames.value.map((name) => name.trim()))
    const completedPlayerCount = computed(() => {
      return trimmedPlayerNames.value.filter(Boolean).length
    })

    const syncPlayerInputs = () => {
      const count = normalizedPlayerCount.value

      if (playerNames.value.length > count) {
        playerNames.value = playerNames.value.slice(0, count)
        return
      }

      while (playerNames.value.length < count) {
        playerNames.value.push('')
      }
    }

    watch([selectedScenarioId, playerCount], () => {
      extraRoles.value = []
      syncPlayerInputs()
      errors.value = []
    })

    const selectScenario = (scenarioId) => {
      selectedScenarioId.value = scenarioId
      playerCount.value = getScenarioById(scenarioId).standardRoles.length
    }

    const incrementPlayers = () => {
      if (normalizedPlayerCount.value < 30) playerCount.value = normalizedPlayerCount.value + 1
    }

    const decrementPlayers = () => {
      if (normalizedPlayerCount.value > selectedScenario.value.minPlayers) {
        playerCount.value = normalizedPlayerCount.value - 1
      }
    }

    const addExtraRole = () => {
      const role = extraRoleName.value.trim()
      errors.value = []

      if (!role) {
        errors.value = ['Enter the missing role name.']
        return
      }

      if (missingRoleCount.value <= 0) {
        errors.value = ['The role list is already complete for this player count.']
        return
      }

      extraRoles.value.push(role)
      extraRoleName.value = ''
    }

    const removeExtraRole = (index) => {
      extraRoles.value.splice(index, 1)
      errors.value = []
    }

    const startGame = () => {
      errors.value = []

      if (normalizedPlayerCount.value < selectedScenario.value.minPlayers) {
        errors.value = [
          `${selectedScenario.value.name} needs at least ${selectedScenario.value.minPlayers} players.`
        ]
        return
      }

      if (missingRoleCount.value > 0) {
        errors.value = [`Add ${missingRoleCount.value} missing roles before starting.`]
        return
      }

      if (completedPlayerCount.value !== normalizedPlayerCount.value) {
        errors.value = ['Fill in every player name before starting.']
        return
      }

      const duplicateNames = trimmedPlayerNames.value.filter((name, index, names) => {
        return names.findIndex((existingName) => existingName.toLowerCase() === name.toLowerCase()) !== index
      })

      if (duplicateNames.length) {
        errors.value = ['Each player name must be unique.']
        return
      }

      const roles = shuffle(completedRoles.value)
      const assignments = trimmedPlayerNames.value.map((name, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
        name,
        role: roles[index],
        revealed: false
      }))

      emit('start', {
        scenario: {
          id: selectedScenario.value.id,
          name: selectedScenario.value.name
        },
        assignments
      })
    }

    return {
      scenarios,
      selectedScenarioId,
      selectedScenario,
      playerCount,
      normalizedPlayerCount,
      recommendedRoleCount,
      extraRoleName,
      extraRoles,
      playerNames,
      completedPlayerCount,
      missingRoleCount,
      completedRoles,
      rolePreview,
      errors,
      selectScenario,
      incrementPlayers,
      decrementPlayers,
      addExtraRole,
      removeExtraRole,
      startGame
    }
  }
}
</script>

<style scoped>
.setup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #171717;
  padding: 24px;
}

.setup-panel {
  width: min(780px, 100%);
  background: #f7f4ee;
  border: 1px solid #d6d0c3;
  border-radius: 8px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: #1d1b18;
}

.setup-header,
.saved-game-section,
.section,
.missing-role-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.eyebrow {
  color: #8d1f1f;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: 2.1rem;
}

h2 {
  font-size: 1rem;
}

h3 {
  font-size: 0.88rem;
}

.subtitle,
.scenario-description,
.scenario-meta,
.helper-text {
  color: #5d5850;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.scenario-option {
  min-height: 132px;
  border: 1px solid #c9c0b1;
  border-radius: 8px;
  background: #fffaf1;
  padding: 14px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

.scenario-option.selected {
  border-color: #8d1f1f;
  box-shadow: inset 0 0 0 2px #8d1f1f;
}

.scenario-name {
  font-size: 1.05rem;
  font-weight: 800;
}

.scenario-description,
.scenario-meta,
.helper-text {
  font-size: 0.9rem;
  line-height: 1.35;
}

.scenario-meta {
  margin-top: auto;
  font-weight: 700;
}

.number-row,
.section-title-row,
.player-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title-row,
.player-row {
  justify-content: space-between;
}

.number-input {
  width: 110px;
  border: 1px solid #c9c0b1;
  border-radius: 8px;
  padding: 11px 12px;
  background: white;
  color: #1d1b18;
  text-align: center;
  font-weight: 800;
}

.stepper-btn {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 8px;
  background: #2f2f2f;
  color: white;
  font-size: 1.2rem;
  font-weight: 900;
  cursor: pointer;
}

.count-pill,
.role-tag {
  background: #e7dfd0;
  border-radius: 999px;
  color: #3a352d;
  font-size: 0.84rem;
  font-weight: 700;
  padding: 6px 10px;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scenario-details {
  border-top: 1px solid #ded6c9;
  border-bottom: 1px solid #ded6c9;
  padding: 16px 0;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.rule-row,
.info-panel {
  border: 1px solid #ded6c9;
  border-radius: 8px;
  background: white;
  padding: 11px 12px;
}

.rule-row {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.rule-row div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.rule-row strong {
  overflow-wrap: anywhere;
}

.rule-row span {
  border-radius: 999px;
  background: #e7dfd0;
  color: #3a352d;
  flex-shrink: 0;
  font-size: 0.76rem;
  font-weight: 800;
  padding: 4px 8px;
}

.rule-row p,
.info-panel p {
  color: #5d5850;
  font-size: 0.86rem;
  line-height: 1.35;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.text-input {
  width: 100%;
  border: 1px solid #c9c0b1;
  border-radius: 8px;
  padding: 12px 14px;
  background: white;
  color: #1d1b18;
}

.add-btn,
.start-btn,
.secondary-btn,
.remove-btn {
  border: 0;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
}

.add-btn,
.start-btn {
  background: #8d1f1f;
  color: white;
}

.add-btn {
  padding: 0 18px;
}

.start-btn,
.secondary-btn {
  padding: 14px 18px;
}

.secondary-btn {
  background: #2f2f2f;
  color: white;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-inputs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.player-input-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-input-row span {
  color: #5d5850;
  font-size: 0.82rem;
  font-weight: 800;
}

.player-row {
  background: white;
  border: 1px solid #ded6c9;
  border-radius: 8px;
  padding: 10px 12px;
}

.remove-btn {
  background: #ece5d9;
  color: #5a201d;
  padding: 7px 10px;
}

.error-messages {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.error {
  color: #8d1f1f;
  font-weight: 700;
}

@media (max-width: 640px) {
  .setup-container {
    padding: 12px;
    align-items: stretch;
  }

  .setup-panel {
    min-height: calc(100vh - 24px);
    padding: 20px;
  }

  .scenario-grid,
  .rules-grid,
  .player-inputs,
  .player-form {
    grid-template-columns: 1fr;
  }

  .add-btn {
    min-height: 44px;
  }
}
</style>

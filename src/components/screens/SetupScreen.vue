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
            <span class="scenario-meta">Standard {{ getStandardCount(scenario) }} players</span>
          </button>
        </div>
      </section>

      <section class="section">
        <h2>Number of Players</h2>
        <div class="number-row">
          <button type="button" class="stepper-btn" @click="decrementPlayers">-</button>
          <input v-model.number="playerCount" class="number-input" type="number" min="1" :max="playerLimit" />
          <button type="button" class="stepper-btn" @click="incrementPlayers">+</button>
        </div>
        <p class="helper-text">
          <span v-if="isCustomScenario">
            Add custom roles with counts until total roles reach {{ normalizedPlayerCount }}.
          </span>
          <span v-else>
            {{ selectedScenario.name }} automatically selects {{ baseRoleCount }} roles for this table size.
          </span>
        </p>
      </section>

      <section v-if="selectedScenario.id === 'custom'" class="section scenario-details">
        <div class="section-title-row">
          <h2>Scenario Calls</h2>
          <span class="count-pill">{{ customRoleTotalCount }} / {{ normalizedPlayerCount }}</span>
        </div>

        <div :class="['missing-role-panel', { disabled: customRoleTotalCount >= normalizedPlayerCount }]">
          <p class="helper-text">
            Add custom roles manually. Each role can be added with a count.
          </p>
          <form class="custom-role-form" @submit.prevent="addCustomRole">
            <input
              v-model="customRoleDraft.name"
              type="text"
              placeholder="Role name"
              maxlength="40"
              class="text-input"
              :disabled="customRoleTotalCount >= normalizedPlayerCount"
            />
            <select v-model="customRoleDraft.side" class="text-input" :disabled="customRoleTotalCount >= normalizedPlayerCount">
              <option value="Mafia">Mafia</option>
              <option value="Town">Town</option>
              <option value="Independent">Independent</option>
            </select>
            <input
              v-model="customRoleDraft.ability"
              type="text"
              placeholder="Short description"
              maxlength="120"
              class="text-input"
              :disabled="customRoleTotalCount >= normalizedPlayerCount"
            />
            <input
              v-model.number="customRoleDraft.count"
              type="number"
              min="1"
              :max="Math.max(1, customRoleSlots)"
              class="text-input count-input"
              placeholder="Count"
              :disabled="customRoleTotalCount >= normalizedPlayerCount"
            />
            <button type="submit" class="add-btn" :disabled="customRoleTotalCount >= normalizedPlayerCount">
              Add Role
            </button>
          </form>
          <p v-if="customRoleTotalCount >= normalizedPlayerCount" class="helper-text">
            Maximum custom roles reached.
          </p>
          <p v-else class="helper-text">{{ customRoleSlots }} role slot{{ customRoleSlots === 1 ? '' : 's' }} remaining.</p>
        </div>

        <div class="rules-grid">
          <div v-for="(role, index) in customRoleItems" :key="`${role.name}-${index}`" class="rule-row">
            <div>
              <strong>{{ role.name }}</strong>
              <span>{{ role.side }} x{{ role.count }}</span>
            </div>
            <p v-if="role.ability">{{ role.ability }}</p>
            <button type="button" class="remove-btn remove-inline" @click="removeCustomRole(index)">Remove</button>
          </div>
        </div>
      </section>

      <section v-else-if="selectedScenario.roleDetails?.length" class="section scenario-details">
        <div class="section-title-row">
          <h2>Scenario Calls</h2>
          <span class="count-pill">{{ baseRoleCount }} selected roles</span>
        </div>

        <div class="role-tags">
          <span v-for="role in rolePreview" :key="role.name" class="role-tag">{{ role.name }} x{{ role.count }}</span>
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
import { SCENARIOS, getRolesForPlayerCount, getScenarioById, getStandardPlayerCount, shuffle, summarizeRoles } from '../../scenarios.js'

export default {
  name: 'SetupScreen',
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
    const initialPlayerCount = SCENARIOS[0].id === 'custom' ? 1 : getStandardPlayerCount(SCENARIOS[0])
    const playerCount = ref(initialPlayerCount)
    const customRoleItems = ref([])
    const customRoleDraft = ref({
      name: '',
      side: 'Town',
      ability: '',
      count: 1
    })
    const playerNames = ref(Array.from({ length: initialPlayerCount }, () => ''))
    const errors = ref([])

    const selectedScenario = computed(() => getScenarioById(selectedScenarioId.value))
    const isCustomScenario = computed(() => selectedScenario.value.id === 'custom')
    const playerLimit = computed(() => {
      if (isCustomScenario.value) return 30

      const recommendedCounts = Object.keys(selectedScenario.value.recommendedRolesByCount || {})
        .map(Number)
        .filter(Number.isFinite)

      if (recommendedCounts.length) {
        return Math.max(...recommendedCounts)
      }

      return Math.max(selectedScenario.value.minPlayers || 1, getStandardPlayerCount(selectedScenario.value))
    })
    const normalizedPlayerCount = computed(() => {
      const parsedCount = Number(playerCount.value) || 1
      return Math.min(playerLimit.value, Math.max(1, parsedCount))
    })
    const baseRoleNames = computed(() => {
      if (isCustomScenario.value) return []
      return getRolesForPlayerCount(selectedScenario.value, normalizedPlayerCount.value)
    })
    const baseRoleCount = computed(() => {
      return isCustomScenario.value ? 0 : baseRoleNames.value.length
    })
    const customRoleTotalCount = computed(() => {
      return customRoleItems.value.reduce((sum, role) => sum + (Number(role.count) || 0), 0)
    })
    const customRoleSlots = computed(() => {
      if (!isCustomScenario.value) return 0
      return Math.max(0, normalizedPlayerCount.value - customRoleTotalCount.value)
    })
    const completedRoles = computed(() => {
      if (isCustomScenario.value) {
        return customRoleItems.value
          .flatMap((role) => Array.from({ length: Math.max(1, Number(role.count) || 1) }, () => role.name))
          .slice(0, normalizedPlayerCount.value)
      }

      return baseRoleNames.value.slice(0, normalizedPlayerCount.value)
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

    watch([playerCount, playerLimit], () => {
      if (playerCount.value !== normalizedPlayerCount.value) {
        playerCount.value = normalizedPlayerCount.value
      }
      syncPlayerInputs()
      errors.value = []
    })

    const selectScenario = (scenarioId) => {
      selectedScenarioId.value = scenarioId
      const nextScenario = getScenarioById(scenarioId)
      customRoleItems.value = []
      customRoleDraft.value = {
        name: '',
        side: 'Town',
        ability: '',
        count: 1
      }
      playerCount.value = nextScenario.id === 'custom' ? 1 : getStandardPlayerCount(nextScenario)
    }

    const incrementPlayers = () => {
      if (normalizedPlayerCount.value < playerLimit.value) playerCount.value = normalizedPlayerCount.value + 1
    }

    const decrementPlayers = () => {
      if (normalizedPlayerCount.value > selectedScenario.value.minPlayers) {
        playerCount.value = normalizedPlayerCount.value - 1
      }
    }

    const addCustomRole = () => {
      const name = customRoleDraft.value.name.trim()
      const side = customRoleDraft.value.side
      const ability = customRoleDraft.value.ability.trim()
      const count = Math.max(1, Math.floor(Number(customRoleDraft.value.count) || 1))
      errors.value = []

      if (!name) {
        errors.value = ['Enter the custom role name.']
        return
      }

      if (customRoleItems.value.some((role) => role.name.toLowerCase() === name.toLowerCase())) {
        errors.value = ['Each custom role name must be unique.']
        return
      }

      if (!Number.isFinite(count) || count < 1) {
        errors.value = ['Role count must be at least 1.']
        return
      }

      if (count > customRoleSlots.value) {
        errors.value = [`Only ${customRoleSlots.value} role slot${customRoleSlots.value === 1 ? '' : 's'} remaining.`]
        return
      }

      customRoleItems.value.push({
        name,
        side,
        ability,
        count
      })

      customRoleDraft.value = {
        name: '',
        side,
        ability: '',
        count: 1
      }
    }

    const removeCustomRole = (index) => {
      customRoleItems.value.splice(index, 1)
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

      if (isCustomScenario.value) {
        if (customRoleTotalCount.value !== normalizedPlayerCount.value) {
          errors.value = [`Add custom roles totaling exactly ${normalizedPlayerCount.value} players before starting.`]
          return
        }

        if (customRoleItems.value.some((role) => !role.name.trim())) {
          errors.value = ['Every custom role needs a name.']
          return
        }

        const duplicateCustomRoles = customRoleItems.value.filter((role, index, roles) => {
          return roles.findIndex((existingRole) => existingRole.name.toLowerCase() === role.name.toLowerCase()) !== index
        })

        if (duplicateCustomRoles.length) {
          errors.value = ['Each custom role name must be unique.']
          return
        }
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
      const mergedRoleDetails = isCustomScenario.value
        ? customRoleItems.value.map((role) => ({ ...role }))
        : [...(selectedScenario.value.roleDetails || [])]
      const scenarioPayload = {
        ...selectedScenario.value,
        standardRoles: isCustomScenario.value
          ? customRoleItems.value.map((role) => ({ ...role }))
          : [...(selectedScenario.value.standardRoles || [])],
        roleDetails: mergedRoleDetails,
        minPlayers: isCustomScenario.value ? normalizedPlayerCount.value : selectedScenario.value.minPlayers
      }

      const assignments = trimmedPlayerNames.value.map((name, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
        name,
        role: roles[index],
        revealed: false
      }))

      emit('start', {
        scenario: scenarioPayload,
        assignments
      })
    }

    return {
      scenarios,
      selectedScenarioId,
      selectedScenario,
      playerCount,
      normalizedPlayerCount,
      playerLimit,
      baseRoleCount,
      customRoleTotalCount,
      customRoleSlots,
      customRoleItems,
      customRoleDraft,
      playerNames,
      completedPlayerCount,
      completedRoles,
      rolePreview,
      errors,
      selectScenario,
      incrementPlayers,
      decrementPlayers,
      addCustomRole,
      removeCustomRole,
      isCustomScenario,
      getStandardCount: getStandardPlayerCount,
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

.custom-role-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(120px, 0.7fr) minmax(0, 1.3fr) minmax(86px, 0.45fr) auto;
  gap: 8px;
}

.missing-role-panel.disabled {
  opacity: 0.6;
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

.remove-inline {
  justify-self: start;
  padding: 7px 10px;
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

.text-input:disabled {
  background: #ece8de;
  color: #8c8578;
  cursor: not-allowed;
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

.add-btn:disabled {
  background: #b9b1a4;
  color: #f7f4ee;
  cursor: not-allowed;
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

  h1 {
    font-size: 1.6rem;
  }

  h2 {
    font-size: 0.86rem;
  }

  h3 {
    font-size: 0.78rem;
  }

  .subtitle,
  .scenario-description,
  .scenario-meta,
  .helper-text,
  .rule-row p,
  .info-panel p {
    font-size: 0.82rem;
  }

  .scenario-name {
    font-size: 0.92rem;
  }

  .count-pill,
  .role-tag,
  .rule-row span,
  .player-input-row span {
    font-size: 0.74rem;
  }

  .stepper-btn {
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }

  .number-input,
  .text-input {
    min-height: 38px;
    padding: 10px 11px;
    font-size: 0.84rem;
  }

  .add-btn,
  .start-btn,
  .secondary-btn,
  .remove-btn {
    min-height: 38px;
    font-size: 0.78rem;
  }

  .add-btn {
    padding: 0 14px;
  }

  .start-btn,
  .secondary-btn {
    padding: 12px 14px;
  }

  .remove-btn {
    padding: 6px 9px;
  }

  .error-messages {
    gap: 4px;
  }

  .error {
    font-size: 0.76rem;
    line-height: 1.35;
  }

  .scenario-grid,
  .rules-grid,
  .custom-role-form,
  .player-form {
    grid-template-columns: 1fr;
  }

  .player-inputs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .player-input-row {
    gap: 5px;
  }

  .add-btn {
    min-height: 44px;
  }
}
</style>

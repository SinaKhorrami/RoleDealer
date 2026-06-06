<template>
  <div class="reveal-container">
    <header class="top-bar">
      <button type="button" class="ghost-btn" @click="goBack">Back</button>
      <div>
        <p class="eyebrow">{{ scenario?.name || 'Scenario' }}</p>
        <h1>Role Reveal</h1>
      </div>
      <span class="progress">{{ currentIndex + 1 }} / {{ assignments.length }}</span>
    </header>

    <main class="reveal-stage">
      <section v-if="currentAssignment && !showRole" class="reveal-card">
        <p class="small-label">Wake this player only</p>
        <h2>{{ currentAssignment.name }}</h2>
        <button type="button" class="primary-btn" @click="showCurrentRole">
          Show role for {{ currentAssignment.name }}
        </button>
      </section>

      <section v-else-if="currentAssignment" :class="['reveal-card', 'role-visible', roleCardClass]">
        <p class="small-label">{{ currentAssignment.name }}</p>
        <h2>{{ currentAssignment.role }}</h2>
        <button type="button" class="primary-btn" @click="confirmRole">Got it</button>
      </section>

      <section v-else class="reveal-card">
        <p class="small-label">Complete</p>
        <h2>All roles are assigned</h2>
        <button type="button" class="primary-btn" @click="finishReveal">View Summary</button>
      </section>
    </main>

    <footer class="queue">
      <div
        v-for="(assignment, index) in assignments"
        :key="assignment.id"
        :class="['queue-item', { active: index === currentIndex, done: index < currentIndex }]"
      >
        <span>{{ index + 1 }}</span>
        <strong>{{ assignment.name }}</strong>
      </div>
    </footer>
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
    const currentIndex = ref(assignments.value.findIndex((assignment) => !assignment.revealed))
    const showRole = ref(false)

    if (currentIndex.value === -1) {
      currentIndex.value = assignments.value.length
    }

    const currentAssignment = computed(() => assignments.value[currentIndex.value] || null)
    const currentRoleSide = computed(() => {
      return getRoleSide(props.scenario, currentAssignment.value?.role)
    })
    const roleCardClass = computed(() => {
      return currentRoleSide.value === 'Mafia' ? 'role-mafia' : 'role-citizen'
    })

    const persist = () => {
      saveGameRoles(assignments.value)
      savePlayers(assignments.value.filter((assignment) => assignment.revealed))
    }

    const showCurrentRole = () => {
      showRole.value = true
    }

    const confirmRole = () => {
      if (!currentAssignment.value) return

      assignments.value[currentIndex.value].revealed = true
      currentIndex.value += 1
      showRole.value = false
      persist()

      if (currentIndex.value >= assignments.value.length) {
        finishReveal()
      }
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
      currentIndex,
      currentAssignment,
      roleCardClass,
      showRole,
      showCurrentRole,
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

.reveal-card h2 {
  max-width: 100%;
  overflow-wrap: anywhere;
  font-size: clamp(2rem, 7vw, 4rem);
  line-height: 1.05;
}

.role-visible {
  border-width: 2px;
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

.queue {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 14px 18px;
  border-top: 1px solid #333;
  background: #171717;
}

.queue-item {
  min-width: 132px;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 10px;
  color: #aaa;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.queue-item span {
  color: #777;
  font-size: 0.8rem;
  font-weight: 800;
}

.queue-item strong {
  overflow-wrap: anywhere;
}

.queue-item.active {
  border-color: #c8aa65;
  color: #f8f1e7;
}

.queue-item.done {
  border-color: #2e6f45;
  color: #9ac8a8;
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
}
</style>

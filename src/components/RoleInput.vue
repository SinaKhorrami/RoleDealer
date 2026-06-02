<template>
  <div class="role-input-container">
    <div class="content">
      <h1>🎭 RoleDealer</h1>
      <p class="subtitle">Add roles for your Mafia game</p>

      <div class="form-group">
        <div class="input-wrapper">
          <input
            v-model="roleName"
            type="text"
            placeholder="Role name (e.g., Mafia, Doctor)"
            @keyup.enter="addRole"
            maxlength="20"
            class="role-input"
          />
          <div class="input-subtext">{{ roleName.length }}/20</div>
        </div>

        <div class="count-wrapper">
          <label>Count:</label>
          <div class="count-controls">
            <button @click="decrementCount" class="count-btn">−</button>
            <span class="count-display">{{ roleCount }}</span>
            <button @click="incrementCount" class="count-btn">+</button>
          </div>
        </div>

        <button @click="addRole" class="add-btn">+ Add Role</button>
      </div>

      <div v-if="roles.length > 0" class="roles-list">
        <h2>Roles Added:</h2>
        <div class="role-tags">
          <div v-for="(role, index) in roles" :key="index" class="role-tag">
            <span>{{ role.name }} <span class="count-badge">×{{ role.count }}</span></span>
            <button @click="removeRole(index)" class="remove-btn">✕</button>
          </div>
        </div>
      </div>

      <div v-if="roles.length > 0" class="game-info">
        <p>Total roles: <strong>{{ totalRoles }}</strong></p>
      </div>

      <button
        v-if="roles.length > 0"
        @click="startGame"
        class="start-btn"
      >
        START GAME
      </button>

      <div v-if="errors.length > 0" class="error-messages">
        <p v-for="(error, index) in errors" :key="index" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'RoleInput',
  emits: ['start'],
  setup(props, { emit }) {
    const roleName = ref('')
    const roleCount = ref(1)
    const roles = ref([])
    const errors = ref([])

    const totalRoles = computed(() => {
      return roles.value.reduce((sum, role) => sum + role.count, 0)
    })

    const addRole = () => {
      errors.value = []
      
      if (!roleName.value.trim()) {
        errors.value.push('Please enter a role name')
        return
      }

      if (roleName.value.length > 20) {
        errors.value.push('Role name must be 20 characters or less')
        return
      }

      if (roleCount.value < 1) {
        errors.value.push('Count must be at least 1')
        return
      }

      if (roles.value.some(r => r.name.toLowerCase() === roleName.value.toLowerCase())) {
        errors.value.push('This role already exists')
        return
      }

      roles.value.push({
        name: roleName.value.trim(),
        count: roleCount.value
      })

      roleName.value = ''
      roleCount.value = 1
    }

    const removeRole = (index) => {
      roles.value.splice(index, 1)
      errors.value = []
    }

    const incrementCount = () => {
      if (roleCount.value < 10) {
        roleCount.value++
      }
    }

    const decrementCount = () => {
      if (roleCount.value > 1) {
        roleCount.value--
      }
    }

    const startGame = () => {
      if (roles.value.length === 0) {
        errors.value = ['Please add at least one role']
        return
      }

      // Flatten roles into an array of individual role objects
      const gameRoles = []
      roles.value.forEach(role => {
        for (let i = 0; i < role.count; i++) {
          gameRoles.push({
            name: role.name,
            id: Math.random() // Unique id for each role instance
          })
        }
      })

      // Shuffle the roles
      for (let i = gameRoles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameRoles[i], gameRoles[j]] = [gameRoles[j], gameRoles[i]]
      }

      emit('start', gameRoles)
    }

    return {
      roleName,
      roleCount,
      roles,
      errors,
      totalRoles,
      addRole,
      removeRole,
      incrementCount,
      decrementCount,
      startGame
    }
  }
}
</script>

<style scoped>
.role-input-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.content {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 90vh;
  overflow-y: auto;
}

h1 {
  margin: 0;
  font-size: 2.5em;
  text-align: center;
  color: #333;
}

.subtitle {
  margin: 0;
  text-align: center;
  color: #666;
  font-size: 0.95em;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-wrapper {
  position: relative;
}

.role-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1em;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.role-input:focus {
  outline: none;
  border-color: #667eea;
}

.input-subtext {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75em;
  color: #999;
  pointer-events: none;
}

.count-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 10px;
}

.count-wrapper label {
  font-weight: 600;
  color: #333;
  min-width: 50px;
}

.count-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.count-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
}

.count-btn:active {
  background: #667eea;
  color: white;
  transform: scale(0.95);
}

.count-display {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  min-width: 30px;
  text-align: center;
}

.add-btn {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-btn:active {
  background: #5568d3;
  transform: scale(0.98);
}

.roles-list {
  margin-top: 10px;
}

.roles-list h2 {
  margin: 0 0 12px 0;
  font-size: 1em;
  color: #333;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  color: #333;
  border: 1px solid #ddd;
}

.count-badge {
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: bold;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover {
  color: #e74c3c;
  transform: scale(1.2);
}

.game-info {
  padding: 12px;
  background: #f0f7ff;
  border-left: 4px solid #667eea;
  border-radius: 8px;
  margin-top: 10px;
}

.game-info p {
  margin: 0;
  color: #333;
  font-size: 0.95em;
}

.start-btn {
  padding: 14px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  letter-spacing: 0.5px;
}

.start-btn:active {
  transform: scale(0.98);
}

.error-messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error {
  padding: 10px 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  margin: 0;
  font-size: 0.9em;
  border-left: 4px solid #c62828;
}
</style>

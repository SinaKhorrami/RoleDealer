<template>
  <SetupScreen
    :has-saved-game="hasSavedGame"
    @start="emit('start', $event)"
    @resume="emit('resume')"
  />
</template>

<script>
import SetupScreen from './screens/SetupScreen.vue'

export default {
  name: 'RoleInput',
  components: {
    SetupScreen
  },
  props: {
    hasSavedGame: {
      type: Boolean,
      default: false
    }
  },
  emits: ['start', 'resume'],
  setup(_, { emit }) {
    return {
      emit
    }
  }
}
</script>

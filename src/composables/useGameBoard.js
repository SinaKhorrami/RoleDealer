import { computed, ref } from 'vue'
import { getRoleSide } from '../scenarios.js'
import { saveGameRoles, savePlayers } from '../utils/storage.js'

export function useGameBoard(props, emit) {
  const assignments = ref(props.roles.map((assignment) => ({ ...assignment })))
  const selectedPlayerId = ref(null)
  const selectedAssignmentId = ref(null)

  const unrevealedPlayers = computed(() =>
    assignments.value.filter((assignment) => !assignment.revealed)
  )

  const selectedPlayer = computed(() => {
    return (
      assignments.value.find(
        (assignment) => assignment.id === selectedPlayerId.value
      ) || null
    )
  })

  const availableTiles = computed(() => {
    return assignments.value.filter((assignment) => !assignment.revealed)
  })

  const progressCount = computed(() => {
    return (
      assignments.value.filter((assignment) => assignment.revealed).length +
      (selectedPlayer.value ? 1 : 0)
    )
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

    const assignment = assignments.value.find(
      (entry) => entry.id === selectedPlayerId.value
    )
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
    finishReveal
  }
}

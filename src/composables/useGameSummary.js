import { computed, nextTick, onMounted, ref } from 'vue'
import { getRoleSide } from '../scenarios.js'
import { getGameNotes, saveGameNotes, savePlayers } from '../utils/storage.js'

export function useGameSummary(props, emit) {
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

    return editablePlayers.value
      .map((player, originalIndex) => {
        const side = getSide(player.role)
        player.originalIndex = originalIndex
        player.side = side
        player.className = sideClassByName[side] || 'side-citizen'
        return player
      })
      .sort((firstPlayer, secondPlayer) => {
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
        nightNotes.value = Array.from(
          { length: 10 },
          (_, index) => parsedNotes[index] || ''
        )
        return
      }
    } catch (error) {
      // Legacy notes were stored as plain text.
    }

    nightNotes.value[0] = savedNotes
  }

  const saveNotes = () => {
    saveGameNotes(JSON.stringify(nightNotes.value))
  }

  const handleNotesInput = () => {
    saveNotes()
  }

  const persistPlayers = () => {
    const playersToSave = editablePlayers.value.map((player) => ({
      id: player.id,
      name: player.name.trim(),
      role: player.role,
      revealed: player.revealed,
      disabled: Boolean(player.disabled),
      disabledReason: player.disabled ? player.disabledReason : null,
      disabledNight:
        player.disabled && player.disabledReason === 'night'
          ? player.disabledNight
          : null
    }))

    savePlayers(playersToSave)
    emit('updatePlayers', playersToSave)
  }

  const setPlayerRowRef = (playerId, el) => {
    if (el) graveyardRowRefs.value[playerId] = el
    else delete graveyardRowRefs.value[playerId]
  }

  const handleReasonChange = (player) => {
    if (
      player.disabledReason === 'night' &&
      !Number.isInteger(player.disabledNight)
    ) {
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
            row?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
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
      message:
        'This starts a new game with the same players and roles. Current night notes and player statuses will be cleared.',
      confirmLabel: 'Play Again',
      action: () => emit('playAgain')
    })
  }

  const goBackToSetup = () => {
    openConfirmDialog({
      title: 'Start new setup?',
      message:
        'This clears the current game, player statuses, and night notes so you can choose a new scenario and player list.',
      confirmLabel: 'New Setup',
      action: () => emit('backToSetup')
    })
  }

  const runDrawerAction = (action) => {
    drawerOpen.value = false
    action()
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
    goBackToSetup,
    runDrawerAction
  }
}

export const SCENARIOS = [
  {
    id: 'detective',
    name: 'Detective',
    description: 'Persian Detective setup with three Mafia roles and Citizen-side investigators.',
    minPlayers: 9,
    standardRoles: [
      'Godfather',
      'Matador',
      'Saul Goodman',
      'Detective',
      'Doctor',
      'Sniper',
      'Citizen Kane',
      'Constantine',
      'Simple Citizens'
    ],
    recommendedRolesByCount: {
      9: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Detective',
        'Doctor',
        'Sniper',
        'Citizen Kane',
        'Simple Citizens',
        'Simple Citizens'
      ],
      10: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Detective',
        'Doctor',
        'Sniper',
        'Citizen Kane',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      11: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Detective',
        'Doctor',
        'Sniper',
        'Citizen Kane',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      12: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Detective',
        'Doctor',
        'Sniper',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      13: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Detective',
        'Doctor',
        'Sniper',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      14: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Detective',
        'Doctor',
        'Sniper',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      15: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Mafia',
        'Detective',
        'Doctor',
        'Sniper',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ]
    },
    roleDetails: [
      {
        name: 'Detective',
        side: 'Citizen'
      },
      {
        name: 'Doctor',
        side: 'Citizen'
      },
      {
        name: 'Sniper',
        side: 'Citizen'
      },
      {
        name: 'Citizen Kane',
        side: 'Citizen'
      },
      {
        name: 'Constantine',
        side: 'Citizen'
      },
      {
        name: 'Simple Citizens',
        side: 'Citizen'
      },
      {
        name: 'Godfather',
        side: 'Mafia'
      },
      {
        name: 'Matador',
        side: 'Mafia'
      },
      {
        name: 'Saul Goodman',
        side: 'Mafia'
      },
      {
        name: 'Mafia',
        side: 'Mafia'
      }
    ],
    winConditions: [],
    investigationNotes: []
  },
  {
    id: 'godfather',
    name: 'Godfather',
    description: 'Gorgine Godfather setup with Mafia, Independent, and Citizen sides.',
    minPlayers: 10,
    standardRoles: [
      'Godfather',
      'Matador',
      'Saul Goodman',
      'Nostradamus',
      'Doctor Watson',
      'Leon the Professional',
      'Citizen Kane',
      'Constantine',
      'Simple Citizens',
      'Simple Citizens'
    ],
    recommendedRolesByCount: {
      10: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Nostradamus',
        'Doctor Watson',
        'Leon the Professional',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens'
      ],
      11: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Nostradamus',
        'Doctor Watson',
        'Leon the Professional',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      12: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Nostradamus',
        'Doctor Watson',
        'Leon the Professional',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      13: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Nostradamus',
        'Doctor Watson',
        'Leon the Professional',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      14: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Nostradamus',
        'Doctor Watson',
        'Leon the Professional',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ],
      15: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Nostradamus',
        'Doctor Watson',
        'Leon the Professional',
        'Citizen Kane',
        'Constantine',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens',
        'Simple Citizens'
      ]
    },
    roleDetails: [
      {
        name: 'Godfather',
        side: 'Mafia'
      },
      {
        name: 'Matador',
        side: 'Mafia'
      },
      {
        name: 'Saul Goodman',
        side: 'Mafia'
      },
      {
        name: 'Nostradamus',
        side: 'Independent'
      },
      {
        name: 'Doctor Watson',
        side: 'Citizen'
      },
      {
        name: 'Leon the Professional',
        side: 'Citizen'
      },
      {
        name: 'Citizen Kane',
        side: 'Citizen'
      },
      {
        name: 'Constantine',
        side: 'Citizen'
      },
      {
        name: 'Simple Citizens',
        side: 'Citizen'
      }
    ],
    winConditions: [],
    investigationNotes: []
  }
]

export function getScenarioById(id) {
  return SCENARIOS.find((scenario) => scenario.id === id) || SCENARIOS[0]
}

export function getRolesForPlayerCount(scenario, playerCount) {
  const count = Math.max(scenario.minPlayers || 1, Number(playerCount) || scenario.standardRoles.length)

  if (scenario.recommendedRolesByCount?.[count]) {
    return [...scenario.recommendedRolesByCount[count]]
  }

  if (scenario.recommendedRolesByCount) {
    const recommendedCounts = Object.keys(scenario.recommendedRolesByCount)
      .map(Number)
      .sort((a, b) => a - b)
    const nearestCount = recommendedCounts.filter((recommendedCount) => recommendedCount <= count).pop()

    if (nearestCount) {
      return [...scenario.recommendedRolesByCount[nearestCount]]
    }
  }

  return scenario.standardRoles.slice(0, count)
}

export function getRoleSide(scenario, roleName) {
  const scenarioDetails = scenario?.roleDetails ? scenario : getScenarioById(scenario?.id)
  const role = scenarioDetails?.roleDetails?.find((roleDetail) => roleDetail.name === roleName)
  return role?.side || role?.team || null
}

export function summarizeRoles(roles) {
  const counts = roles.reduce((result, role) => {
    result[role] = (result[role] || 0) + 1
    return result
  }, {})

  return Object.entries(counts).map(([name, count]) => ({ name, count }))
}

export function shuffle(items) {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

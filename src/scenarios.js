export const SCENARIOS = [
  {
    id: 'custom',
    name: 'Custom',
    description: 'Organizer-controlled setup. Add every role manually.',
    minPlayers: 1,
    standardRoles: [],
    recommendedRolesByCount: {},
    roleDetails: [],
    winConditions: [],
    investigationNotes: []
  },
  {
    id: 'detective',
    name: 'Detective / بازپرس',
    description: 'Gorgine بازپرس setup for 10 to 15 players.',
    minPlayers: 10,
    standardRoles: [
      'Mafia Boss / رئیس مافیا',
      'Nato / ناتو',
      'Shiad / شیاد',
      'Detective / کارآگاه',
      'Doctor / پزشک',
      'Investigator / محقق',
      'Armored / رویین‌تن',
      'Interrogator / بازپرس',
      'Simple Citizen / شهروند ساده',
      'Simple Citizen / شهروند ساده'
    ],
    recommendedRolesByCount: {
      10: [
        'Mafia Boss / رئیس مافیا',
        'Nato / ناتو',
        'Shiad / شیاد',
        'Detective / کارآگاه',
        'Doctor / پزشک',
        'Investigator / محقق',
        'Armored / رویین‌تن',
        'Interrogator / بازپرس',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده'
      ],
      11: [
        'Mafia Boss / رئیس مافیا',
        'Nato / ناتو',
        'Shiad / شیاد',
        'Detective / کارآگاه',
        'Doctor / پزشک',
        'Investigator / محقق',
        'Armored / رویین‌تن',
        'Interrogator / بازپرس',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده'
      ],
      12: [
        'Mafia Boss / رئیس مافیا',
        'Nato / ناتو',
        'Shiad / شیاد',
        'Detective / کارآگاه',
        'Doctor / پزشک',
        'Investigator / محقق',
        'Armored / رویین‌تن',
        'Interrogator / بازپرس',
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده'
      ],
      13: [
        'Mafia Boss / رئیس مافیا',
        'Nato / ناتو',
        'Shiad / شیاد',
        'Detective / کارآگاه',
        'Doctor / پزشک',
        'Investigator / محقق',
        'Armored / رویین‌تن',
        'Interrogator / بازپرس',
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده'
      ],
      14: [
        'Mafia Boss / رئیس مافیا',
        'Nato / ناتو',
        'Shiad / شیاد',
        'Detective / کارآگاه',
        'Doctor / پزشک',
        'Investigator / محقق',
        'Armored / رویین‌تن',
        'Interrogator / بازپرس',
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده'
      ],
      15: [
        'Mafia Boss / رئیس مافیا',
        'Nato / ناتو',
        'Shiad / شیاد',
        'Detective / کارآگاه',
        'Doctor / پزشک',
        'Investigator / محقق',
        'Armored / رویین‌تن',
        'Interrogator / بازپرس',
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده',
        'Simple Citizen / شهروند ساده'
      ]
    },
    roleDetails: [
      {
        name: 'Mafia Boss / رئیس مافیا',
        side: 'Mafia',
        ability: 'Controls the night kill. The Detective gets a negative result on him.'
      },
      {
        name: 'Nato / ناتو',
        side: 'Mafia',
        ability: 'Once can guess a Town special role and eliminate them if correct.'
      },
      {
        name: 'Shiad / شیاد',
        side: 'Mafia',
        ability: 'Tries to hit Detective; if correct, the Detective gets false negatives.'
      },
      {
        name: 'Detective / کارآگاه',
        side: 'Town',
        ability: 'Checks one player each night.'
      },
      {
        name: 'Doctor / پزشک',
        side: 'Town',
        ability: 'Saves one player each night.'
      },
      {
        name: 'Investigator / محقق',
        side: 'Town',
        ability: 'Links to a player; if Investigator dies and the linked player is Nato or Shiad, they die too.'
      },
      {
        name: 'Armored / رویین‌تن',
        side: 'Town',
        ability: 'Cannot be killed by the Mafia night shot.'
      },
      {
        name: 'Interrogator / بازپرس',
        side: 'Town',
        ability: 'Once per game brings 2 players to defense; may force a vote between them.'
      },
      {
        name: 'Sniper / تک‌تیرانداز',
        side: 'Town',
        ability: 'Added in 12/13/15-player versions; one shot.'
      },
      {
        name: 'Simple Mafia / مافیا ساده',
        side: 'Mafia',
        ability: 'Basic Mafia member with no extra ability.'
      },
      {
        name: 'Simple Citizen / شهروند ساده',
        side: 'Town',
        ability: 'No night ability.'
      }
    ],
    winConditions: [],
    investigationNotes: []
  },
  {
    id: 'godfather',
    name: 'Godfather',
    description: 'Official Gorgine Godfather: Nostradamus setup for 11 to 15 players.',
    minPlayers: 11,
    standardRoles: [
      'Godfather',
      'Matador',
      'Saul Goodman',
      'Nostradamus',
      'Doctor Watson',
      'Leon the Professional',
      'Citizen Kane',
      'Constantine',
      'Simple Citizen',
      'Simple Citizen',
      'Simple Citizen'
    ],
    recommendedRolesByCount: {
      11: [
        'Godfather',
        'Matador',
        'Saul Goodman',
        'Nostradamus',
        'Doctor Watson',
        'Leon the Professional',
        'Citizen Kane',
        'Constantine',
        'Simple Citizen',
        'Simple Citizen',
        'Simple Citizen'
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
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen',
        'Simple Citizen'
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
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen',
        'Simple Citizen',
        'Simple Citizen'
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
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen',
        'Simple Citizen',
        'Simple Citizen',
        'Simple Citizen'
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
        'Sniper / تک‌تیرانداز',
        'Simple Mafia / مافیا ساده',
        'Simple Mafia / مافیا ساده',
        'Simple Citizen',
        'Simple Citizen',
        'Simple Citizen',
        'Simple Citizen'
      ]
    },
    roleDetails: [
      {
        name: 'Godfather',
        side: 'Mafia',
        ability:
          "Mafia leader. Has 1 vest. Can either shoot at night or use Sixth Sense to guess a player's exact role. If correct, that player dies regardless of Doctor save or vest."
      },
      {
        name: 'Matador',
        side: 'Mafia',
        ability: 'Blocks one player\'s ability for the night. Cannot target the same player on consecutive nights.'
      },
      {
        name: 'Saul Goodman',
        side: 'Mafia',
        ability: 'Becomes active after Mafia loses a teammate. Can perform recruitment or purchase actions instead of a normal Mafia attack.'
      },
      {
        name: 'Nostradamus',
        side: 'Independent',
        ability:
          'During introduction night chooses 3 players. Moderator tells him how many Mafia are among them, then he chooses whether to side with Mafia or Citizens. Wins with the side he chooses.'
      },
      {
        name: 'Doctor Watson',
        side: 'Citizen',
        ability: 'Main protective role. Can save players from night kills.'
      },
      {
        name: 'Leon the Professional',
        side: 'Citizen',
        ability: "Town's shooter. Has a night shot and must use it carefully."
      },
      {
        name: 'Citizen Kane',
        side: 'Citizen',
        ability: 'Information-gathering citizen role.'
      },
      {
        name: 'Constantine',
        side: 'Citizen',
        ability: 'Support / information citizen role.'
      },
      {
        name: 'Simple Citizen',
        side: 'Citizen',
        ability: 'No special ability. Relies on discussion and voting.'
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

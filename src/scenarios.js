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
      { name: 'Mafia Boss / رئیس مافیا', count: 1 },
      { name: 'Nato / ناتو', count: 1 },
      { name: 'Shiad / شیاد', count: 1 },
      { name: 'Detective / کارآگاه', count: 1 },
      { name: 'Doctor / پزشک', count: 1 },
      { name: 'Investigator / محقق', count: 1 },
      { name: 'Armored / رویین‌تن', count: 1 },
      { name: 'Interrogator / بازپرس', count: 1 },
      { name: 'Simple Citizen / شهروند ساده', count: 1 },
      { name: 'Sniper / تک‌تیرانداز', count: 1 }
    ],
    recommendedRolesByCount: {
      10: [
        { name: 'Mafia Boss / رئیس مافیا', count: 1 },
        { name: 'Nato / ناتو', count: 1 },
        { name: 'Shiad / شیاد', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Doctor / پزشک', count: 1 },
        { name: 'Investigator / محقق', count: 1 },
        { name: 'Armored / رویین‌تن', count: 1 },
        { name: 'Interrogator / بازپرس', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 }
      ],
      11: [
        { name: 'Mafia Boss / رئیس مافیا', count: 1 },
        { name: 'Nato / ناتو', count: 1 },
        { name: 'Shiad / شیاد', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Doctor / پزشک', count: 1 },
        { name: 'Investigator / محقق', count: 1 },
        { name: 'Armored / رویین‌تن', count: 1 },
        { name: 'Interrogator / بازپرس', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 2 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 }
      ],
      12: [
        { name: 'Mafia Boss / رئیس مافیا', count: 1 },
        { name: 'Nato / ناتو', count: 1 },
        { name: 'Shiad / شیاد', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Doctor / پزشک', count: 1 },
        { name: 'Investigator / محقق', count: 1 },
        { name: 'Armored / رویین‌تن', count: 1 },
        { name: 'Interrogator / بازپرس', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 2 }
      ],
      13: [
        { name: 'Mafia Boss / رئیس مافیا', count: 1 },
        { name: 'Nato / ناتو', count: 1 },
        { name: 'Shiad / شیاد', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Doctor / پزشک', count: 1 },
        { name: 'Investigator / محقق', count: 1 },
        { name: 'Armored / رویین‌تن', count: 1 },
        { name: 'Interrogator / بازپرس', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 3 }
      ],
      14: [
        { name: 'Mafia Boss / رئیس مافیا', count: 1 },
        { name: 'Nato / ناتو', count: 1 },
        { name: 'Shiad / شیاد', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Doctor / پزشک', count: 1 },
        { name: 'Investigator / محقق', count: 1 },
        { name: 'Armored / رویین‌تن', count: 1 },
        { name: 'Interrogator / بازپرس', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 4 }
      ],
      15: [
        { name: 'Mafia Boss / رئیس مافیا', count: 1 },
        { name: 'Nato / ناتو', count: 1 },
        { name: 'Shiad / شیاد', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Doctor / پزشک', count: 1 },
        { name: 'Investigator / محقق', count: 1 },
        { name: 'Armored / رویین‌تن', count: 1 },
        { name: 'Interrogator / بازپرس', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 2 },
        { name: 'Simple Citizen / شهروند ساده', count: 4 }
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
    id: 'saghi',
    name: 'Saghi / ساقی',
    description: 'Custom setup with Saghi core roles for 10 players.',
    minPlayers: 10,
    standardRoles: [
      { name: 'Saghi / ساقی', count: 1 },
      { name: 'Sacrificer / فدایی', count: 1 },
      { name: 'Doctor / دکتر', count: 1 },
      { name: 'Detective / کارآگاه', count: 1 },
      { name: 'Sniper / اسنایپر', count: 1 },
      { name: 'Armored / زره پوش', count: 1 },
      { name: 'Terrorist / تروریست', count: 1 },
      { name: 'Negotiator / مذاکره کننده', count: 1 },
      { name: 'Godfather / گادفادر', count: 1 },
      { name: 'Simple Citizen / شهروند ساده', count: 1 }
    ],
    recommendedRolesByCount: {
      10: [
        { name: 'Saghi / ساقی', count: 1 },
        { name: 'Sacrificer / فدایی', count: 1 },
        { name: 'Doctor / دکتر', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Sniper / اسنایپر', count: 1 },
        { name: 'Armored / زره پوش', count: 1 },
        { name: 'Terrorist / تروریست', count: 1 },
        { name: 'Negotiator / مذاکره کننده', count: 1 },
        { name: 'Godfather / گادفادر', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 1 }
      ],
      11: [
        { name: 'Saghi / ساقی', count: 1 },
        { name: 'Sacrificer / فدایی', count: 1 },
        { name: 'Doctor / دکتر', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Sniper / اسنایپر', count: 1 },
        { name: 'Armored / زره پوش', count: 1 },
        { name: 'Terrorist / تروریست', count: 1 },
        { name: 'Negotiator / مذاکره کننده', count: 1 },
        { name: 'Godfather / گادفادر', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 2 }
      ],
      12: [
        { name: 'Saghi / ساقی', count: 1 },
        { name: 'Sacrificer / فدایی', count: 1 },
        { name: 'Doctor / دکتر', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Judge / قاضی', count: 1 },
        { name: 'Sniper / اسنایپر', count: 1 },
        { name: 'Armored / زره پوش', count: 1 },
        { name: 'Terrorist / تروریست', count: 1 },
        { name: 'Negotiator / مذاکره کننده', count: 1 },
        { name: 'Godfather / گادفادر', count: 1 },
        { name: 'Silencer / ناتاشا', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 1 }
      ],
      13: [
        { name: 'Saghi / ساقی', count: 1 },
        { name: 'Sacrificer / فدایی', count: 1 },
        { name: 'Doctor / دکتر', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Judge / قاضی', count: 1 },
        { name: 'Sniper / اسنایپر', count: 1 },
        { name: 'Armored / زره پوش', count: 1 },
        { name: 'Terrorist / تروریست', count: 1 },
        { name: 'Negotiator / مذاکره کننده', count: 1 },
        { name: 'Godfather / گادفادر', count: 1 },
        { name: 'Silencer / ناتاشا', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 2 }
      ],
      14: [
        { name: 'Saghi / ساقی', count: 1 },
        { name: 'Sacrificer / فدایی', count: 1 },
        { name: 'Doctor / دکتر', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Judge / قاضی', count: 1 },
        { name: 'Sniper / اسنایپر', count: 1 },
        { name: 'Armored / زره پوش', count: 1 },
        { name: 'Terrorist / تروریست', count: 1 },
        { name: 'Negotiator / مذاکره کننده', count: 1 },
        { name: 'Godfather / گادفادر', count: 1 },
        { name: 'Silencer / ناتاشا', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 3 }
      ],
      15: [
        { name: 'Saghi / ساقی', count: 1 },
        { name: 'Sacrificer / فدایی', count: 1 },
        { name: 'Doctor / دکتر', count: 1 },
        { name: 'Detective / کارآگاه', count: 1 },
        { name: 'Judge / قاضی', count: 1 },
        { name: 'Sniper / اسنایپر', count: 1 },
        { name: 'Armored / زره پوش', count: 1 },
        { name: 'Terrorist / تروریست', count: 1 },
        { name: 'Negotiator / مذاکره کننده', count: 1 },
        { name: 'Godfather / گادفادر', count: 1 },
        { name: 'Silencer / ناتاشا', count: 1 },
        { name: 'Basic Mafia / مافیا ساده', count: 1 },
        { name: 'Simple Citizen / شهروند ساده', count: 3 }
      ]
    },
    roleDetails: [
      {
        name: 'Saghi / ساقی',
        side: 'Citizen',
        ability: 'Affects one target role ability and makes that player drunk.'
      },
      {
        name: 'Sacrificer / فدایی',
        side: 'Citizen',
        ability: 'Can eliminate another player together with themself.'
      },
      {
        name: 'Doctor / دکتر',
        side: 'Citizen',
        ability: 'Can protect one player each night.'
      },
      {
        name: 'Detective / کارآگاه',
        side: 'Citizen',
        ability: 'Checks one player each night.'
      },
      {
        name: 'Sniper / اسنایپر',
        side: 'Citizen',
        ability: 'Has one shot during the game.'
      },
      {
        name: 'Armored / زره پوش',
        side: 'Citizen',
        ability: 'Has defensive protection against a night attack.'
      },
      {
        name: 'Terrorist / تروریست',
        side: 'Mafia',
        ability: 'If eliminated by vote, can take one other player down with themself.'
      },
      {
        name: 'Negotiator / مذاکره کننده',
        side: 'Mafia',
        ability: 'When a mafia teammate is eliminated (not shot), can recruit from Armored or Simple Citizen.'
      },
      {
        name: 'Godfather / گادفادر',
        side: 'Mafia',
        ability: 'Mafia leader role.'
      },
      {
        name: 'Silencer / ناتاشا',
        side: 'Mafia',
        ability: 'Mafia role that can silence a player for the next day phase.'
      },
      {
        name: 'Basic Mafia / مافیا ساده',
        side: 'Mafia',
        ability: 'Basic mafia member with no extra ability.'
      },
      {
        name: 'Judge / قاضی',
        side: 'Citizen',
        ability: 'Can decline an elimination voting.'
      },
      {
        name: 'Simple Citizen / شهروند ساده',
        side: 'Citizen',
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
      { name: 'Godfather', count: 1 },
      { name: 'Matador', count: 1 },
      { name: 'Saul Goodman', count: 1 },
      { name: 'Nostradamus', count: 1 },
      { name: 'Doctor Watson', count: 1 },
      { name: 'Leon the Professional', count: 1 },
      { name: 'Citizen Kane', count: 1 },
      { name: 'Constantine', count: 1 },
      { name: 'Simple Citizen', count: 3 }
    ],
    recommendedRolesByCount: {
      11: [
        { name: 'Godfather', count: 1 },
        { name: 'Matador', count: 1 },
        { name: 'Saul Goodman', count: 1 },
        { name: 'Nostradamus', count: 1 },
        { name: 'Doctor Watson', count: 1 },
        { name: 'Leon the Professional', count: 1 },
        { name: 'Citizen Kane', count: 1 },
        { name: 'Constantine', count: 1 },
        { name: 'Simple Citizen', count: 3 }
      ],
      12: [
        { name: 'Godfather', count: 1 },
        { name: 'Matador', count: 1 },
        { name: 'Saul Goodman', count: 1 },
        { name: 'Nostradamus', count: 1 },
        { name: 'Doctor Watson', count: 1 },
        { name: 'Leon the Professional', count: 1 },
        { name: 'Citizen Kane', count: 1 },
        { name: 'Constantine', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 1 },
        { name: 'Simple Citizen', count: 2 }
      ],
      13: [
        { name: 'Godfather', count: 1 },
        { name: 'Matador', count: 1 },
        { name: 'Saul Goodman', count: 1 },
        { name: 'Nostradamus', count: 1 },
        { name: 'Doctor Watson', count: 1 },
        { name: 'Leon the Professional', count: 1 },
        { name: 'Citizen Kane', count: 1 },
        { name: 'Constantine', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 1 },
        { name: 'Simple Citizen', count: 3 }
      ],
      14: [
        { name: 'Godfather', count: 1 },
        { name: 'Matador', count: 1 },
        { name: 'Saul Goodman', count: 1 },
        { name: 'Nostradamus', count: 1 },
        { name: 'Doctor Watson', count: 1 },
        { name: 'Leon the Professional', count: 1 },
        { name: 'Citizen Kane', count: 1 },
        { name: 'Constantine', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 1 },
        { name: 'Simple Citizen', count: 4 }
      ],
      15: [
        { name: 'Godfather', count: 1 },
        { name: 'Matador', count: 1 },
        { name: 'Saul Goodman', count: 1 },
        { name: 'Nostradamus', count: 1 },
        { name: 'Doctor Watson', count: 1 },
        { name: 'Leon the Professional', count: 1 },
        { name: 'Citizen Kane', count: 1 },
        { name: 'Constantine', count: 1 },
        { name: 'Sniper / تک‌تیرانداز', count: 1 },
        { name: 'Simple Mafia / مافیا ساده', count: 2 },
        { name: 'Simple Citizen', count: 4 }
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
      },
      {
        name: 'Simple Mafia / مافیا ساده',
        side: 'Mafia',
        ability: 'Basic Mafia member with no extra ability.'
      },
      {
        name: 'Sniper / تک‌تیرانداز',
        side: 'Citizen',
        ability: 'One-shot citizen eliminator role.'
      }
    ],
    winConditions: [],
    investigationNotes: []
  }
]

export function getScenarioById(id) {
  return SCENARIOS.find((scenario) => scenario.id === id) || SCENARIOS[0]
}

function normalizeRoleEntries(roles = []) {
  if (!Array.isArray(roles)) return []

  if (roles.every((role) => typeof role === 'string')) {
    const counts = roles.reduce((result, roleName) => {
      if (!roleName) return result
      result[roleName] = (result[roleName] || 0) + 1
      return result
    }, {})
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }

  return roles
    .map((role) => ({
      name: typeof role?.name === 'string' ? role.name.trim() : '',
      count: Math.max(1, Number(role?.count) || 1)
    }))
    .filter((role) => Boolean(role.name))
}

function expandRoleEntries(entries = []) {
  return normalizeRoleEntries(entries).flatMap((entry) =>
    Array.from({ length: entry.count }, () => entry.name)
  )
}

function resolveRecommendedEntries(scenario, playerCount) {
  const recommended = scenario?.recommendedRolesByCount || {}

  if (recommended[playerCount]) {
    return normalizeRoleEntries(recommended[playerCount])
  }

  const recommendedCounts = Object.keys(recommended)
    .map(Number)
    .sort((a, b) => a - b)
  const nearestCount = recommendedCounts.filter((count) => count <= playerCount).pop()

  if (nearestCount) {
    return normalizeRoleEntries(recommended[nearestCount])
  }

  return normalizeRoleEntries(scenario?.standardRoles)
}

export function getRoleEntriesForPlayerCount(scenario, playerCount) {
  const baseCount = expandRoleEntries(scenario?.standardRoles).length || scenario?.minPlayers || 1
  const normalizedCount = Math.max(scenario?.minPlayers || 1, Number(playerCount) || baseCount)

  return resolveRecommendedEntries(scenario, normalizedCount)
}

export function getStandardPlayerCount(scenario) {
  return expandRoleEntries(scenario?.standardRoles).length
}

export function getRolesForPlayerCount(scenario, playerCount) {
  const entries = getRoleEntriesForPlayerCount(scenario, playerCount)
  return expandRoleEntries(entries)
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

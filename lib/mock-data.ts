import seedrandom from "seedrandom"

export interface Ambassador {
  id: string
  rank: number
  name: string
  handle: string
  wallet: string
  country: string
  invites: number
  bonus_multiplier: number
  score: number
}

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "India",
  "Mexico",
  "Singapore",
  "UAE",
  "South Korea",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Norway",
  "Spain",
  "Italy",
  "Portugal",
  "Poland",
  "Turkey",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Indonesia",
  "Malaysia",
  "Hong Kong",
  "Taiwan",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
]

const firstNames = [
  "Alex",
  "Jordan",
  "Casey",
  "Morgan",
  "Riley",
  "Taylor",
  "Avery",
  "Quinn",
  "Blake",
  "Drew",
  "Cameron",
  "Dakota",
  "Skyler",
  "River",
  "Phoenix",
  "Sage",
  "Storm",
  "Raven",
  "Kai",
  "Ash",
]

const lastNames = [
  "Chen",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
]

export function generateMockAmbassadors(): Ambassador[] {
  const rng = seedrandom("42")
  const ambassadors: Ambassador[] = []

  for (let i = 0; i < 260; i++) {
    const invites = Math.floor(rng() * 500) + 10
    const bonus_multiplier = Math.round((rng() * 2 + 0.5) * 100) / 100

    const score = Math.round(invites * 10 + bonus_multiplier * 100)

    const firstName = firstNames[Math.floor(rng() * firstNames.length)]
    const lastName = lastNames[Math.floor(rng() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const handle = `@${firstName.toLowerCase()}${Math.floor(rng() * 1000)}`
    const wallet = `0x${Math.floor(rng() * 0xffffffff)
      .toString(16)
      .padStart(8, "0")}...${Math.floor(rng() * 0xffff)
      .toString(16)
      .padStart(4, "0")}`

    ambassadors.push({
      id: `amb-${i + 1}`,
      rank: i + 1,
      name,
      handle,
      wallet,
      country: countries[Math.floor(rng() * countries.length)],
      invites,
      bonus_multiplier,
      score,
    })
  }

  // Sort by score descending and update ranks
  ambassadors.sort((a, b) => b.score - a.score)
  ambassadors.forEach((amb, idx) => {
    amb.rank = idx + 1
  })

  return ambassadors
}

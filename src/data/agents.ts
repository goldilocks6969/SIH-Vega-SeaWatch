export type AgentId =
  | 'planner'
  | 'fishing'
  | 'ocean'
  | 'weather'
  | 'safety'
  | 'geo'
  | 'evidence'

export type AgentStatus = 'idle' | 'working' | 'complete' | 'attention'

export type AgentRole = {
  id: AgentId
  name: string
  specialty: string
  description: string
  worksWith: readonly string[]
  uses: readonly string[]
}

export const AGENTS: readonly AgentRole[] = [
  {
    id: 'planner',
    name: 'Planner',
    specialty: 'Question planning',
    description: 'Plans which expertise SeaWatch needs.',
    worksWith: ['Ocean', 'Weather', 'Safety'],
    uses: ['Question context', 'Selected area'],
  },
  {
    id: 'fishing',
    name: 'Fishing',
    specialty: 'Fishing opportunity',
    description: 'Interprets fishing opportunity and suitability.',
    worksWith: ['Ocean', 'Safety', 'Evidence'],
    uses: ['PFZ context', 'Fishing conditions'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    specialty: 'Marine conditions',
    description: 'Interprets marine conditions.',
    worksWith: ['Weather', 'Safety', 'Evidence'],
    uses: ['SST', 'Chlorophyll', 'Waves', 'Tides'],
  },
  {
    id: 'weather',
    name: 'Weather',
    specialty: 'Atmospheric conditions',
    description: 'Interprets wind, rain and storms.',
    worksWith: ['Ocean', 'Safety', 'Evidence'],
    uses: ['Wind', 'Rain', 'Storm context'],
  },
  {
    id: 'safety',
    name: 'Safety',
    specialty: 'Operational risk',
    description: 'Reviews combined operational risk.',
    worksWith: ['Ocean', 'Weather', 'Geo'],
    uses: ['Hazards', 'Restrictions', 'Conditions'],
  },
  {
    id: 'geo',
    name: 'Geo',
    specialty: 'Spatial context',
    description: 'Handles location, boundaries and distance.',
    worksWith: ['Planner', 'Safety', 'Evidence'],
    uses: ['Location', 'Boundaries', 'Routes'],
  },
  {
    id: 'evidence',
    name: 'Evidence',
    specialty: 'Source confidence',
    description: 'Checks sources, freshness and confidence.',
    worksWith: ['Planner', 'Ocean', 'Weather'],
    uses: ['Sources', 'Freshness', 'Agreement'],
  },
] as const

export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  idle: 'Ready',
  working: 'Working',
  complete: 'Complete',
  attention: 'Needs attention',
}

export function isAgentId(value: string | null): value is AgentId {
  return AGENTS.some((agent) => agent.id === value)
}

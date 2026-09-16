import type { ConversationScenario } from './conversationScenarios'

export const DISASTER_SOURCES = [
  { name: 'Cyclone advisory', freshness: 'Mock · updated 8 min ago' },
  { name: 'Marine weather', freshness: 'Mock · updated 6 min ago' },
  { name: 'Wave forecast', freshness: 'Mock · updated 7 min ago' },
  { name: 'Coastal warning', freshness: 'Mock · updated 11 min ago' },
  { name: 'Vessel positions', freshness: 'Mock · current positions' },
  { name: 'Geospatial boundary', freshness: 'Mock · reference layer' },
] as const

export const AFFECTED_VESSEL_IDS = ['fv-neeraj', 'samudra-04'] as const

const DISASTER_AGENTS = ['planner', 'weather', 'ocean', 'geo', 'safety', 'evidence'] as const

const DISASTER_ACTIVITY = {
  planner: 'Understanding affected area',
  weather: 'Projecting track',
  ocean: 'Assessing marine impact',
  geo: 'Finding exposure',
  safety: 'Evaluating consequence',
  evidence: 'Checking confidence',
} as const

export const DISASTER_ASSESSMENT_SCENARIO: ConversationScenario = {
  id: 'disaster-assessment',
  intent: 'DISASTER_ASSESSMENT',
  visualization: 'disaster',
  answer: {
    conclusion: 'Prepare for deteriorating marine conditions later today.',
    supporting:
      'Direct cyclone impact on Kochi remains uncertain, but stronger offshore winds and waves may affect coastal and vessel operations. Review exposed vessels and monitor the next forecast update.',
    metadata: '6 mock sources · updated 8 min ago',
  },
  sources: DISASTER_SOURCES,
  relevantAgents: DISASTER_AGENTS,
  primaryAgent: 'weather',
  pace: 'disaster',
  decisionCue: 'Decision window · review small-vessel departures before 2 PM',
  actionLabel: 'Review affected vessels',
  activityLabels: DISASTER_ACTIVITY,
  suggestions: ['Why before 2 PM?', "What's changed?"],
}

export const DISASTER_WHY_SCENARIO: ConversationScenario = {
  id: 'disaster-why',
  intent: 'DISASTER_WHY',
  visualization: 'disaster-why',
  answer: {
    conclusion: 'The marine influence reaches operating waters after 2 PM.',
    supporting:
      'The projected track brings stronger offshore winds and 2.4–3.1 m waves toward these routes through the afternoon, while uncertainty increases beyond 12 hours.',
    metadata: '6 mock sources · updated 8 min ago',
  },
  sources: DISASTER_SOURCES,
  relevantAgents: ['weather', 'ocean', 'geo', 'safety', 'evidence'],
  primaryAgent: 'safety',
  pace: 'follow-up',
  activityLabels: DISASTER_ACTIVITY,
  suggestions: ['Which vessels are exposed?', 'What should we watch next?'],
}

export const AFFECTED_VESSELS_SCENARIO: ConversationScenario = {
  id: 'disaster-vessels',
  intent: 'AFFECTED_VESSELS',
  visualization: 'affected-vessels',
  answer: {
    conclusion: 'Review two vessels in the affected operating waters.',
    supporting:
      'FV Neeraj has higher waves developing ahead. Samudra 04 remains near the coastal influence; MV Malabar is outside the primary impact area.',
    metadata: '6 mock sources · updated 8 min ago',
  },
  sources: DISASTER_SOURCES,
  relevantAgents: ['ocean', 'weather', 'geo', 'safety', 'evidence'],
  primaryAgent: 'geo',
  pace: 'follow-up',
  activityLabels: DISASTER_ACTIVITY,
  suggestions: ['Why before 2 PM?', 'What should we watch next?'],
}

export const FORECAST_UPDATE_SCENARIO: ConversationScenario = {
  id: 'disaster-update',
  intent: 'FORECAST_UPDATE',
  visualization: 'forecast-update',
  answer: {
    conclusion: 'The stronger marine influence has shifted slightly east.',
    supporting:
      "The updated projection moves closer to Kochi's offshore operating waters, though the direct coastal track remains uncertain.",
    metadata: '6 mock sources · comparison snapshot',
  },
  sources: DISASTER_SOURCES,
  relevantAgents: ['weather', 'ocean', 'geo', 'safety', 'evidence'],
  primaryAgent: 'weather',
  pace: 'follow-up',
  activityLabels: DISASTER_ACTIVITY,
  suggestions: ['Which vessels are exposed?', 'What should we watch next?'],
}

export const DISASTER_WATCH_SCENARIO: ConversationScenario = {
  id: 'disaster-watch',
  intent: 'DISASTER_WATCH',
  visualization: 'disaster-watch',
  answer: {
    conclusion: 'Watch the next track update and offshore wave build-up.',
    supporting:
      "The largest uncertainty is the cyclone's position after 12 hours. A shift east would increase exposure along Kochi's operating waters.",
    metadata: '6 mock sources · updated 8 min ago',
  },
  sources: DISASTER_SOURCES,
  relevantAgents: ['weather', 'ocean', 'geo', 'safety', 'evidence'],
  primaryAgent: 'evidence',
  pace: 'follow-up',
  activityLabels: DISASTER_ACTIVITY,
  suggestions: ["What's changed?", 'Which vessels are exposed?'],
}

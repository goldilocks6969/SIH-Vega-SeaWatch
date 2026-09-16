import type { AgentId } from './agents'
import { DEMO_SCENARIO, type DemoAnswer, type DemoSource } from './demoScenario'
import { MALAYALAM_SAFETY_DEMO } from './localizedDemo'
import type { Vessel } from './vessels'

export type ConversationIntent =
  | 'FISHING'
  | 'CYCLONE'
  | 'MARINE_SAFETY'
  | 'AREA_ANALYSIS'
  | 'HIGH_WAVES'
  | 'VESSEL_CONTEXT'
  | 'GENERAL_MARINE'
  | 'WHY_FISHING_ZONE'
  | 'AFTER_NINE'
  | 'DISASTER_ASSESSMENT'
  | 'DISASTER_WHY'
  | 'AFFECTED_VESSELS'
  | 'FORECAST_UPDATE'
  | 'DISASTER_WATCH'
  | 'UNKNOWN'

export type ScenarioVisualization =
  | 'fishing'
  | 'why-fishing'
  | 'after-nine'
  | 'cyclone'
  | 'marine-safety'
  | 'area'
  | 'high-waves'
  | 'vessel'
  | 'general'
  | 'disaster'
  | 'disaster-why'
  | 'affected-vessels'
  | 'forecast-update'
  | 'disaster-watch'
  | 'none'

export type ScenarioPace = 'major' | 'disaster' | 'follow-up' | 'brief'

export type ConversationScenario = {
  id: string
  intent: ConversationIntent
  visualization: ScenarioVisualization
  answer: DemoAnswer
  sources: readonly DemoSource[]
  relevantAgents: readonly AgentId[]
  primaryAgent?: AgentId
  pace: ScenarioPace
  suggestions?: readonly string[]
  decisionCue?: string
  actionLabel?: string
  activityLabels?: Partial<Record<AgentId, string>>
}

const FIVE_SOURCES = [
  ...DEMO_SCENARIO.sources,
  { name: 'Coastal impact model', freshness: 'Updated 8 min ago' },
] as const

const SIX_SOURCES = [
  ...DEMO_SCENARIO.sources,
  { name: 'Vessel context', freshness: 'Current mock position' },
  { name: 'Route conditions', freshness: 'Updated 7 min ago' },
] as const

export const FISHING_SCENARIO: ConversationScenario = {
  id: 'fishing',
  intent: 'FISHING',
  visualization: 'fishing',
  answer: DEMO_SCENARIO.heroAnswer,
  sources: DEMO_SCENARIO.sources,
  relevantAgents: ['planner', 'fishing', 'ocean', 'weather', 'safety', 'evidence'],
  primaryAgent: 'fishing',
  pace: 'major',
  suggestions: ['Why this area?', 'What changes after 9 AM?'],
}

export const CYCLONE_SCENARIO: ConversationScenario = {
  id: 'cyclone',
  intent: 'CYCLONE',
  visualization: 'cyclone',
  answer: {
    conclusion: 'Low direct impact expected for Kochi currently.',
    supporting:
      'The system is tracking northwest, with its closest projected approach remaining well offshore. Coastal winds and waves may still strengthen later.',
    metadata: '5 sources · updated 8 min ago',
  },
  sources: FIVE_SOURCES,
  relevantAgents: ['planner', 'weather', 'ocean', 'safety', 'geo', 'evidence'],
  primaryAgent: 'geo',
  pace: 'major',
  suggestions: ['Show me high-wave areas', 'Is it safe to go out tomorrow morning?'],
}

export const MARINE_SAFETY_SCENARIO: ConversationScenario = {
  id: 'marine-safety',
  intent: 'MARINE_SAFETY',
  visualization: 'marine-safety',
  answer: {
    conclusion: 'Conditions are acceptable early, with caution.',
    supporting:
      'The better window is before 9:00 AM. Winds and waves strengthen later, so returning early is advisable.',
    metadata: '5 sources · updated 6 min ago',
  },
  sources: FIVE_SOURCES,
  relevantAgents: ['planner', 'weather', 'ocean', 'safety', 'geo', 'evidence'],
  primaryAgent: 'geo',
  pace: 'major',
  suggestions: ['What changes after 9 AM?', 'Show me high-wave areas'],
}

export const MALAYALAM_SAFETY_SCENARIO: ConversationScenario = {
  ...MARINE_SAFETY_SCENARIO,
  id: 'marine-safety-ml',
  answer: {
    conclusion: MALAYALAM_SAFETY_DEMO.conclusion,
    supporting: MALAYALAM_SAFETY_DEMO.supporting,
    metadata: MALAYALAM_SAFETY_DEMO.metadata,
  },
}

export const HIGH_WAVES_SCENARIO: ConversationScenario = {
  id: 'high-waves',
  intent: 'HIGH_WAVES',
  visualization: 'high-waves',
  answer: {
    conclusion: 'Higher waves develop farther offshore this afternoon.',
    supporting:
      'Conditions remain calmer closer to Kochi early, but the offshore zone becomes less favorable after 2 PM.',
    metadata: '5 sources · updated 7 min ago',
  },
  sources: FIVE_SOURCES,
  relevantAgents: ['planner', 'ocean', 'weather', 'safety', 'geo', 'evidence'],
  primaryAgent: 'ocean',
  pace: 'major',
  suggestions: ['Is it safe to go out tomorrow morning?', 'Where should I fish tomorrow morning?'],
}

export const AREA_SCENARIO: ConversationScenario = {
  id: 'area-analysis',
  intent: 'AREA_ANALYSIS',
  visualization: 'area',
  answer: {
    conclusion: 'Conditions here are generally favorable this morning.',
    supporting:
      'Winds are light and wave conditions remain moderate, with conditions becoming less favorable later.',
    metadata: '4 sources · updated 6 min ago',
  },
  sources: DEMO_SCENARIO.sources,
  relevantAgents: ['planner', 'ocean', 'weather', 'safety', 'geo', 'evidence'],
  primaryAgent: 'geo',
  pace: 'major',
  suggestions: ['What changes after 9 AM?', 'Show me high-wave areas'],
}

export const WHY_FISHING_SCENARIO: ConversationScenario = {
  id: 'why-fishing-zone',
  intent: 'WHY_FISHING_ZONE',
  visualization: 'why-fishing',
  answer: {
    conclusion: 'Several conditions align here.',
    supporting:
      'Productive water overlaps with moderate waves and lighter morning winds, while nearby areas become less favorable later.',
    metadata: '4 sources · updated 6 min ago',
  },
  sources: DEMO_SCENARIO.sources,
  relevantAgents: ['fishing', 'ocean', 'weather', 'evidence'],
  primaryAgent: 'fishing',
  pace: 'follow-up',
  suggestions: ['What changes after 9 AM?', 'Will this cyclone affect Kochi?'],
}

export const AFTER_NINE_SCENARIO: ConversationScenario = {
  id: 'after-nine',
  intent: 'AFTER_NINE',
  visualization: 'after-nine',
  answer: {
    conclusion: 'Winds begin strengthening after 9 AM.',
    supporting:
      'The fishing opportunity remains, but conditions become progressively less comfortable farther offshore.',
    metadata: '4 sources · updated 6 min ago',
  },
  sources: DEMO_SCENARIO.sources,
  relevantAgents: ['fishing', 'ocean', 'weather', 'safety', 'evidence'],
  primaryAgent: 'weather',
  pace: 'follow-up',
  suggestions: ['Why this area?', 'Is it safe to go out tomorrow morning?'],
}

export const GENERAL_MARINE_SCENARIO: ConversationScenario = {
  id: 'general-marine',
  intent: 'GENERAL_MARINE',
  visualization: 'general',
  answer: {
    conclusion: 'Marine conditions vary across the selected area.',
    supporting:
      'SeaWatch can compare waves, wind, weather systems, and coastal context using this deterministic demo.',
    metadata: '4 mock sources',
  },
  sources: DEMO_SCENARIO.sources,
  relevantAgents: ['planner', 'ocean', 'weather', 'geo', 'evidence'],
  primaryAgent: 'geo',
  pace: 'major',
  suggestions: ['Show me high-wave areas', 'Is it safe to go out tomorrow morning?'],
}

export const UNKNOWN_SCENARIO: ConversationScenario = {
  id: 'unknown',
  intent: 'UNKNOWN',
  visualization: 'none',
  answer: {
    conclusion: 'That is outside this SeaWatch demo.',
    supporting:
      'SeaWatch can currently explore fishing conditions, marine safety, waves, weather systems, vessels, and selected ocean areas.',
    metadata: 'Deterministic prototype',
  },
  sources: [],
  relevantAgents: [],
  pace: 'brief',
  suggestions: ['Where should I fish tomorrow morning?', 'Show me high-wave areas'],
}

export function createVesselScenario(vessel: Vessel): ConversationScenario {
  return {
    id: `vessel-${vessel.id}`,
    intent: 'VESSEL_CONTEXT',
    visualization: 'vessel',
    answer: {
      conclusion: `${vessel.name} is heading toward calmer water currently.`,
      supporting:
        'Conditions along its present heading remain moderate for the next few hours, with stronger winds farther west.',
      metadata: '6 mock sources · updated 7 min ago',
    },
    sources: SIX_SOURCES,
    relevantAgents: ['planner', 'ocean', 'weather', 'safety', 'geo', 'evidence'],
    primaryAgent: 'geo',
    pace: 'major',
    suggestions: ['Show me high-wave areas', 'Is it safe to go out tomorrow morning?'],
  }
}

export const RESTING_SUGGESTIONS = [
  'Where should I fish tomorrow morning?',
  'Is it safe to go out tomorrow morning?',
  'Show me high-wave areas',
] as const

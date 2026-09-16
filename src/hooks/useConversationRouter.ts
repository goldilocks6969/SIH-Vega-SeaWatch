import { useCallback } from 'react'
import {
  AFTER_NINE_SCENARIO,
  AREA_SCENARIO,
  CYCLONE_SCENARIO,
  FISHING_SCENARIO,
  GENERAL_MARINE_SCENARIO,
  HIGH_WAVES_SCENARIO,
  MALAYALAM_SAFETY_SCENARIO,
  MARINE_SAFETY_SCENARIO,
  UNKNOWN_SCENARIO,
  WHY_FISHING_SCENARIO,
  createVesselScenario,
  type ConversationScenario,
} from '../data/conversationScenarios'
import { MALAYALAM_SAFETY_DEMO } from '../data/localizedDemo'
import type { Vessel } from '../data/vessels'
import {
  AFFECTED_VESSELS_SCENARIO,
  DISASTER_ASSESSMENT_SCENARIO,
  DISASTER_WATCH_SCENARIO,
  DISASTER_WHY_SCENARIO,
  FORECAST_UPDATE_SCENARIO,
} from '../data/disasterScenarios'

export type ConversationObject =
  | { type: 'cyclone' }
  | { type: 'vessel'; vessel: Vessel }
  | { type: 'fishing-zone' }

export type ConversationContext = {
  inspectedObject: ConversationObject | null
  previousScenarioId: string | null
  hasSelectedArea: boolean
  hasRecommendation: boolean
  operationalView: boolean
}

function normalized(query: string) {
  return query
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function routeConversation(
  query: string,
  context: ConversationContext,
): ConversationScenario {
  const text = normalized(query)

  if (/assess.*coastal impact|coastal impact.*cyclone|what happens.*cyclone.*(?:moves|toward).*kochi/.test(text)) {
    return DISASTER_ASSESSMENT_SCENARIO
  }

  if (context.operationalView && (/^why$/.test(text) || /why.*before 2|why.*2 pm/.test(text))) {
    return DISASTER_WHY_SCENARIO
  }

  if (context.operationalView && /which vessels.*exposed|affected vessels|review.*vessels|vessels.*affected/.test(text)) {
    return AFFECTED_VESSELS_SCENARIO
  }

  if (context.operationalView && /what s changed|what has changed|forecast.*changed|latest projection/.test(text)) {
    return FORECAST_UPDATE_SCENARIO
  }

  if (context.operationalView && /what should we watch next|watch next|monitor next/.test(text)) {
    return DISASTER_WATCH_SCENARIO
  }

  if (context.operationalView && /will (?:this|the cyclone).*affect kochi|will.*affect kochi/.test(text)) {
    return DISASTER_ASSESSMENT_SCENARIO
  }

  if (query.includes('കടലിൽ') || query === MALAYALAM_SAFETY_DEMO.query) {
    return MALAYALAM_SAFETY_SCENARIO
  }

  if (/why (this|that) area|why here|why the fishing/.test(text)) {
    return context.hasRecommendation || context.previousScenarioId?.includes('fishing')
      ? WHY_FISHING_SCENARIO
      : GENERAL_MARINE_SCENARIO
  }

  if (/after 9|after nine|later in the morning|what changes later/.test(text)) {
    return context.hasRecommendation || context.previousScenarioId?.includes('fishing')
      ? AFTER_NINE_SCENARIO
      : MARINE_SAFETY_SCENARIO
  }

  if (/cyclone|storm system|weather system|affect kochi|affect it/.test(text)) {
    return CYCLONE_SCENARIO
  }

  if (/high wave|waves strongest|areas should i avoid|avoid.*area|rough sea/.test(text)) {
    return HIGH_WAVES_SCENARIO
  }

  if (/safe to go|go to sea|leave early|go out tomorrow|marine safety/.test(text)) {
    return MARINE_SAFETY_SCENARIO
  }

  if (/heading into|conditions.*vessel|conditions.*heading/.test(text)) {
    if (context.inspectedObject?.type === 'vessel') {
      return createVesselScenario(context.inspectedObject.vessel)
    }
    return UNKNOWN_SCENARIO
  }

  if (/fishing|where should i fish|where should i go fish/.test(text)) {
    return FISHING_SCENARIO
  }

  if (/analy[sz]e.*area|selected area|conditions here/.test(text) && context.hasSelectedArea) {
    return AREA_SCENARIO
  }

  if (/ocean|marine|wind|weather|waves|sea/.test(text)) {
    return GENERAL_MARINE_SCENARIO
  }

  return UNKNOWN_SCENARIO
}

export function useConversationRouter(context: ConversationContext) {
  return useCallback((query: string) => routeConversation(query, context), [context])
}

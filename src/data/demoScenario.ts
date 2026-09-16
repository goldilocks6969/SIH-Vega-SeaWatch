import type { AgentId } from './agents'
import type { GeoPoint } from './geography'

export const HERO_QUERY = 'Where should I go fishing tomorrow morning?'

export const HERO_TIMELINE = {
  accepted: 0,
  composerAcknowledged: 150,
  plannerWorking: 350,
  plannerToPrimary: 650,
  plannerToOcean: 950,
  plannerToWeather: 1250,
  primaryWorking: 1350,
  oceanWorking: 1650,
  weatherWorking: 1950,
  firstEvidence: 2100,
  environmentResolves: 2400,
  weatherToSafety: 2850,
  oceanToSafety: 3100,
  primaryComplete: 3550,
  safetyWorking: 3800,
  oceanComplete: 3850,
  weatherComplete: 4100,
  evidenceWorking: 4050,
  evidenceResolves: 4400,
  analyticalPeak: 4650,
  safetyComplete: 4850,
  receding: 5300,
  evidenceComplete: 5300,
  answerConclusion: 5850,
  answerSupport: 6010,
  answerMetadata: 6170,
  answered: 6420,
  dockCalm: 6700,
  collaborationDuration: 780,
} as const

export type DemoMode = 'hero' | 'area'

export type DemoAnswer = {
  conclusion: string
  supporting: string
  metadata: string
}

export type DemoSource = {
  name: string
  freshness: string
}

export type WindVector = {
  coordinates: GeoPoint
  heading: number
}

export const DEMO_SCENARIO = {
  query: HERO_QUERY,
  focusLocation: [75.1, 9.95] as GeoPoint,
  heroAnswer: {
    conclusion: 'Good conditions nearby tomorrow morning.',
    supporting:
      'Best window around 6:30–9:00 AM. Conditions weaken as winds build later.',
    metadata: '4 sources · updated 6 min ago',
  } satisfies DemoAnswer,
  areaAnswer: {
    conclusion: 'Conditions are generally favorable here this morning.',
    supporting: 'Light winds early, with more variability farther offshore later.',
    metadata: '4 sources · updated 6 min ago',
  } satisfies DemoAnswer,
  opportunityZone: [
    [74.43, 10.02],
    [74.58, 10.2],
    [74.82, 10.34],
    [75.12, 10.42],
    [75.43, 10.32],
    [75.68, 10.1],
    [75.62, 9.86],
    [75.4, 9.68],
    [75.08, 9.6],
    [74.77, 9.72],
    [74.55, 9.82],
  ] as readonly GeoPoint[],
  opportunityCore: [
    [74.76, 10.02],
    [74.9, 10.22],
    [75.14, 10.3],
    [75.38, 10.2],
    [75.49, 10.01],
    [75.32, 9.82],
    [75.04, 9.77],
    [74.82, 9.86],
  ] as readonly GeoPoint[],
  oceanConditionRegions: [
    [
      [73.92, 10.43],
      [74.35, 10.66],
      [74.98, 10.58],
      [75.25, 10.3],
      [74.98, 10.03],
      [74.28, 10.08],
    ],
    [
      [74.12, 9.65],
      [74.62, 9.88],
      [75.16, 9.76],
      [75.36, 9.42],
      [74.74, 9.25],
      [74.2, 9.35],
    ],
  ] as readonly (readonly GeoPoint[])[],
  cautionRegion: [
    [72.75, 10.28],
    [73.2, 10.55],
    [73.85, 10.48],
    [74.12, 10.15],
    [73.88, 9.84],
    [73.28, 9.72],
    [72.82, 9.9],
  ] as readonly GeoPoint[],
  windVectors: [
    { coordinates: [73.78, 10.58], heading: 72 },
    { coordinates: [74.24, 10.32], heading: 76 },
    { coordinates: [74.72, 10.5], heading: 69 },
    { coordinates: [75.16, 10.18], heading: 74 },
    { coordinates: [73.98, 9.9], heading: 80 },
    { coordinates: [74.48, 9.68], heading: 76 },
    { coordinates: [75.0, 9.5], heading: 70 },
  ] as readonly WindVector[],
  sources: [
    { name: 'Ocean conditions', freshness: 'Updated 6 min ago' },
    { name: 'Weather', freshness: 'Updated 4 min ago' },
    { name: 'Fishing advisory', freshness: 'Updated 12 min ago' },
    { name: 'Geographic constraints', freshness: 'Current' },
  ] as readonly DemoSource[],
} as const

export type CollaborationEvent = {
  id: string
  from: AgentId
  to: AgentId
}

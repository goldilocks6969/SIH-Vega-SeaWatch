import { useCallback, useEffect, useRef, useState } from 'react'
import type { AgentId, AgentStatus } from '../data/agents'
import type { ConversationScenario, ScenarioVisualization } from '../data/conversationScenarios'
import { HERO_TIMELINE, type CollaborationEvent, type DemoAnswer } from '../data/demoScenario'

export type OrchestrationPhase =
  | 'idle'
  | 'understanding'
  | 'gathering'
  | 'reviewing'
  | 'synthesizing'
  | 'answered'

export type EvidenceStage =
  | 'none'
  | 'base'
  | 'expanded'
  | 'safety'
  | 'peak'
  | 'receding'
  | 'final'

export type OrchestrationState = {
  runId: number
  scenarioId: string | null
  visualization: ScenarioVisualization | null
  phase: OrchestrationPhase
  submittedQuery: string
  composerAcknowledged: boolean
  agentStatuses: Record<AgentId, AgentStatus>
  relevantAgents: readonly AgentId[]
  activityLabels: Partial<Record<AgentId, string>>
  connections: readonly CollaborationEvent[]
  evidenceStage: EvidenceStage
  answer: DemoAnswer | null
  answerStep: 0 | 1 | 2 | 3
  statusMessage: string
}

const IDLE_AGENT_STATUSES: Record<AgentId, AgentStatus> = {
  planner: 'idle',
  fishing: 'idle',
  ocean: 'idle',
  weather: 'idle',
  safety: 'idle',
  geo: 'idle',
  evidence: 'idle',
}

const INITIAL_STATE: OrchestrationState = {
  runId: 0,
  scenarioId: null,
  visualization: null,
  phase: 'idle',
  submittedQuery: '',
  composerAcknowledged: false,
  agentStatuses: IDLE_AGENT_STATUSES,
  relevantAgents: [],
  activityLabels: {},
  connections: [],
  evidenceStage: 'none',
  answer: null,
  answerStep: 0,
  statusMessage: 'SeaWatch is ready for a question about the ocean.',
}

function getReducedMotionPreference() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(window.location.search).get('motion') === 'reduce'
  )
}

export function useDemoOrchestration() {
  const [state, setState] = useState<OrchestrationState>(INITIAL_STATE)
  const [reducedMotion, setReducedMotion] = useState(getReducedMotionPreference)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const runId = useRef(0)

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  const schedule = useCallback((delay: number, task: () => void) => {
    const timer = setTimeout(task, delay)
    timers.current.push(timer)
  }, [])

  const reset = useCallback(() => {
    clearTimers()
    runId.current += 1
    setState({ ...INITIAL_STATE, runId: runId.current })
  }, [clearTimers])

  const preview = useCallback((scenario: ConversationScenario, mode: 'peak' | 'final') => {
    clearTimers()
    runId.current += 1
    const isPeak = mode === 'peak'
    const relevant = new Set(scenario.relevantAgents)
    setState({
      ...INITIAL_STATE,
      runId: runId.current,
      scenarioId: scenario.id,
      visualization: scenario.visualization,
      phase: isPeak ? 'reviewing' : 'answered',
      submittedQuery: 'Assess coastal impact from this cyclone.',
      composerAcknowledged: true,
      agentStatuses: Object.fromEntries(
        Object.keys(IDLE_AGENT_STATUSES).map((agent) => [
          agent,
          isPeak && relevant.has(agent as AgentId)
            ? agent === 'planner'
              ? 'complete'
              : 'working'
            : 'idle',
        ]),
      ) as Record<AgentId, AgentStatus>,
      relevantAgents: scenario.relevantAgents,
      activityLabels: scenario.activityLabels ?? {},
      connections: [],
      evidenceStage: mode,
      answer: scenario.answer,
      answerStep: isPeak ? 0 : 3,
      statusMessage: isPeak ? 'Disaster impact analysis is at its analytical peak.' : scenario.answer.conclusion,
    })
  }, [clearTimers])

  const run = useCallback(
    (scenario: ConversationScenario, submittedQuery: string) => {
      clearTimers()
      runId.current += 1
      const currentRun = runId.current
      const relevant = new Set(scenario.relevantAgents)
      const primaryAgent = scenario.primaryAgent

      const updateStatuses = (changes: Partial<Record<AgentId, AgentStatus>>) => {
        const relevantChanges = Object.fromEntries(
          Object.entries(changes).filter(([agent]) => relevant.has(agent as AgentId)),
        ) as Partial<Record<AgentId, AgentStatus>>
        setState((current) => ({
          ...current,
          agentStatuses: { ...current.agentStatuses, ...relevantChanges },
        }))
      }

      const addConnection = (time: number, id: string, from: AgentId, to: AgentId) => {
        if (!relevant.has(from) || !relevant.has(to) || from === to) return
        schedule(time, () => {
          setState((current) => ({
            ...current,
            connections: [...current.connections, { id, from, to }],
          }))
        })
        schedule(time + HERO_TIMELINE.collaborationDuration, () => {
          setState((current) => ({
            ...current,
            connections: current.connections.filter((connection) => connection.id !== id),
          }))
        })
      }

      setState({
        ...INITIAL_STATE,
        runId: currentRun,
        scenarioId: scenario.id,
        visualization: scenario.visualization,
        phase: 'understanding',
        submittedQuery,
        relevantAgents: scenario.relevantAgents,
        activityLabels: scenario.activityLabels ?? {},
        answer: scenario.answer,
        statusMessage: 'SeaWatch is understanding the question.',
      })

      if (reducedMotion) {
        schedule(40, () =>
          setState((current) => ({
            ...current,
            composerAcknowledged: true,
            phase: 'reviewing',
            agentStatuses: Object.fromEntries(
              Object.keys(IDLE_AGENT_STATUSES).map((agent) => [
                agent,
                relevant.has(agent as AgentId) ? 'working' : 'idle',
              ]),
            ) as Record<AgentId, AgentStatus>,
            evidenceStage: scenario.visualization === 'none' ? 'none' : 'peak',
          })),
        )
        schedule(160, () =>
          setState((current) => ({
            ...current,
            phase: 'answered',
            agentStatuses: { ...IDLE_AGENT_STATUSES },
            evidenceStage: scenario.visualization === 'none' ? 'none' : 'final',
            answerStep: 3,
            statusMessage: scenario.answer.conclusion,
          })),
        )
        return
      }

      if (scenario.pace === 'brief') {
        schedule(100, () => setState((current) => ({ ...current, composerAcknowledged: true })))
        schedule(240, () => setState((current) => ({ ...current, answerStep: 1 })))
        schedule(400, () => setState((current) => ({ ...current, answerStep: 2 })))
        schedule(560, () => setState((current) => ({ ...current, answerStep: 3 })))
        schedule(820, () =>
          setState((current) => ({
            ...current,
            phase: 'answered',
            statusMessage: scenario.answer.conclusion,
          })),
        )
        return
      }

      if (scenario.pace === 'disaster') {
        schedule(150, () => setState((current) => ({ ...current, composerAcknowledged: true })))
        schedule(400, () => updateStatuses({ planner: 'working' }))

        addConnection(900, `${currentRun}-planner-weather`, 'planner', 'weather')
        schedule(1400, () =>
          setState((current) => ({
            ...current,
            phase: 'gathering',
            evidenceStage: 'base',
            statusMessage: 'Weather is projecting the cyclone track.',
          })),
        )
        schedule(1540, () => updateStatuses({ weather: 'working', planner: 'complete' }))

        addConnection(1700, `${currentRun}-weather-ocean`, 'weather', 'ocean')
        schedule(2200, () =>
          setState((current) => ({
            ...current,
            evidenceStage: 'expanded',
            statusMessage: 'Ocean conditions are being assessed along the projected track.',
          })),
        )
        schedule(2380, () => updateStatuses({ ocean: 'working' }))

        addConnection(2500, `${currentRun}-weather-geo`, 'weather', 'geo')
        schedule(3000, () =>
          setState((current) => ({
            ...current,
            evidenceStage: 'safety',
            statusMessage: 'Geo is resolving exposed coastline and operations.',
          })),
        )
        schedule(3180, () => updateStatuses({ geo: 'working' }))
        schedule(3220, () => updateStatuses({ weather: 'complete', ocean: 'complete' }))

        addConnection(3400, `${currentRun}-weather-safety`, 'weather', 'safety')
        addConnection(3650, `${currentRun}-ocean-safety`, 'ocean', 'safety')
        addConnection(3900, `${currentRun}-geo-safety`, 'geo', 'safety')
        schedule(4200, () =>
          setState((current) => ({
            ...current,
            phase: 'reviewing',
            statusMessage: 'Safety is evaluating the combined operational consequence.',
          })),
        )
        schedule(4400, () => updateStatuses({ safety: 'working', weather: 'complete', ocean: 'complete', geo: 'complete' }))
        addConnection(4620, `${currentRun}-safety-evidence`, 'safety', 'evidence')
        schedule(4700, () => updateStatuses({ evidence: 'working' }))
        schedule(5000, () =>
          setState((current) => ({
            ...current,
            evidenceStage: 'peak',
            agentStatuses: { ...current.agentStatuses, safety: 'complete' },
            statusMessage: 'Evidence is checking freshness and forecast uncertainty.',
          })),
        )

        schedule(6000, () =>
          setState((current) => ({
            ...current,
            phase: 'synthesizing',
            evidenceStage: 'receding',
            agentStatuses: { ...IDLE_AGENT_STATUSES },
            statusMessage: 'SeaWatch is preparing an operational recommendation.',
          })),
        )
        schedule(6380, () => setState((current) => ({ ...current, answerStep: 1 })))
        schedule(6540, () => setState((current) => ({ ...current, answerStep: 2 })))
        schedule(6700, () => setState((current) => ({ ...current, answerStep: 3 })))
        schedule(6950, () =>
          setState((current) => ({
            ...current,
            phase: 'answered',
            evidenceStage: 'final',
            statusMessage: scenario.answer.conclusion,
          })),
        )
        return
      }

      if (scenario.pace === 'follow-up') {
        const lead = primaryAgent ?? scenario.relevantAgents[0]
        schedule(120, () => setState((current) => ({ ...current, composerAcknowledged: true })))
        if (lead) schedule(250, () => updateStatuses({ [lead]: 'working' }))
        if (lead && relevant.has('ocean') && lead !== 'ocean') {
          addConnection(450, `${currentRun}-lead-ocean`, lead, 'ocean')
          schedule(1150, () => updateStatuses({ ocean: 'working' }))
        }
        if (lead && relevant.has('weather') && lead !== 'weather') {
          addConnection(850, `${currentRun}-lead-weather`, lead, 'weather')
          schedule(1550, () => updateStatuses({ weather: 'working' }))
        }
        if (relevant.has('safety')) {
          addConnection(1700, `${currentRun}-ocean-safety`, 'ocean', 'safety')
          schedule(2400, () => updateStatuses({ safety: 'working' }))
        }
        schedule(450, () =>
          setState((current) => ({ ...current, phase: 'gathering', evidenceStage: 'base' })),
        )
        schedule(1100, () => setState((current) => ({ ...current, evidenceStage: 'expanded' })))
        schedule(2200, () => {
          updateStatuses({ evidence: 'working' })
          setState((current) => ({
            ...current,
            phase: 'reviewing',
            evidenceStage: relevant.has('safety') ? 'safety' : 'expanded',
          }))
        })
        schedule(2500, () => setState((current) => ({ ...current, evidenceStage: 'peak' })))
        schedule(3400, () =>
          setState((current) => ({
            ...current,
            phase: 'synthesizing',
            evidenceStage: 'receding',
            agentStatuses: { ...IDLE_AGENT_STATUSES },
            statusMessage: 'SeaWatch is simplifying the evidence.',
          })),
        )
        schedule(3900, () => setState((current) => ({ ...current, answerStep: 1 })))
        schedule(4060, () => setState((current) => ({ ...current, answerStep: 2 })))
        schedule(4220, () => setState((current) => ({ ...current, answerStep: 3 })))
        schedule(4470, () =>
          setState((current) => ({
            ...current,
            phase: 'answered',
            evidenceStage: 'final',
            statusMessage: scenario.answer.conclusion,
          })),
        )
        return
      }

      schedule(HERO_TIMELINE.composerAcknowledged, () =>
        setState((current) => ({ ...current, composerAcknowledged: true })),
      )
      schedule(HERO_TIMELINE.plannerWorking, () => updateStatuses({ planner: 'working' }))

      if (primaryAgent) {
        addConnection(HERO_TIMELINE.plannerToPrimary, `${currentRun}-planner-primary`, 'planner', primaryAgent)
        schedule(HERO_TIMELINE.primaryWorking, () => updateStatuses({ [primaryAgent]: 'working' }))
      }
      if (relevant.has('ocean') && primaryAgent !== 'ocean') {
        addConnection(HERO_TIMELINE.plannerToOcean, `${currentRun}-planner-ocean`, 'planner', 'ocean')
        schedule(HERO_TIMELINE.oceanWorking, () => updateStatuses({ ocean: 'working' }))
      }
      if (relevant.has('weather') && primaryAgent !== 'weather') {
        addConnection(HERO_TIMELINE.plannerToWeather, `${currentRun}-planner-weather`, 'planner', 'weather')
        schedule(HERO_TIMELINE.weatherWorking, () => updateStatuses({ weather: 'working', planner: 'complete' }))
      }
      if (relevant.has('geo') && primaryAgent !== 'geo') {
        addConnection(1550, `${currentRun}-planner-geo`, 'planner', 'geo')
        schedule(2250, () => updateStatuses({ geo: 'working' }))
      }

      schedule(HERO_TIMELINE.firstEvidence, () =>
        setState((current) => ({ ...current, phase: 'gathering', evidenceStage: 'base' })),
      )
      schedule(HERO_TIMELINE.environmentResolves, () =>
        setState((current) => ({ ...current, evidenceStage: 'expanded' })),
      )
      addConnection(HERO_TIMELINE.weatherToSafety, `${currentRun}-weather-safety`, 'weather', 'safety')
      addConnection(HERO_TIMELINE.oceanToSafety, `${currentRun}-ocean-safety`, 'ocean', 'safety')
      schedule(HERO_TIMELINE.safetyWorking, () => {
        updateStatuses({ safety: 'working' })
        setState((current) => ({
          ...current,
          phase: 'reviewing',
          evidenceStage: 'safety',
          statusMessage: 'Safety and geographic context are being reviewed.',
        }))
      })
      schedule(HERO_TIMELINE.evidenceWorking, () => updateStatuses({ evidence: 'working' }))
      schedule(HERO_TIMELINE.evidenceResolves, () =>
        setState((current) => ({ ...current, evidenceStage: 'peak' })),
      )
      schedule(HERO_TIMELINE.primaryComplete, () => {
        if (primaryAgent) updateStatuses({ [primaryAgent]: 'complete' })
      })
      schedule(HERO_TIMELINE.oceanComplete, () => updateStatuses({ ocean: 'complete' }))
      schedule(HERO_TIMELINE.weatherComplete, () =>
        updateStatuses({ weather: 'complete', geo: 'complete', planner: 'complete' }),
      )
      schedule(HERO_TIMELINE.safetyComplete, () => updateStatuses({ safety: 'complete' }))
      schedule(HERO_TIMELINE.evidenceComplete, () => updateStatuses({ evidence: 'complete' }))
      schedule(HERO_TIMELINE.receding, () =>
        setState((current) => ({
          ...current,
          phase: 'synthesizing',
          evidenceStage: 'receding',
          agentStatuses: { ...IDLE_AGENT_STATUSES },
          statusMessage: 'SeaWatch is preparing a focused answer.',
        })),
      )
      schedule(HERO_TIMELINE.answerConclusion, () => setState((current) => ({ ...current, answerStep: 1 })))
      schedule(HERO_TIMELINE.answerSupport, () => setState((current) => ({ ...current, answerStep: 2 })))
      schedule(HERO_TIMELINE.answerMetadata, () => setState((current) => ({ ...current, answerStep: 3 })))
      schedule(HERO_TIMELINE.answered, () =>
        setState((current) => ({
          ...current,
          phase: 'answered',
          evidenceStage: scenario.visualization === 'none' ? 'none' : 'final',
          statusMessage: scenario.answer.conclusion,
        })),
      )
    },
    [clearTimers, reducedMotion, schedule],
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(getReducedMotionPreference())
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  return { state, reducedMotion, run, reset, preview }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AgentId, AgentStatus } from '../data/agents'
import type { CollaborationEvent } from '../data/demoScenario'
import { AGENTS, isAgentId } from '../data/agents'
import { AgentConnection } from './AgentConnection'
import { AgentNode } from './AgentNode'

const AGENT_ACTIVITY_TEXT: Partial<Record<AgentId, string>> = {
  planner: 'Understanding request',
  fishing: 'Finding opportunity',
  ocean: 'Reading conditions',
  weather: 'Checking forecast',
  safety: 'Reviewing risk',
  geo: 'Checking location',
  evidence: 'Checking sources',
}

type AgentDebugState = {
  enabled: boolean
  statuses: Record<AgentId, AgentStatus>
  connection: { from: AgentId; to: AgentId } | null
}

type AgentDockProps = {
  statuses?: Record<AgentId, AgentStatus>
  connections?: readonly CollaborationEvent[]
  active?: boolean
  relevantAgents?: readonly AgentId[]
  activityLabels?: Partial<Record<AgentId, string>>
}

const IDLE_STATUSES: Record<AgentId, AgentStatus> = {
  planner: 'idle',
  fishing: 'idle',
  ocean: 'idle',
  weather: 'idle',
  safety: 'idle',
  geo: 'idle',
  evidence: 'idle',
}

function getDebugState(): AgentDebugState {
  const search = new URLSearchParams(window.location.search)
  const debugState = search.get('agentdebug')
  const requestedAgent = search.get('agent')
  const statuses = { ...IDLE_STATUSES }

  if (
    (debugState === 'working' || debugState === 'complete' || debugState === 'attention') &&
    isAgentId(requestedAgent)
  ) {
    statuses[requestedAgent] = debugState
  }

  if (debugState === 'states') {
    statuses.planner = 'working'
    statuses.ocean = 'complete'
    statuses.safety = 'attention'
  }

  const from = search.get('from')
  const to = search.get('to')
  const connection =
    debugState === 'collaboration' && isAgentId(from) && isAgentId(to) && from !== to
      ? { from, to }
      : null

  return { enabled: debugState !== null, statuses, connection }
}

export function AgentDock({
  statuses,
  connections = [],
  active = false,
  relevantAgents = [],
  activityLabels = {},
}: AgentDockProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Record<AgentId, HTMLButtonElement | null>>({
    planner: null,
    fishing: null,
    ocean: null,
    weather: null,
    safety: null,
    geo: null,
    evidence: null,
  })
  const debug = getDebugState()
  const visibleStatuses = debug.enabled ? debug.statuses : (statuses ?? IDLE_STATUSES)
  const visibleConnections = debug.connection
    ? [{ id: 'debug-connection', ...debug.connection }]
    : connections
  const workingPriority: AgentId[] = ['safety', 'evidence', 'fishing', 'ocean', 'weather', 'geo', 'planner']
  const narratedAgent = workingPriority.find((agentId) => visibleStatuses[agentId] === 'working')

  const closePopover = useCallback(
    (restoreFocus = true) => {
      const previousAgent = selectedAgent
      setSelectedAgent(null)

      if (restoreFocus && previousAgent) {
        requestAnimationFrame(() => buttonRefs.current[previousAgent]?.focus())
      }
    },
    [selectedAgent],
  )

  useEffect(() => {
    if (!selectedAgent) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) closePopover(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        closePopover()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [closePopover, selectedAgent])

  return (
    <aside
      className={`agent-dock${active ? ' agent-dock--active' : ''}`}
      aria-label="SeaWatch specialized intelligence"
    >
      <div className="agent-dock__inner" ref={dockRef}>
        {visibleConnections.map((connection) => (
          <AgentConnection key={connection.id} from={connection.from} to={connection.to} />
        ))}

        <div className="agent-dock__nodes">
          {AGENTS.map((agent, index) => (
            <AgentNode
              key={agent.id}
              agent={agent}
              status={visibleStatuses[agent.id]}
              selected={selectedAgent === agent.id}
              align={index === 0 ? 'start' : index === AGENTS.length - 1 ? 'end' : 'center'}
              buttonRef={(node) => {
                buttonRefs.current[agent.id] = node
              }}
              onSelect={() =>
                setSelectedAgent((current) => (current === agent.id ? null : agent.id))
              }
              onClose={() => closePopover()}
              activityText={narratedAgent === agent.id ? activityLabels[agent.id] ?? AGENT_ACTIVITY_TEXT[agent.id] : undefined}
              relevant={!active || relevantAgents.includes(agent.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

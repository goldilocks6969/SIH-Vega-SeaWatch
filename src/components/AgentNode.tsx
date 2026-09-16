import {
  Check,
  CloudSun,
  FileCheck2,
  Fish,
  MapPin,
  Route,
  ShieldCheck,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import type { RefCallback } from 'react'
import type { AgentId, AgentRole, AgentStatus } from '../data/agents'
import { AGENT_STATUS_LABELS } from '../data/agents'
import { AgentPopover } from './AgentPopover'

const AGENT_ICONS: Record<AgentId, LucideIcon> = {
  planner: Route,
  fishing: Fish,
  ocean: Waves,
  weather: CloudSun,
  safety: ShieldCheck,
  geo: MapPin,
  evidence: FileCheck2,
}

type AgentNodeProps = {
  agent: AgentRole
  status: AgentStatus
  selected: boolean
  align: 'start' | 'center' | 'end'
  buttonRef: RefCallback<HTMLButtonElement>
  onSelect: () => void
  onClose: () => void
  activityText?: string
  relevant?: boolean
}

export function AgentNode({
  agent,
  status,
  selected,
  align,
  buttonRef,
  onSelect,
  onClose,
  activityText,
  relevant = true,
}: AgentNodeProps) {
  const Icon = AGENT_ICONS[agent.id]
  const tooltipId = `agent-tooltip-${agent.id}`

  return (
    <div className={`agent-node-shell${relevant ? '' : ' agent-node-shell--irrelevant'}`}>
      <button
        ref={buttonRef}
        className={`agent-node agent-node--${status}`}
        type="button"
        aria-label={`${agent.name}. Status: ${AGENT_STATUS_LABELS[status]}.`}
        aria-describedby={tooltipId}
        aria-expanded={selected}
        aria-controls={selected ? `agent-popover-${agent.id}` : undefined}
        onClick={onSelect}
      >
        <span className="agent-node__circle" aria-hidden="true">
          <Icon />
          {status === 'working' && <span className="agent-node__activity" />}
          {status === 'complete' && (
            <span className="agent-node__complete-mark">
              <Check />
            </span>
          )}
          {status === 'attention' && <span className="agent-node__attention-mark" />}
        </span>
        <span className="agent-node__label">{agent.name}</span>
        {activityText && (
          <span className="agent-node__status" aria-hidden="true">
            {activityText}
          </span>
        )}
      </button>

      <span className="agent-tooltip" id={tooltipId} role="tooltip">
        {agent.description}
      </span>

      {selected && (
        <AgentPopover agent={agent} status={status} align={align} onClose={onClose} />
      )}
    </div>
  )
}

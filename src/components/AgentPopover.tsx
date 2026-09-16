import { X } from 'lucide-react'
import type { AgentRole, AgentStatus } from '../data/agents'
import { AGENT_STATUS_LABELS } from '../data/agents'

type AgentPopoverProps = {
  agent: AgentRole
  status: AgentStatus
  align: 'start' | 'center' | 'end'
  onClose: () => void
}

export function AgentPopover({ agent, status, align, onClose }: AgentPopoverProps) {
  return (
    <section
      className={`agent-popover agent-popover--${align}`}
      id={`agent-popover-${agent.id}`}
      role="dialog"
      aria-label={`${agent.name} agent details`}
    >
      <header className="agent-popover__header">
        <div>
          <h2>{agent.name}</h2>
          <p>{agent.specialty}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={`Close ${agent.name} details`}>
          <X aria-hidden="true" />
        </button>
      </header>

      <dl className="agent-popover__details">
        <div>
          <dt>Status</dt>
          <dd className={`agent-popover__status agent-popover__status--${status}`}>
            {AGENT_STATUS_LABELS[status]}
          </dd>
        </div>
        <div>
          <dt>Works with</dt>
          <dd>{agent.worksWith.join(' · ')}</dd>
        </div>
        <div>
          <dt>Uses</dt>
          <dd>{agent.uses.join(' · ')}</dd>
        </div>
      </dl>
    </section>
  )
}

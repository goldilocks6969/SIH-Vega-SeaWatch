import type { AgentId } from '../data/agents'
import { AGENTS } from '../data/agents'

type AgentConnectionProps = {
  from: AgentId
  to: AgentId
}

export function AgentConnection({ from, to }: AgentConnectionProps) {
  const fromIndex = AGENTS.findIndex((agent) => agent.id === from)
  const toIndex = AGENTS.findIndex((agent) => agent.id === to)
  const fromX = fromIndex + 0.5
  const toX = toIndex + 0.5
  const middleX = (fromX + toX) / 2
  const path = `M ${fromX} 0.55 Q ${middleX} -0.45 ${toX} 0.55`

  return (
    <svg
      className={`agent-connection agent-connection--${fromIndex < toIndex ? 'forward' : 'reverse'}`}
      viewBox="0 0 7 1"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={path} />
      <circle className="agent-connection__signal" r="0.045">
        <animateMotion begin="200ms" dur="350ms" path={path} fill="freeze" />
      </circle>
    </svg>
  )
}

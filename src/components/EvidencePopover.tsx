import type { RefObject } from 'react'
import type { DemoSource } from '../data/demoScenario'

type EvidencePopoverProps = {
  sources: readonly DemoSource[]
  popoverRef: RefObject<HTMLDivElement | null>
}

export function EvidencePopover({ sources, popoverRef }: EvidencePopoverProps) {
  return (
    <div
      className="evidence-popover"
      ref={popoverRef}
      role="dialog"
      aria-label="Evidence used for this recommendation"
    >
      <p className="evidence-popover__title">Evidence used</p>
      <ul>
        {sources.map((source) => (
          <li key={source.name}>
            <span>{source.name}</span>
            <small>{source.freshness}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

import type { KeyboardEvent, PointerEvent } from 'react'
import type { Vessel } from '../data/vessels'
import { VESSEL_TYPE_LABELS } from '../data/vessels'
import { projectPoint } from '../data/geography'

type VesselMarkerProps = {
  vessel: Vessel
  selected?: boolean
  emphasized?: boolean
  onSelect?: () => void
}

const vesselScale = {
  fishing: 0.88,
  cargo: 1.12,
  coastal: 1,
  service: 0.94,
} as const

export function VesselMarker({ vessel, selected = false, emphasized = false, onSelect }: VesselMarkerProps) {
  const { x, y } = projectPoint(vessel.coordinates)
  const typeLabel = VESSEL_TYPE_LABELS[vessel.type]
  const accessibleLabel = `${vessel.name}, ${typeLabel}, ${vessel.speed.toFixed(1)} knots, heading ${vessel.heading} degrees`

  return (
    <g
      className={`vessel-marker vessel-marker--${vessel.type}${selected ? ' vessel-marker--selected' : ''}${emphasized ? ' vessel-marker--operational' : ''}`}
      data-vessel-id={vessel.id}
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
      tabIndex={0}
      role="button"
      aria-label={accessibleLabel}
      aria-pressed={selected}
      onPointerDown={(event: PointerEvent<SVGGElement>) => {
        event.stopPropagation()
        onSelect?.()
      }}
      onKeyDown={(event: KeyboardEvent<SVGGElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect?.()
        }
      }}
    >
      <title>{accessibleLabel}</title>
      <circle className="vessel-marker__hit-area" r="17" aria-hidden="true" />
      <g className={`vessel-marker__drift vessel-marker__${vessel.animationVariant}`}>
        <g
          className="vessel-marker__heading"
          transform={`rotate(${vessel.heading}) scale(${vesselScale[vessel.type]})`}
        >
          <path
            className="vessel-marker__hull"
            d="M 0 -9 C 3.7 -6.4 4.4 2.7 3.2 7.2 L 0 9.4 L -3.2 7.2 C -4.4 2.7 -3.7 -6.4 0 -9 Z"
          />
          <path className="vessel-marker__deck" d="M -2.4 2.7 L 2.4 2.7 M -1.5 5.3 L 1.5 5.3" />
        </g>
      </g>

      <g className="vessel-tooltip" transform="translate(14 -35)" aria-hidden="true">
        <rect width="164" height="45" rx="9" />
        <text className="vessel-tooltip__name" x="11" y="18">{vessel.name}</text>
        <text x="11" y="35">{typeLabel} · {vessel.speed.toFixed(1)} kn</text>
      </g>
    </g>
  )
}

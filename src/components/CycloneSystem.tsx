import type { KeyboardEvent, PointerEvent } from 'react'
import type { Cyclone } from '../data/hazards'
import { projectPoint } from '../data/geography'

type CycloneSystemProps = {
  cyclone: Cyclone
  selected?: boolean
  onSelect?: () => void
}

export function CycloneSystem({ cyclone, selected = false, onSelect }: CycloneSystemProps) {
  const { x, y } = projectPoint(cyclone.centre)
  const label = `Mock cyclonic system, ${cyclone.status.toLowerCase()}, moving ${cyclone.direction}`
  const activate = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect?.()
    }
  }

  return (
    <g
      className={`cyclone-system${selected ? ' cyclone-system--selected' : ''}`}
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected}
      onPointerDown={(event: PointerEvent<SVGGElement>) => event.stopPropagation()}
      onClick={onSelect}
      onKeyDown={activate}
    >
      <title>{label}</title>
      <circle className="cyclone-system__hit-area" r={cyclone.visualRadius + 16} aria-hidden="true" />

      <g className="cyclone-system__forecast">
        <path className="cyclone-system__forecast-corridor" d="M -34 -19 C -92 -63 -145 -82 -218 -100 L -228 -63 C -157 -55 -98 -37 -40 2 Z" />
        <path className="cyclone-system__forecast-line" d="M -28 -8 C -94 -52 -152 -68 -220 -81" />
        <circle cx="-84" cy="-43" r="3" />
        <circle cx="-151" cy="-65" r="2.6" />
        <circle cx="-220" cy="-81" r="2.2" />
      </g>

      <g className="cyclone-system__outer-drift">
        <path className="cyclone-system__cloud-field" d="M -130 -28 C -115 -86 -60 -123 1 -117 C 47 -137 109 -95 112 -48 C 145 -9 124 62 76 82 C 44 122 -34 126 -69 88 C -121 76 -151 23 -130 -28 Z" />
        <ellipse className="cyclone-system__cloud-lobe cyclone-system__cloud-lobe--a" cx="-58" cy="-38" rx="68" ry="34" transform="rotate(-24 -58 -38)" />
        <ellipse className="cyclone-system__cloud-lobe cyclone-system__cloud-lobe--b" cx="46" cy="46" rx="82" ry="31" transform="rotate(18 46 46)" />
        <ellipse className="cyclone-system__cloud-lobe cyclone-system__cloud-lobe--c" cx="73" cy="-43" rx="52" ry="24" transform="rotate(29 73 -43)" />
        <path className="cyclone-system__outer-band cyclone-system__outer-band--a" d="M -126 56 C -108 2 -69 -48 -10 -70 C 36 -87 78 -69 108 -36" />
        <path className="cyclone-system__outer-band cyclone-system__outer-band--b" d="M 121 22 C 91 69 40 94 -17 90 C -48 88 -76 75 -98 53" />
      </g>

      <g className="cyclone-system__inner-rotation">
        <path className="cyclone-system__spiral cyclone-system__spiral--a" d="M -83 -30 C -45 -61 10 -61 49 -32 C 70 -16 79 4 70 27" />
        <path className="cyclone-system__spiral cyclone-system__spiral--b" d="M 56 43 C 16 67 -31 58 -53 28 C -65 10 -60 -9 -45 -24" />
        <path className="cyclone-system__spiral cyclone-system__spiral--c" d="M -31 13 C -35 -14 -9 -33 17 -25 C 36 -19 44 -3 35 11" />
      </g>

      <path className="cyclone-system__inflow" d="M 114 -3 C 83 -20 64 -42 39 -60" />
      <ellipse className="cyclone-system__eye-soft" rx="15" ry="11" transform="rotate(-18)" />
      <ellipse className="cyclone-system__eye" rx="3.8" ry="3.1" transform="rotate(-18)" />

      <g className="cyclone-label" transform="translate(104 -82)">
        <text className="cyclone-label__title">Cyclonic system</text>
        <text className="cyclone-label__status" y="17">Moving {cyclone.direction}</text>
      </g>
    </g>
  )
}

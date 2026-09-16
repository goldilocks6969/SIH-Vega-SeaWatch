import { Anchor } from 'lucide-react'
import type { Port } from '../data/ports'
import { projectPoint } from '../data/geography'

type PortMarkerProps = {
  port: Port
  emphasized?: boolean
}

export function PortMarker({ port, emphasized = false }: PortMarkerProps) {
  const { x, y } = projectPoint(port.coordinates)
  const isPrimary = port.prominence === 'primary'

  return (
    <g
      className={`${isPrimary ? 'port-marker port-marker--primary' : 'port-marker'}${emphasized ? ' port-marker--operational' : ''}`}
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
      tabIndex={0}
      role="img"
      aria-label={`${port.name} port`}
    >
      <title>{port.name} port</title>
      <circle className="port-marker__surface" r={isPrimary ? 12 : 10} />
      <Anchor
        className="port-marker__icon"
        x={isPrimary ? -7 : -6}
        y={isPrimary ? -7 : -6}
        width={isPrimary ? 14 : 12}
        height={isPrimary ? 14 : 12}
        aria-hidden="true"
      />
      <text className="port-marker__label" x={isPrimary ? 18 : 16} y="4">
        {port.name}
      </text>
    </g>
  )
}

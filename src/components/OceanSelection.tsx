import { OceanRipple } from './OceanRipple'

type OceanSelectionProps = {
  x: number
  y: number
  showAction?: boolean
  onAnalyze?: () => void
}

export function OceanSelection({ x, y, showAction = true, onAnalyze }: OceanSelectionProps) {
  const actionX = x > 720 ? -204 : 64
  const actionY = y < 64 ? 8 : y > 836 ? -44 : -18

  return (
    <g
      className="ocean-selection"
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
      role="group"
      aria-label={showAction ? 'Selected marine area. Analyze this area is available.' : 'Selected marine area.'}
    >
      <title>Selected marine area</title>

      <ellipse className="ocean-selection__water-response" rx="66" ry="44" transform="rotate(-8)" aria-hidden="true" />
      <OceanRipple variant="primary" radius={108} />
      <OceanRipple variant="secondary" radius={124} />

      <path className="ocean-selection__zone" d="M -47 -8 C -39 -37 -5 -52 28 -38 C 54 -26 58 7 40 32 C 18 55 -20 51 -43 25 C -51 15 -53 2 -47 -8 Z" aria-hidden="true" />
      <circle className="ocean-selection__point" r="2.6" aria-hidden="true" />

      {showAction && <foreignObject
        className="ocean-selection__action-wrap"
        x={actionX}
        y={actionY}
        width="140"
        height="40"
      >
        <button
          className="ocean-selection__action"
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onAnalyze}
          aria-label="Analyze this selected marine area"
        >
          Analyze this area
        </button>
      </foreignObject>}
    </g>
  )
}

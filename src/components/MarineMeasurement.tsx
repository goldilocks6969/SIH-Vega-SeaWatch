type MarineMeasurementProps = {
  x: number
  y: number
  value: string
  label: string
  variant: 'ocean' | 'productivity' | 'wave' | 'wind'
}

export function MarineMeasurement({ x, y, value, label, variant }: MarineMeasurementProps) {
  return (
    <g className={`marine-measurement marine-measurement--${variant}`} transform={`translate(${x} ${y})`}>
      <circle r="2" />
      <path d="M 0 0 L 9 -9 H 18" />
      <text className="marine-measurement__value" x="22" y="-12">{value}</text>
      <text className="marine-measurement__label" x="22" y="3">{label}</text>
    </g>
  )
}

type OceanRippleProps = {
  radius: number
  variant: 'primary' | 'secondary'
}

export function OceanRipple({ radius, variant }: OceanRippleProps) {
  const verticalRadius = variant === 'primary' ? radius * 0.72 : radius * 0.58
  const rotation = variant === 'primary' ? -9 : 7

  return (
    <ellipse
      className={`ocean-ripple ocean-ripple--${variant} motion-ripple--${variant}`}
      rx={radius}
      ry={verticalRadius}
      pathLength="300"
      transform={`rotate(${rotation})`}
      aria-hidden="true"
    />
  )
}

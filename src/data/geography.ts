export type GeoPoint = readonly [longitude: number, latitude: number]

export const MAP_VIEWBOX = {
  width: 1440,
  height: 900,
  west: 68,
  east: 78,
  north: 13.2,
  south: 8.05,
} as const

/**
 * Kerala-facing section of the Natural Earth 1:10m coastline,
 * simplified to keep this deterministic prototype small and editable.
 * Natural Earth data is in the public domain.
 */
export const KERALA_COASTLINE: readonly GeoPoint[] = [
  [74.74879, 13.17084],
  [74.77682, 13.09955],
  [74.82089, 12.82465],
  [74.86796, 12.79731],
  [74.94068, 12.53726],
  [74.99884, 12.49136],
  [75.06774, 12.30589],
  [75.10818, 12.24608],
  [75.14864, 12.16132],
  [75.21106, 12.01203],
  [75.28054, 11.98111],
  [75.35403, 11.89912],
  [75.47473, 11.72724],
  [75.53606, 11.69367],
  [75.57706, 11.54979],
  [75.62615, 11.48493],
  [75.72164, 11.3675],
  [75.82013, 11.09785],
  [75.87355, 10.93268],
  [75.89697, 10.84976],
  [75.93149, 10.7757],
  [75.98564, 10.60554],
  [76.01744, 10.56708],
  [76.06083, 10.47016],
  [76.10844, 10.38467],
  [76.15307, 10.20624],
  [76.18146, 10.15534],
  [76.21173, 10.09882],
  [76.24233, 9.9394],
  [76.28393, 9.87075],
  [76.3233, 9.72687],
  [76.31923, 9.65843],
  [76.33624, 9.5207],
  [76.33115, 9.49299],
  [76.36305, 9.32518],
  [76.41108, 9.24698],
  [76.45001, 9.14517],
  [76.4921, 9.05557],
  [76.53595, 8.9125],
  [76.57602, 8.89069],
  [76.65626, 8.79975],
  [76.74239, 8.68452],
  [76.83676, 8.56981],
  [76.94202, 8.40469],
  [77.0121, 8.36811],
  [77.11318, 8.28518],
  [77.25538, 8.17512],
  [77.44972, 8.08747],
] as const

type MapLabel = {
  name: string
  coordinates: GeoPoint
}

export const MAP_LABELS: readonly MapLabel[] = [
  { name: 'Thrissur', coordinates: [76.2144, 10.5276] as GeoPoint },
]

export const OFFSHORE_BOUNDARY: readonly GeoPoint[] = [
  [74.45, 12.55],
  [74.72, 11.8],
  [74.93, 11.1],
  [75.15, 10.35],
  [75.25, 9.65],
  [75.37, 8.95],
]

export function projectPoint([longitude, latitude]: GeoPoint) {
  const x =
    ((longitude - MAP_VIEWBOX.west) / (MAP_VIEWBOX.east - MAP_VIEWBOX.west)) *
    MAP_VIEWBOX.width
  const y =
    ((MAP_VIEWBOX.north - latitude) / (MAP_VIEWBOX.north - MAP_VIEWBOX.south)) *
    MAP_VIEWBOX.height

  return { x, y }
}

export function createCoastlinePath(points: readonly GeoPoint[]) {
  return points
    .map((point, index) => {
      const { x, y } = projectPoint(point)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

export function createSmoothClosedPath(points: readonly GeoPoint[]) {
  const projected = points.map(projectPoint)
  if (projected.length < 3) return `${createCoastlinePath(points)} Z`

  const first = projected[0]
  const segments = projected.map((current, index) => {
    const previous = projected[(index - 1 + projected.length) % projected.length]
    const next = projected[(index + 1) % projected.length]
    const afterNext = projected[(index + 2) % projected.length]
    const controlOne = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    }
    const controlTwo = {
      x: next.x - (afterNext.x - current.x) / 6,
      y: next.y - (afterNext.y - current.y) / 6,
    }
    return `C ${controlOne.x.toFixed(1)} ${controlOne.y.toFixed(1)} ${controlTwo.x.toFixed(1)} ${controlTwo.y.toFixed(1)} ${next.x.toFixed(1)} ${next.y.toFixed(1)}`
  })

  return `M ${first.x.toFixed(1)} ${first.y.toFixed(1)} ${segments.join(' ')} Z`
}

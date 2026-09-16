import type { GeoPoint } from './geography'

export type Cyclone = {
  id: string
  centre: GeoPoint
  status: string
  direction: string
  visualRadius: number
  windKph: number
  pressureHpa: number
  closestApproach: string
  coastalImpact: string
  updated: string
}

export const CYCLONE: Cyclone = {
  id: 'mock-arabian-sea-system',
  centre: [70.28, 8.98],
  status: 'Monitoring movement',
  direction: 'northwest',
  visualRadius: 126,
  windKph: 68,
  pressureHpa: 992,
  closestApproach: '~310 km southwest of Kochi',
  coastalImpact: 'Low for Kochi currently',
  updated: 'Updated 8 min ago',
}

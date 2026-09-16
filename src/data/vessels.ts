import type { GeoPoint } from './geography'

export type VesselType = 'fishing' | 'cargo' | 'coastal' | 'service'
export type VesselAnimation = 'drift-a' | 'drift-b' | 'drift-c'

export type Vessel = {
  id: string
  name: string
  type: VesselType
  coordinates: GeoPoint
  heading: number
  speed: number
  animationVariant: VesselAnimation
}

export const VESSELS: readonly Vessel[] = [
  {
    id: 'fv-neeraj',
    name: 'FV Neeraj',
    type: 'fishing',
    coordinates: [74.72, 10.13],
    heading: 24,
    speed: 8.4,
    animationVariant: 'drift-a',
  },
  {
    id: 'mv-malabar',
    name: 'MV Malabar',
    type: 'cargo',
    coordinates: [73.21, 11.21],
    heading: 112,
    speed: 12.8,
    animationVariant: 'drift-c',
  },
  {
    id: 'coast-runner',
    name: 'Coast Runner',
    type: 'coastal',
    coordinates: [75.18, 9.56],
    heading: 45,
    speed: 9.6,
    animationVariant: 'drift-b',
  },
  {
    id: 'fv-meera',
    name: 'FV Meera',
    type: 'fishing',
    coordinates: [74.02, 9.03],
    heading: 330,
    speed: 7.1,
    animationVariant: 'drift-b',
  },
  {
    id: 'ocean-crest',
    name: 'Ocean Crest',
    type: 'cargo',
    coordinates: [72.34, 10.44],
    heading: 78,
    speed: 13.2,
    animationVariant: 'drift-a',
  },
  {
    id: 'samudra-04',
    name: 'Samudra 04',
    type: 'service',
    coordinates: [74.38, 11.56],
    heading: 190,
    speed: 6.8,
    animationVariant: 'drift-c',
  },
  {
    id: 'mv-konkan',
    name: 'MV Konkan',
    type: 'coastal',
    coordinates: [71.73, 12.08],
    heading: 142,
    speed: 10.3,
    animationVariant: 'drift-b',
  },
  {
    id: 'fv-kadal',
    name: 'FV Kadal',
    type: 'fishing',
    coordinates: [73.58, 8.72],
    heading: 18,
    speed: 5.9,
    animationVariant: 'drift-c',
  },
]

export const VESSEL_TYPE_LABELS: Record<VesselType, string> = {
  fishing: 'Fishing vessel',
  cargo: 'Cargo vessel',
  coastal: 'Coastal vessel',
  service: 'Patrol / service vessel',
}

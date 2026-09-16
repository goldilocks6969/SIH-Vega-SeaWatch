import type { GeoPoint } from './geography'

export type Port = {
  id: string
  name: string
  coordinates: GeoPoint
  prominence: 'primary' | 'secondary'
}

export const PORTS: readonly Port[] = [
  {
    id: 'kochi',
    name: 'Kochi',
    coordinates: [76.2588, 9.9652],
    prominence: 'primary',
  },
  {
    id: 'kodungallur',
    name: 'Kodungallur',
    coordinates: [76.1724, 10.1932],
    prominence: 'secondary',
  },
  {
    id: 'alappuzha',
    name: 'Alappuzha',
    coordinates: [76.3326, 9.4981],
    prominence: 'secondary',
  },
]

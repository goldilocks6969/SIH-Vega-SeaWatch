import { LocateFixed, Minus, Plus } from 'lucide-react'

export function MapControls() {
  return (
    <div className="map-controls" aria-label="Map controls" role="group">
      <button type="button" aria-label="Zoom in" title="Zoom in">
        <Plus aria-hidden="true" />
      </button>
      <button type="button" aria-label="Zoom out" title="Zoom out">
        <Minus aria-hidden="true" />
      </button>
      <button
        className="map-controls__locate"
        type="button"
        aria-label="Recenter on Kochi"
        title="Recenter on Kochi"
      >
        <LocateFixed aria-hidden="true" />
      </button>
    </div>
  )
}

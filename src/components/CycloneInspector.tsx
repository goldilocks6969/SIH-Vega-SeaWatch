import { ArrowUpRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Cyclone } from '../data/hazards'

type CycloneInspectorProps = {
  cyclone: Cyclone
  onClose: () => void
  onAssess: () => void
}

export function CycloneInspector({ cyclone, onClose, onAssess }: CycloneInspectorProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const inspectorRef = useRef<HTMLElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!inspectorRef.current?.contains(event.target as Node)) onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
    }
  }, [onClose])

  return (
    <aside className="cyclone-inspector" ref={inspectorRef} aria-label="Cyclonic system details">
      <span className="cyclone-inspector__leader" aria-hidden="true" />
      <header>
        <div>
          <p className="cyclone-inspector__eyebrow">Weather system · mock data</p>
          <h2>Cyclonic system</h2>
          <p className="cyclone-inspector__movement">Moving {cyclone.direction}</p>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close cyclone details"><X /></button>
      </header>

      <dl>
        <div><dt>Wind</dt><dd>{cyclone.windKph} km/h</dd></div>
        <div><dt>Pressure</dt><dd>{cyclone.pressureHpa} hPa</dd></div>
        <div><dt>Track confidence</dt><dd>Moderate</dd></div>
        <div><dt>Coastal influence</dt><dd>Later today</dd></div>
        <div className="cyclone-inspector__wide"><dt>Current estimate</dt><dd>{cyclone.closestApproach}</dd></div>
      </dl>

      <footer>
        <span>{cyclone.updated}</span>
        <button type="button" onClick={onAssess}>Assess coastal impact <ArrowUpRight /></button>
      </footer>
    </aside>
  )
}

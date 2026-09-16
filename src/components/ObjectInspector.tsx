import { ArrowUpRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

type InspectorDetail = {
  label: string
  value: string
}

type ObjectInspectorProps = {
  kind: 'vessel' | 'fishing-zone'
  eyebrow: string
  title: string
  subtitle?: string
  details: readonly InspectorDetail[]
  actionLabel: string
  onClose: () => void
  onAsk: () => void
}

export function ObjectInspector({
  kind,
  eyebrow,
  title,
  subtitle,
  details,
  actionLabel,
  onClose,
  onAsk,
}: ObjectInspectorProps) {
  const shellRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
    }
  }, [onClose])

  return (
    <aside
      className={`object-inspector object-inspector--${kind}`}
      ref={shellRef}
      aria-label={`${title} details`}
    >
      <span className="object-inspector__leader" aria-hidden="true" />
      <header>
        <div>
          <p className="object-inspector__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {subtitle && <p className="object-inspector__subtitle">{subtitle}</p>}
        </div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${title} details`}>
          <X aria-hidden="true" />
        </button>
      </header>

      <dl>
        {details.map((detail) => (
          <div key={detail.label}>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        ))}
      </dl>

      <footer>
        <span>Mock demo context</span>
        <button type="button" onClick={onAsk}>
          {actionLabel} <ArrowUpRight aria-hidden="true" />
        </button>
      </footer>
    </aside>
  )
}

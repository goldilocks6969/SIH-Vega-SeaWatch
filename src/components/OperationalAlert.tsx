import { ArrowUpRight, X } from 'lucide-react'

type OperationalAlertProps = {
  onAssess: () => void
  onDismiss: () => void
}

export function OperationalAlert({ onAssess, onDismiss }: OperationalAlertProps) {
  return (
    <aside className="operational-alert" aria-label="Marine conditions update">
      <span className="operational-alert__anchor" aria-hidden="true" />
      <div>
        <p>Forecast update · mock</p>
        <strong>Marine conditions worsening</strong>
        <button type="button" onClick={onAssess}>Assess coastal impact <ArrowUpRight /></button>
      </div>
      <button type="button" className="operational-alert__close" onClick={onDismiss} aria-label="Dismiss marine conditions update"><X /></button>
    </aside>
  )
}

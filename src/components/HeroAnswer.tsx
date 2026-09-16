import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoAnswer, DemoSource } from '../data/demoScenario'
import { EvidencePopover } from './EvidencePopover'

type HeroAnswerProps = {
  answer: DemoAnswer
  step: 0 | 1 | 2 | 3
  sources: readonly DemoSource[]
  language?: 'en' | 'ml'
  decisionCue?: string
  actionLabel?: string
  onAction?: () => void
}

export function HeroAnswer({
  answer,
  step,
  sources,
  language = 'en',
  decisionCue,
  actionLabel,
  onAction,
}: HeroAnswerProps) {
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const closeEvidence = useCallback((restoreFocus = true) => {
    setEvidenceOpen(false)
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!evidenceOpen) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) closeEvidence(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        closeEvidence()
      }
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [closeEvidence, evidenceOpen])

  return (
    <section
      className="hero-answer"
      ref={shellRef}
      aria-live="polite"
      aria-label="SeaWatch recommendation"
      lang={language}
    >
      {step >= 1 && <h1>{answer.conclusion}</h1>}
      {step >= 2 && <p>{answer.supporting}</p>}
      {step >= 2 && decisionCue && <div className="hero-answer__decision-cue">{decisionCue}</div>}
      {step >= 3 && (
        <div className="hero-answer__footer">
          <div className="hero-answer__evidence-wrap">
            {sources.length > 0 ? (
              <>
                <button
                  type="button"
                  ref={triggerRef}
                  aria-expanded={evidenceOpen}
                  aria-haspopup="dialog"
                  onClick={() => setEvidenceOpen((current) => !current)}
                >
                  {answer.metadata}
                </button>
                {evidenceOpen && (
                  <EvidencePopover sources={sources} popoverRef={popoverRef} />
                )}
              </>
            ) : <span>{answer.metadata}</span>}
          </div>
          {actionLabel && onAction && (
            <button className="hero-answer__action" type="button" onClick={onAction}>{actionLabel}</button>
          )}
        </div>
      )}
    </section>
  )
}

import { ArrowUp, Mic } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { MALAYALAM_SAFETY_DEMO } from '../data/localizedDemo'
import type { OrchestrationPhase } from '../hooks/useDemoOrchestration'

export type DemoLanguage = 'en' | 'ml'

type HeroComposerProps = {
  phase: OrchestrationPhase
  submittedQuery: string
  acknowledged: boolean
  onSubmit: (query: string) => void
  suggestions: readonly string[]
  language: DemoLanguage
  onLanguageChange: (language: DemoLanguage) => void
  initialValue?: string
}

type VoiceState = 'idle' | 'listening' | 'transcribing'

const ENGLISH_VOICE_QUERY = 'Is it safe to go out tomorrow morning?'

export function HeroComposer({
  phase,
  submittedQuery,
  acknowledged,
  onSubmit,
  suggestions,
  language,
  onLanguageChange,
  initialValue = '',
}: HeroComposerProps) {
  const [value, setValue] = useState(initialValue)
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const voiceTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const busy = phase !== 'idle' && phase !== 'answered'
  const answered = phase === 'answered'
  const listening = voiceState !== 'idle'
  const composerState = listening
    ? 'listening'
    : busy
      ? acknowledged
        ? 'working'
        : 'submitted'
      : answered
        ? 'follow-up'
        : value.trim()
          ? 'typing'
          : 'idle'

  const clearVoiceTimers = () => {
    voiceTimers.current.forEach(clearTimeout)
    voiceTimers.current = []
  }

  useEffect(() => clearVoiceTimers, [])

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    const query = value.trim()
    if (!query || listening) return
    clearVoiceTimers()
    onSubmit(query)
  }

  const runQuestion = (query: string) => {
    if (listening) return
    setValue(query)
    onSubmit(query)
  }

  const runVoiceDemo = () => {
    clearVoiceTimers()
    const transcript = language === 'ml' ? MALAYALAM_SAFETY_DEMO.query : ENGLISH_VOICE_QUERY
    setVoiceState('listening')
    setValue('')

    voiceTimers.current.push(
      setTimeout(() => setVoiceState('transcribing'), 100),
      setTimeout(() => {
        setValue(language === 'ml' ? 'നാളെ രാവിലെ…' : 'Is it safe to go out…')
      }, 900),
      setTimeout(() => setValue(transcript), 1500),
      setTimeout(() => {
        setVoiceState('idle')
        onSubmit(transcript)
      }, 1800),
    )
  }

  return (
    <section
      className={`hero-composer hero-composer--${composerState}${acknowledged ? ' hero-composer--acknowledged' : ''}${language === 'ml' ? ' hero-composer--malayalam' : ''}`}
      aria-label="Ask SeaWatch"
    >
      <form className="hero-composer__form" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="seawatch-question">
          Ask SeaWatch about marine conditions
        </label>
        <input
          id="seawatch-question"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={
            listening
              ? voiceState === 'listening'
                ? 'Listening…'
                : 'Understanding…'
              : answered
                ? 'Ask a follow-up…'
                : 'Ask about the ocean…'
          }
          autoComplete="off"
          lang={language === 'ml' ? 'ml' : 'en'}
        />

        {listening && (
          <span className="hero-composer__voice-current" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((bar) => <i key={bar} />)}
          </span>
        )}

        <button
          className="hero-composer__mic"
          type="button"
          aria-label={`Run ${language === 'ml' ? 'Malayalam' : 'English'} voice demonstration`}
          aria-pressed={listening}
          disabled={listening}
          onClick={runVoiceDemo}
        >
          <Mic aria-hidden="true" />
        </button>
        <button
          className="hero-composer__send"
          type="submit"
          aria-label="Ask SeaWatch"
          disabled={listening || value.trim().length === 0}
        >
          <ArrowUp aria-hidden="true" />
        </button>
      </form>

      {!busy && !listening && suggestions.length > 0 && (
        <div className="hero-composer__suggestions" aria-label="Suggested questions">
          {suggestions.slice(0, 2).map((suggestion) => (
            <button
              className="hero-composer__suggestion"
              type="button"
              key={suggestion}
              onClick={() => runQuestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="hero-composer__language" aria-label="Voice demo language">
        <button
          type="button"
          aria-pressed={language === 'en'}
          onClick={() => onLanguageChange('en')}
        >
          EN
        </button>
        <span>·</span>
        <button
          type="button"
          lang="ml"
          aria-pressed={language === 'ml'}
          onClick={() => onLanguageChange('ml')}
        >
          മലയാളം
        </button>
      </div>

      <span className="visually-hidden" role="status" aria-live="polite">
        {listening
          ? voiceState === 'listening'
            ? 'Listening for a deterministic demo question.'
            : 'Demo transcript is appearing.'
          : submittedQuery
            ? `Latest question: ${submittedQuery}`
            : ''}
      </span>
    </section>
  )
}

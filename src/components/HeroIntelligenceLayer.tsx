import type { KeyboardEvent, PointerEvent } from 'react'
import type { ScenarioVisualization } from '../data/conversationScenarios'
import { DEMO_SCENARIO } from '../data/demoScenario'
import { createSmoothClosedPath, projectPoint } from '../data/geography'
import type { EvidenceStage } from '../hooks/useDemoOrchestration'
import { MarineMeasurement } from './MarineMeasurement'

type HeroIntelligenceLayerProps = {
  stage: EvidenceStage
  mode: 'hero' | 'area' | null
  variant?: Extract<ScenarioVisualization, 'fishing' | 'why-fishing' | 'after-nine'>
  interactive?: boolean
  selected?: boolean
  onSelect?: () => void
}

const zonePath = createSmoothClosedPath(DEMO_SCENARIO.opportunityZone)
const corePath = createSmoothClosedPath(DEMO_SCENARIO.opportunityCore)
const conditionPaths = DEMO_SCENARIO.oceanConditionRegions.map(createSmoothClosedPath)
const cautionPath = createSmoothClosedPath(DEMO_SCENARIO.cautionRegion)

export function HeroIntelligenceLayer({
  stage,
  mode,
  variant = 'fishing',
  interactive = false,
  selected = false,
  onSelect,
}: HeroIntelligenceLayerProps) {
  const order: EvidenceStage[] = ['none', 'base', 'expanded', 'safety', 'peak', 'receding', 'final']
  const stageIndex = order.indexOf(stage)
  const hasBase = stageIndex >= 1
  const hasExpanded = stageIndex >= 2
  const hasSafety = stageIndex >= 3
  const hasPeak = stageIndex >= 4
  const isSettled = stage === 'receding' || stage === 'final'

  return (
    <g
      className={[
        'hero-intelligence',
        `hero-intelligence--${stage}`,
        `hero-intelligence--${mode ?? 'inactive'}`,
        `hero-intelligence--${variant}`,
        hasBase ? 'hero-intelligence--has-base' : '',
        hasExpanded ? 'hero-intelligence--has-expanded' : '',
        hasSafety ? 'hero-intelligence--has-safety' : '',
        hasPeak ? 'hero-intelligence--has-peak' : '',
        isSettled ? 'hero-intelligence--settled' : '',
      ].filter(Boolean).join(' ')}
      aria-hidden={interactive ? undefined : true}
    >
      <g className="intelligence-conditions">
        {conditionPaths.map((path, index) => (
          <g key={path} className={`intelligence-condition intelligence-condition--${index + 1}`}>
            <path className="intelligence-condition__fill" d={path} />
            <path className="intelligence-condition__line" d={path} pathLength="100" />
          </g>
        ))}
      </g>

      <g
        className={`intelligence-zone${interactive ? ' intelligence-zone--interactive' : ''}${selected ? ' intelligence-zone--selected' : ''}`}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? 'Inspect the promising fishing zone' : undefined}
        aria-pressed={interactive ? selected : undefined}
        onPointerDown={interactive ? (event: PointerEvent<SVGGElement>) => event.stopPropagation() : undefined}
        onClick={interactive ? onSelect : undefined}
        onKeyDown={interactive ? (event: KeyboardEvent<SVGGElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect?.()
          }
        } : undefined}
      >
        {interactive && <title>Promising fishing zone</title>}
        <path className="intelligence-zone__halo" d={zonePath} />
        <path className="intelligence-zone__fill" d={zonePath} />
        <path className="intelligence-zone__core" d={corePath} />
        <path className="intelligence-zone__line" d={zonePath} pathLength="100" />
        <g className="intelligence-zone__label" transform="translate(924 456)">
          <path d="M 116 8 L 145 28" />
          <text>Promising fishing zone</text>
        </g>
      </g>

      <g className="intelligence-measurements">
        <MarineMeasurement x={865} y={428} value="27.4°" label="Sea surface" variant="ocean" />
        <MarineMeasurement x={1015} y={410} value="Favorable" label="Chlorophyll" variant="productivity" />
        <MarineMeasurement x={1080} y={615} value="0.8 m" label="Waves" variant="wave" />
        <MarineMeasurement x={842} y={626} value="8 km/h" label="Wind" variant="wind" />
      </g>

      <g className="intelligence-winds">
        {DEMO_SCENARIO.windVectors.map((wind, index) => {
          const { x, y } = projectPoint(wind.coordinates)
          return (
            <g
              className="intelligence-wind"
              key={`${wind.coordinates.join('-')}-${index}`}
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${wind.heading})`}
            >
              <path d="M -13 0 C -5 -1 4 1 13 0 M 8 -4 L 13 0 L 8 4" />
            </g>
          )
        })}
      </g>

      <g className="intelligence-caution">
        <path className="intelligence-caution__fill" d={cautionPath} />
        <path className="intelligence-caution__line" d={cautionPath} pathLength="100" />
        <g className="intelligence-caution__label" transform="translate(720 550)">
          <circle r="2" />
          <text x="10" y="4">Conditions weaken later</text>
        </g>
      </g>

      <g className="intelligence-source-ticks">
        {[0, 1, 2, 3].map((tick) => (
          <g key={tick} transform={`translate(${944 + tick * 34} ${688 - tick * 7})`}>
            <circle r="4" />
            <path d="M -1.8 0 L -0.2 1.7 L 2.3 -1.8" />
          </g>
        ))}
      </g>
    </g>
  )
}

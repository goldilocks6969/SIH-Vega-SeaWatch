import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AgentDock } from './AgentDock'
import { ConversationIntelligenceLayer } from './ConversationIntelligenceLayer'
import { CycloneInspector } from './CycloneInspector'
import { CycloneSystem } from './CycloneSystem'
import { HeroAnswer } from './HeroAnswer'
import { HeroComposer, type DemoLanguage } from './HeroComposer'
import { MapControls } from './MapControls'
import { ObjectInspector } from './ObjectInspector'
import { OperationalAlert } from './OperationalAlert'
import { OceanSelection } from './OceanSelection'
import { PortMarker } from './PortMarker'
import { SeaWatchWordmark } from './SeaWatchWordmark'
import { VesselMarker } from './VesselMarker'
import {
  AREA_SCENARIO,
  FISHING_SCENARIO,
  RESTING_SUGGESTIONS,
  createVesselScenario,
  type ConversationScenario,
} from '../data/conversationScenarios'
import { DEMO_SCENARIO } from '../data/demoScenario'
import {
  createCoastlinePath,
  KERALA_COASTLINE,
  MAP_LABELS,
  MAP_VIEWBOX,
  OFFSHORE_BOUNDARY,
  projectPoint,
} from '../data/geography'
import { CYCLONE } from '../data/hazards'
import { PORTS } from '../data/ports'
import { VESSELS, VESSEL_TYPE_LABELS, type Vessel } from '../data/vessels'
import {
  AFFECTED_VESSEL_IDS,
  AFFECTED_VESSELS_SCENARIO,
  DISASTER_ASSESSMENT_SCENARIO,
} from '../data/disasterScenarios'
import {
  useConversationRouter,
  type ConversationObject,
} from '../hooks/useConversationRouter'
import { useDemoOrchestration } from '../hooks/useDemoOrchestration'

const coastlinePath = createCoastlinePath(KERALA_COASTLINE)
const landPath = `${coastlinePath} L ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height} L ${MAP_VIEWBOX.width} 0 Z`
const offshoreBoundaryPath = createCoastlinePath(OFFSHORE_BOUNDARY)
const defaultFocus = projectPoint(DEMO_SCENARIO.focusLocation)

type SelectedArea = { id: number; x: number; y: number }

function headingLabel(heading: number) {
  const labels = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest']
  return labels[Math.round((((heading % 360) + 360) % 360) / 45) % 8]
}

export function SeaWatchMap() {
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null)
  const [openInspector, setOpenInspector] = useState<ConversationObject | null>(null)
  const [contextObject, setContextObject] = useState<ConversationObject | null>(null)
  const [previousScenarioId, setPreviousScenarioId] = useState<string | null>(null)
  const [lastScenario, setLastScenario] = useState<ConversationScenario | null>(null)
  const [hasRecommendation, setHasRecommendation] = useState(false)
  const [language, setLanguage] = useState<DemoLanguage>('en')
  const [alertDismissed, setAlertDismissed] = useState(false)
  const autoRunStarted = useRef(false)
  const { state, reducedMotion, run, reset, preview } = useDemoOrchestration()
  const busy = state.phase !== 'idle' && state.phase !== 'answered'
  const operationalView = lastScenario?.id.startsWith('disaster-') ?? false

  const conversationContext = useMemo(() => ({
    inspectedObject: contextObject,
    previousScenarioId,
    hasSelectedArea: selectedArea !== null,
    hasRecommendation,
    operationalView,
  }), [contextObject, hasRecommendation, operationalView, previousScenarioId, selectedArea])
  const route = useConversationRouter(conversationContext)

  const establishFocus = useCallback(() => {
    setSelectedArea((current) => ({
      id: (current?.id ?? 0) + 1,
      x: current?.x ?? defaultFocus.x,
      y: current?.y ?? defaultFocus.y,
    }))
  }, [])

  const runQuestion = useCallback((query: string, scenarioOverride?: ConversationScenario) => {
    const scenario = scenarioOverride ?? route(query)
    setOpenInspector(null)
    setPreviousScenarioId(scenario.id)
    setLastScenario(scenario)
    if (scenario.intent === 'FISHING' || scenario.intent === 'WHY_FISHING_ZONE' || scenario.intent === 'AFTER_NINE') {
      setHasRecommendation(true)
      establishFocus()
    }
    if (scenario.intent === 'AREA_ANALYSIS' && !selectedArea) establishFocus()
    run(scenario, query)
  }, [establishFocus, route, run, selectedArea])

  const resetToCalm = useCallback(() => {
    reset()
    setSelectedArea(null)
    setOpenInspector(null)
    setContextObject(null)
    setPreviousScenarioId(null)
    setLastScenario(null)
    setHasRecommendation(false)
    setAlertDismissed(false)
  }, [reset])

  const selectOceanArea = (event: ReactPointerEvent<SVGRectElement>) => {
    const svg = event.currentTarget.ownerSVGElement
    const screenMatrix = svg?.getScreenCTM()
    if (!svg || !screenMatrix) return

    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const mapPoint = point.matrixTransform(screenMatrix.inverse())
    reset()
    setOpenInspector(null)
    setContextObject(null)
    setLastScenario(null)
    setPreviousScenarioId(null)
    setHasRecommendation(false)
    setSelectedArea((current) => ({
      id: (current?.id ?? 0) + 1,
      x: mapPoint.x,
      y: mapPoint.y,
    }))
  }

  const closeInspectorWithFocus = useCallback(() => {
    const closing = openInspector
    setOpenInspector(null)
    requestAnimationFrame(() => {
      if (closing?.type === 'cyclone') document.querySelector<SVGGElement>('.cyclone-system')?.focus()
      if (closing?.type === 'vessel') document.querySelector<SVGGElement>(`[data-vessel-id="${closing.vessel.id}"]`)?.focus()
      if (closing?.type === 'fishing-zone') document.querySelector<SVGGElement>('.intelligence-zone--interactive')?.focus()
    })
  }, [openInspector])

  const inspectObject = useCallback((object: ConversationObject) => {
    setOpenInspector((current) =>
      current?.type === object.type &&
      (object.type !== 'vessel' || (current.type === 'vessel' && current.vessel.id === object.vessel.id))
        ? null
        : object,
    )
    setContextObject(object)
  }, [])

  useEffect(() => {
    if (autoRunStarted.current) return
    const search = new URLSearchParams(window.location.search)
    const demo = search.get('demo')
    if (demo !== 'hero' && demo !== 'disaster') return

    const previewState = search.get('state')
    const delay = demo === 'disaster' && (previewState === 'peak' || previewState === 'final') ? 0 : 760
    const timer = window.setTimeout(() => {
      if (autoRunStarted.current) return
      autoRunStarted.current = true
      if (demo === 'hero') {
        runQuestion(DEMO_SCENARIO.query, FISHING_SCENARIO)
        return
      }
      if (previewState === 'peak' || previewState === 'final') {
        setPreviousScenarioId(DISASTER_ASSESSMENT_SCENARIO.id)
        setLastScenario(DISASTER_ASSESSMENT_SCENARIO)
        preview(DISASTER_ASSESSMENT_SCENARIO, previewState)
        return
      }
      runQuestion('Assess coastal impact from this cyclone.', DISASTER_ASSESSMENT_SCENARIO)
    }, delay)
    return () => window.clearTimeout(timer)
  }, [preview, runQuestion])

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'r') {
        runQuestion(DEMO_SCENARIO.query, FISHING_SCENARIO)
        return
      }
      if (
        event.key === 'Escape' &&
        !openInspector &&
        !document.querySelector('.agent-popover, .evidence-popover')
      ) {
        resetToCalm()
      }
    }
    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [openInspector, resetToCalm, runQuestion])

  const activeVessel: Vessel | null = contextObject?.type === 'vessel' ? contextObject.vessel : null
  const openVessel = openInspector?.type === 'vessel' ? openInspector.vessel : null
  const fishingInteractive =
    hasRecommendation &&
    state.phase === 'answered' &&
    ['fishing', 'why-fishing', 'after-nine'].includes(state.visualization ?? '')
  const operationalVesselsVisible =
    state.visualization === 'affected-vessels' ||
    ((state.visualization === 'disaster' || state.visualization === 'disaster-why') &&
      ['safety', 'peak'].includes(state.evidenceStage))
  const cycloneOperationallyFocused = [
    'disaster',
    'disaster-why',
    'forecast-update',
    'disaster-watch',
  ].includes(state.visualization ?? '')
  const suggestions = openInspector?.type === 'cyclone'
    ? ['Assess coastal impact']
    : openInspector?.type === 'vessel'
      ? [`What conditions is ${openInspector.vessel.name} heading into?`]
      : openInspector?.type === 'fishing-zone'
        ? ['Why this area?', 'What changes after 9 AM?']
        : lastScenario?.suggestions ?? RESTING_SUGGESTIONS

  return (
    <main
      className={`seawatch-map seawatch-map--${state.phase} seawatch-map--visual-${state.visualization ?? 'none'}${reducedMotion ? ' seawatch-map--reduced-motion' : ''}`}
      aria-label="SeaWatch map of the Kerala coast"
    >
      <div className="ocean" aria-hidden="true">
        <div className="ocean__field ocean__field--west motion-water-field--primary" />
        <div className="ocean__field ocean__field--south motion-water-field--secondary" />
        <div className="ocean__current ocean__current--north" />
        <div className="ocean__current ocean__current--central" />
        <div className="ocean__current ocean__current--south" />
        <svg className="ocean__bathymetry" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path className="ocean__depth ocean__depth--west" d="M -120 20 C 120 72 298 184 364 330 C 432 482 364 654 174 772 C 70 836 -36 860 -120 844 Z" />
          <path className="ocean__depth ocean__depth--central" d="M 122 166 C 356 90 616 150 754 326 C 864 468 822 650 650 766 C 468 886 202 822 88 650 C -14 498 2 270 122 166 Z" />
          <path className="ocean__shelf" d="M 924 -30 C 960 108 1012 226 1082 348 C 1160 484 1168 610 1208 740 C 1232 818 1290 878 1360 930" />
          <path className="ocean__depth-line ocean__depth-line--one" d="M -30 166 C 236 102 520 182 656 364 C 746 484 726 624 610 754" />
          <path className="ocean__depth-line ocean__depth-line--two" d="M 92 76 C 378 22 694 144 824 350 C 916 496 894 662 778 816" />
        </svg>
      </div>

      <svg
        className="map-geography"
        viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-labelledby="map-title map-description"
      >
        <title id="map-title">Kochi and the Kerala coast</title>
        <desc id="map-description">
          A conversational regional ocean map where questions resolve into geographic evidence.
        </desc>

        <rect className="map-geography__ocean-input" width={MAP_VIEWBOX.width} height={MAP_VIEWBOX.height} onPointerDown={selectOceanArea} aria-label="Select a marine area" />
        <path className="map-geography__shore-water" d={coastlinePath} />
        <path className="map-geography__land" d={landPath} fillRule="evenodd" />
        <path className="map-geography__coastline" d={coastlinePath} />
        <path className="map-geography__boundary" d={offshoreBoundaryPath} />

        <ConversationIntelligenceLayer
          key={`intelligence-${state.runId}`}
          stage={state.evidenceStage}
          visualization={state.visualization}
          selectedPoint={selectedArea}
          vessel={activeVessel}
          fishingInteractive={fishingInteractive}
          fishingSelected={openInspector?.type === 'fishing-zone'}
          onFishingSelect={() => inspectObject({ type: 'fishing-zone' })}
        />

        {selectedArea && (
          <OceanSelection
            key={`selection-${selectedArea.id}`}
            x={selectedArea.x}
            y={selectedArea.y}
            showAction={!busy && state.phase !== 'answered'}
            onAnalyze={() => runQuestion('Analyze this selected marine area', AREA_SCENARIO)}
          />
        )}

        <CycloneSystem
          cyclone={CYCLONE}
          selected={openInspector?.type === 'cyclone' || state.visualization === 'cyclone' || cycloneOperationallyFocused}
          onSelect={() => inspectObject({ type: 'cyclone' })}
        />
        {PORTS.map((port) => (
          <PortMarker
            key={`port-${port.id}`}
            port={port}
            emphasized={operationalView && port.id === 'kochi' && state.evidenceStage !== 'none'}
          />
        ))}
        {VESSELS.map((vessel) => (
          <VesselMarker
            key={`vessel-${vessel.id}`}
            vessel={vessel}
            selected={openVessel?.id === vessel.id || (state.visualization === 'vessel' && activeVessel?.id === vessel.id)}
            emphasized={operationalVesselsVisible && AFFECTED_VESSEL_IDS.includes(vessel.id as typeof AFFECTED_VESSEL_IDS[number])}
            onSelect={() => inspectObject({ type: 'vessel', vessel })}
          />
        ))}

        <text className="map-label map-label--sea" x="390" y="450">Arabian Sea</text>
        {MAP_LABELS.map((label) => {
          const { x, y } = projectPoint(label.coordinates)
          return (
            <g className="map-place" key={label.name} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <circle className="map-place__dot" r="2.7" />
              <text className="map-label map-label--place" x="12" y="4">{label.name}</text>
            </g>
          )
        })}
      </svg>

      <header className="product-identity"><SeaWatchWordmark /></header>
      <MapControls />

      {openInspector?.type === 'cyclone' && (
        <CycloneInspector
          cyclone={CYCLONE}
          onClose={closeInspectorWithFocus}
          onAssess={() => runQuestion('Assess coastal impact from this cyclone.', DISASTER_ASSESSMENT_SCENARIO)}
        />
      )}

      {openVessel && (
        <ObjectInspector
          kind="vessel"
          eyebrow="Marine object · mock data"
          title={openVessel.name}
          subtitle={VESSEL_TYPE_LABELS[openVessel.type]}
          details={[
            { label: 'Speed', value: `${openVessel.speed.toFixed(1)} kn` },
            { label: 'Heading', value: headingLabel(openVessel.heading) },
            { label: 'Status', value: 'Underway' },
          ]}
          actionLabel="Ask SeaWatch about this"
          onClose={closeInspectorWithFocus}
          onAsk={() => runQuestion(
            `What conditions is ${openVessel.name} heading into?`,
            createVesselScenario(openVessel),
          )}
        />
      )}

      {openInspector?.type === 'fishing-zone' && (
        <ObjectInspector
          kind="fishing-zone"
          eyebrow="Recommended area · mock intelligence"
          title="Promising fishing zone"
          details={[
            { label: 'Best window', value: '6:30–9:00 AM' },
            { label: 'Ocean', value: 'Productive conditions' },
            { label: 'Waves', value: 'Moderate' },
            { label: 'Confidence', value: 'Good' },
          ]}
          actionLabel="Why this area?"
          onClose={closeInspectorWithFocus}
          onAsk={() => runQuestion('Why this area?')}
        />
      )}

      {state.answer && state.answerStep > 0 && lastScenario && (
        <HeroAnswer
          key={state.runId}
          answer={state.answer}
          step={state.answerStep}
          sources={lastScenario.sources}
          language={state.scenarioId === 'marine-safety-ml' ? 'ml' : 'en'}
          decisionCue={lastScenario.decisionCue}
          actionLabel={lastScenario.actionLabel}
          onAction={lastScenario.actionLabel ? () => runQuestion('Which vessels are exposed?', AFFECTED_VESSELS_SCENARIO) : undefined}
        />
      )}

      {operationalView && (
        <div className="operational-context" aria-label="Coastal operations view">
          <span>Coastal operations</span>
          <small>Mock decision support</small>
        </div>
      )}

      {new URLSearchParams(window.location.search).get('demo') === 'alert' && !alertDismissed && state.phase === 'idle' && (
        <OperationalAlert
          onDismiss={() => setAlertDismissed(true)}
          onAssess={() => runQuestion('Assess coastal impact from this cyclone.', DISASTER_ASSESSMENT_SCENARIO)}
        />
      )}

      <AgentDock
        statuses={state.agentStatuses}
        connections={state.connections}
        active={busy}
        relevantAgents={state.relevantAgents}
        activityLabels={state.activityLabels}
      />
      <HeroComposer
        key={`${state.runId}-${language}-${openInspector?.type ?? 'none'}`}
        phase={state.phase}
        submittedQuery={state.submittedQuery}
        acknowledged={state.composerAcknowledged}
        onSubmit={runQuestion}
        suggestions={suggestions}
        language={language}
        onLanguageChange={setLanguage}
        initialValue={state.submittedQuery}
      />

      <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {state.statusMessage}
      </p>
    </main>
  )
}

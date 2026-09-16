import type { ScenarioVisualization } from '../data/conversationScenarios'
import { DEMO_SCENARIO } from '../data/demoScenario'
import { projectPoint } from '../data/geography'
import { CYCLONE } from '../data/hazards'
import type { Vessel } from '../data/vessels'
import type { EvidenceStage } from '../hooks/useDemoOrchestration'
import { HeroIntelligenceLayer } from './HeroIntelligenceLayer'
import { MarineMeasurement } from './MarineMeasurement'
import { DisasterIntelligenceLayer } from './DisasterIntelligenceLayer'

type SelectedPoint = { x: number; y: number }

type ConversationIntelligenceLayerProps = {
  stage: EvidenceStage
  visualization: ScenarioVisualization | null
  selectedPoint: SelectedPoint | null
  vessel: Vessel | null
  fishingInteractive: boolean
  fishingSelected: boolean
  onFishingSelect: () => void
}

const cyclonePoint = projectPoint(CYCLONE.centre)
const kochiPoint = projectPoint([76.2673, 9.9312])
const defaultFocus = projectPoint(DEMO_SCENARIO.focusLocation)

function stageClass(stage: EvidenceStage) {
  const order: EvidenceStage[] = ['none', 'base', 'expanded', 'safety', 'peak', 'receding', 'final']
  const index = order.indexOf(stage)
  return [
    index >= 1 ? 'conversation-intelligence--has-base' : '',
    index >= 2 ? 'conversation-intelligence--has-expanded' : '',
    index >= 3 ? 'conversation-intelligence--has-safety' : '',
    index >= 4 ? 'conversation-intelligence--has-peak' : '',
    stage === 'receding' || stage === 'final' ? 'conversation-intelligence--settled' : '',
  ].filter(Boolean).join(' ')
}

export function ConversationIntelligenceLayer({
  stage,
  visualization,
  selectedPoint,
  vessel,
  fishingInteractive,
  fishingSelected,
  onFishingSelect,
}: ConversationIntelligenceLayerProps) {
  if (
    visualization === 'fishing' ||
    visualization === 'why-fishing' ||
    visualization === 'after-nine'
  ) {
    return (
      <HeroIntelligenceLayer
        stage={stage}
        mode="hero"
        variant={visualization}
        interactive={fishingInteractive}
        selected={fishingSelected}
        onSelect={onFishingSelect}
      />
    )
  }

  if (!visualization || visualization === 'none') return null

  if (
    visualization === 'disaster' ||
    visualization === 'disaster-why' ||
    visualization === 'affected-vessels' ||
    visualization === 'forecast-update' ||
    visualization === 'disaster-watch'
  ) {
    return <DisasterIntelligenceLayer stage={stage} visualization={visualization} />
  }

  const focus = selectedPoint ?? defaultFocus
  const vesselPoint = vessel ? projectPoint(vessel.coordinates) : null
  const vesselHeading = vessel?.heading ?? 0
  const headingRadians = vessel ? ((vessel.heading - 90) * Math.PI) / 180 : 0
  const routeEnd = vesselPoint
    ? {
        x: vesselPoint.x + Math.cos(headingRadians) * 170,
        y: vesselPoint.y + Math.sin(headingRadians) * 170,
      }
    : null

  return (
    <g
      className={`conversation-intelligence conversation-intelligence--${visualization} conversation-intelligence--${stage} ${stageClass(stage)}`}
      aria-hidden="true"
    >
      {(visualization === 'area' || visualization === 'general') && (
        <g className="conversation-area" transform={`translate(${focus.x.toFixed(1)} ${focus.y.toFixed(1)})`}>
          <path className="conversation-field conversation-field--favorable" d="M -104 -10 C -72 -72 32 -82 102 -30 C 132 4 86 68 12 76 C -62 82 -120 48 -104 -10 Z" />
          <path className="conversation-contour" d="M -112 10 C -72 -86 54 -94 122 -24 C 150 28 86 86 -6 94 C -82 94 -136 58 -112 10 Z" pathLength="100" />
          <MarineMeasurement x={-82} y={-48} value="27.2°" label="Sea surface" variant="ocean" />
          <MarineMeasurement x={44} y={-52} value="0.9 m" label="Waves" variant="wave" />
          <MarineMeasurement x={58} y={58} value="9 km/h" label="Wind" variant="wind" />
          <g className="conversation-note" transform="translate(-76 66)"><circle r="2" /><text x="9" y="4">No significant warning</text></g>
        </g>
      )}

      {visualization === 'marine-safety' && (
        <g className="conversation-safety">
          <path className="conversation-field conversation-field--favorable" d="M 742 398 C 804 346 932 354 1018 420 C 1058 478 1014 552 912 574 C 812 584 730 508 742 398 Z" />
          <path className="conversation-field conversation-field--caution" d="M 470 522 C 568 456 714 472 790 550 C 826 608 758 674 642 680 C 536 674 456 614 470 522 Z" />
          <path className="conversation-time-arrow" d="M 914 502 C 814 526 734 554 652 596" />
          <g className="conversation-note conversation-note--strong" transform="translate(862 434)"><circle r="2" /><text x="9" y="4">Early · favorable window</text></g>
          <g className="conversation-note" transform="translate(548 620)"><circle r="2" /><text x="9" y="4">Later · caution builds</text></g>
          <MarineMeasurement x={790} y={486} value="0.9 m" label="Waves early" variant="wave" />
          <MarineMeasurement x={650} y={548} value="14 km/h" label="Building later" variant="wind" />
        </g>
      )}

      {visualization === 'high-waves' && (
        <g className="conversation-high-waves">
          <path className="conversation-field conversation-field--wave-risk" d="M 286 330 C 366 258 510 264 586 346 C 624 410 562 472 448 478 C 342 472 258 414 286 330 Z" />
          <path className="conversation-field conversation-field--wave-risk conversation-field--wave-risk-secondary" d="M 486 588 C 548 536 660 542 720 604 C 738 656 678 700 590 696 C 518 690 464 644 486 588 Z" />
          <path className="conversation-contour conversation-contour--risk" d="M 270 346 C 346 242 522 244 608 338 C 654 414 576 496 444 500 C 326 492 238 420 270 346 Z" pathLength="100" />
          <MarineMeasurement x={404} y={350} value="1.8–2.2 m" label="After 2 PM" variant="wave" />
          <g className="conversation-note" transform="translate(520 634)"><circle r="2" /><text x="9" y="4">Building through afternoon</text></g>
        </g>
      )}

      {visualization === 'cyclone' && (
        <g className="conversation-cyclone-context">
          <path className="conversation-cyclone-corridor" d={`M ${cyclonePoint.x.toFixed(1)} ${cyclonePoint.y.toFixed(1)} C 496 522 622 470 ${kochiPoint.x.toFixed(1)} ${kochiPoint.y.toFixed(1)}`} />
          <path className="conversation-cyclone-approach" d={`M ${cyclonePoint.x.toFixed(1)} ${cyclonePoint.y.toFixed(1)} C 542 486 780 454 ${kochiPoint.x.toFixed(1)} ${kochiPoint.y.toFixed(1)}`} pathLength="100" />
          <ellipse className="conversation-coastal-influence" cx="1025" cy="485" rx="128" ry="180" transform="rotate(-12 1025 485)" />
          <g className="conversation-note conversation-note--strong" transform="translate(760 430)"><circle r="2" /><text x="9" y="4">Closest approach remains offshore</text></g>
          <g className="conversation-note" transform="translate(960 602)"><circle r="2" /><text x="9" y="4">Coastal winds may strengthen later</text></g>
        </g>
      )}

      {visualization === 'vessel' && vesselPoint && routeEnd && (
        <g className="conversation-vessel-context">
          <path className="conversation-vessel-route" d={`M ${vesselPoint.x.toFixed(1)} ${vesselPoint.y.toFixed(1)} L ${routeEnd.x.toFixed(1)} ${routeEnd.y.toFixed(1)}`} pathLength="100" />
          <ellipse className="conversation-vessel-ahead" cx={routeEnd.x} cy={routeEnd.y} rx="86" ry="54" transform={`rotate(${vesselHeading} ${routeEnd.x} ${routeEnd.y})`} />
          <g className="conversation-note conversation-note--strong" transform={`translate(${routeEnd.x - 36} ${routeEnd.y - 64})`}><circle r="2" /><text x="9" y="4">Moderate conditions ahead</text></g>
          <g className="conversation-note" transform={`translate(${routeEnd.x - 12} ${routeEnd.y + 46})`}><circle r="2" /><text x="9" y="4">Stronger winds farther west</text></g>
        </g>
      )}
    </g>
  )
}

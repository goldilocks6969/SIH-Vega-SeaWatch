import type { ScenarioVisualization } from '../data/conversationScenarios'
import { projectPoint } from '../data/geography'
import { CYCLONE } from '../data/hazards'
import { VESSELS } from '../data/vessels'
import type { EvidenceStage } from '../hooks/useDemoOrchestration'
import { MarineMeasurement } from './MarineMeasurement'

type DisasterIntelligenceLayerProps = {
  stage: EvidenceStage
  visualization: Extract<ScenarioVisualization, 'disaster' | 'disaster-why' | 'affected-vessels' | 'forecast-update' | 'disaster-watch'>
}

const cyclone = projectPoint(CYCLONE.centre)
const kochi = projectPoint([76.2588, 9.9652])
const affectedVessels = VESSELS.filter((vessel) => ['fv-neeraj', 'samudra-04'].includes(vessel.id))
const malabar = VESSELS.find((vessel) => vessel.id === 'mv-malabar')

function stageClass(stage: EvidenceStage) {
  const order: EvidenceStage[] = ['none', 'base', 'expanded', 'safety', 'peak', 'receding', 'final']
  const index = order.indexOf(stage)
  return [
    index >= 1 ? 'disaster-intelligence--has-track' : '',
    index >= 2 ? 'disaster-intelligence--has-marine' : '',
    index >= 3 ? 'disaster-intelligence--has-exposure' : '',
    index >= 4 ? 'disaster-intelligence--has-peak' : '',
    stage === 'receding' || stage === 'final' ? 'disaster-intelligence--settled' : '',
  ].filter(Boolean).join(' ')
}

function WindMark({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g className="disaster-wind-mark" transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M -18 0 H 16 M 10 -5 L 16 0 L 10 5" />
    </g>
  )
}

export function DisasterIntelligenceLayer({ stage, visualization }: DisasterIntelligenceLayerProps) {
  const isVesselReview = visualization === 'affected-vessels'
  const isUpdate = visualization === 'forecast-update'

  return (
    <g
      className={`disaster-intelligence disaster-intelligence--${visualization} disaster-intelligence--${stage} ${stageClass(stage)}`}
      aria-hidden="true"
    >
      <g className="disaster-track">
        <path
          className="disaster-track__uncertainty"
          d={`M ${cyclone.x + 5} ${cyclone.y - 13} C 278 684 222 620 112 548 C 70 560 54 606 72 640 C 164 674 241 716 ${cyclone.x + 5} ${cyclone.y + 14} Z`}
        />
        <path
          className="disaster-track__line"
          d={`M ${cyclone.x} ${cyclone.y} C 277 690 221 636 92 598`}
          pathLength="100"
        />
        {[
          { x: cyclone.x, y: cyclone.y, label: 'Now', r: 5.5 },
          { x: 270, y: 686, label: '+6h', r: 4.5 },
          { x: 201, y: 642, label: '+12h', r: 3.8 },
          { x: 105, y: 605, label: '+18h', r: 3.1 },
        ].map((point, index) => (
          <g className={`disaster-track__position disaster-track__position--${index}`} key={point.label} transform={`translate(${point.x} ${point.y})`}>
            <circle r={point.r} />
            <text x={index === 0 ? 10 : -8} y={-11} textAnchor={index === 0 ? 'start' : 'end'}>{point.label}</text>
          </g>
        ))}
        <g className="disaster-track__confidence" transform="translate(126 540)">
          <circle r="2" />
          <text x="9" y="4">Track uncertainty increases after 12h</text>
        </g>
      </g>

      {isUpdate && (
        <g className="disaster-update-comparison">
          <path className="disaster-update-comparison__old" d={`M ${cyclone.x} ${cyclone.y} C 278 688 220 638 94 598`} />
          <path className="disaster-update-comparison__new" d={`M ${cyclone.x} ${cyclone.y} C 430 700 548 655 678 572`} pathLength="100" />
          <text x="132" y="622">Previous projection</text>
          <text x="594" y="620">Updated projection</text>
        </g>
      )}

      <g className="disaster-marine-impact">
        <path className="disaster-field disaster-field--influence" d="M 360 640 C 472 516 686 446 866 480 C 1012 508 1110 610 1080 730 C 1010 824 776 840 572 788 C 446 758 346 706 360 640 Z" />
        <path className="disaster-field disaster-field--waves" d="M 390 674 C 504 562 678 548 820 618 C 894 674 848 766 716 802 C 572 826 416 778 390 674 Z" />
        <path className="disaster-field disaster-field--operations" d="M 838 474 C 926 426 1052 448 1110 532 C 1130 610 1068 684 950 692 C 858 664 806 566 838 474 Z" />
        <path className="disaster-impact-contour" d="M 374 648 C 480 504 700 430 884 472 C 1036 508 1138 620 1092 748" pathLength="100" />
        <MarineMeasurement x={520} y={575} value="2.4–3.1 m" label="Building offshore" variant="wave" />
        <MarineMeasurement x={720} y={520} value="28–36 km/h" label="Stronger later today" variant="wind" />
        <WindMark x={570} y={590} rotate={-18} />
        <WindMark x={664} y={548} rotate={-14} />
        <WindMark x={766} y={516} rotate={-8} />
        <WindMark x={870} y={524} rotate={2} />
        <WindMark x={936} y={580} rotate={12} />
      </g>

      <g className="disaster-coastal-exposure">
        <path className="disaster-coastal-exposure__halo" d="M 1174 388 C 1166 468 1178 528 1194 574 C 1210 626 1212 702 1208 764" />
        <path className="disaster-coastal-exposure__line" d="M 1184 400 C 1174 478 1186 532 1200 576 C 1214 632 1218 696 1214 748" pathLength="100" />
        <g className="disaster-map-note disaster-map-note--exposure" transform="translate(1052 418)"><circle r="2.2" /><text x="10" y="4">Increasing coastal exposure</text></g>
        <g className="disaster-port-note" transform={`translate(${kochi.x - 150} ${kochi.y + 46})`}>
          <path d="M 142 -38 L 118 -12 H 98" />
          <text x="0" y="0" className="disaster-port-note__title">Kochi</text>
          <text x="0" y="16">Marine conditions worsening later</text>
        </g>
        <g className="disaster-decision-window" transform="translate(1018 704)">
          <circle r="2.2" />
          <text x="10" y="-2" className="disaster-decision-window__title">Decision window</text>
          <text x="10" y="13">Review departures before 2 PM</text>
        </g>
      </g>

      <g className="disaster-operations">
        {affectedVessels.map((vessel, index) => {
          const point = projectPoint(vessel.coordinates)
          const above = index === 1
          return (
            <g className={`disaster-vessel-note disaster-vessel-note--${vessel.id}`} key={vessel.id} transform={`translate(${point.x} ${point.y})`}>
              <circle className="disaster-vessel-note__ring" r="18" />
              <path d={above ? 'M 12 -12 L 31 -31 H 42' : 'M 13 10 L 31 29 H 42'} />
              <text x="47" y={above ? -34 : 25} className="disaster-vessel-note__title">{vessel.name}</text>
              <text x="47" y={above ? -19 : 40}>{vessel.id === 'fv-neeraj' ? 'Higher waves ahead' : 'Near coastal influence'}</text>
            </g>
          )
        })}
        {malabar && (() => {
          const point = projectPoint(malabar.coordinates)
          return (
            <g className="disaster-vessel-note disaster-vessel-note--outside" transform={`translate(${point.x} ${point.y})`}>
              <path d="M 10 -9 L 25 -23 H 36" />
              <text x="41" y="-26" className="disaster-vessel-note__title">MV Malabar</text>
              <text x="41" y="-11">Outside primary impact</text>
            </g>
          )
        })()}
        <g className="disaster-map-note disaster-map-note--operations" transform="translate(846 442)"><circle r="2.2" /><text x="10" y="4">Marine operations exposed</text></g>
      </g>

      <g className="disaster-peak-evidence">
        <circle cx="938" cy="474" r="3.5" />
        <path d="M 941 472 L 956 458 H 972" />
        <text x="978" y="454" className="disaster-peak-evidence__title">Forecast confidence</text>
        <text x="978" y="469">Moderate · mock assessment</text>
      </g>

      {isVesselReview && <text className="disaster-review-label" x="846" y="430">Affected vessel review</text>}
    </g>
  )
}

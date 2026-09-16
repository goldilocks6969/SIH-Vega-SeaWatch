# SeaWatch Hero Experience

> Phase 7 generalizes this signature sequence into a deterministic intent system while retaining the same visual language. See `CONVERSATIONAL_OCEAN.md` for the current interaction contract.

Phase 6 establishes one deterministic demonstration: **“Where should I go fishing tomorrow morning?”** It is intentionally not a general chat system. The sequence is a local, timer-driven prototype with no API, LLM, live feed, or network dependency.

## Composition

The scene has four perceived planes: the living ocean and coast; geographic intelligence embedded in the water; temporary selection and agent activity; and the concise answer plus composer. The map stays dominant throughout.

The desktop composer is 360–460px wide and 52px high. It uses a warm raised surface, one text field, one microphone action, and one send action. The single initial suggestion executes the hero path directly. After an answer it disappears and the placeholder becomes “Ask a follow-up…”.

## First load

The base water is immediate. Coastline resolves at roughly 100ms, labels at 180ms, ports and vessels at 260ms, cyclone at 340ms, identity and map controls at 430ms, agent dock at 520ms, composer at 620ms, and the single suggestion at 720ms. Entrances overlap and use only opacity plus a few pixels of travel.

## Orchestration timeline

| Time | Choreography |
| ---: | --- |
| 0ms | Query accepted; an existing selection is reused or an offshore Kochi focus is established |
| 150ms | Composer acknowledges submission |
| 350ms | Planner begins |
| 650ms | Planner starts transferring context to Fishing (or Geo in area analysis) |
| 950ms | Planner starts transferring context to Ocean |
| 1250ms | Planner starts transferring context to Weather |
| 1350ms | The primary role wakes after its transfer arrives |
| 1650ms | Ocean wakes after its transfer arrives |
| 1950ms | Weather wakes; Planner completes |
| 2100ms | Recommended fishing geography begins resolving |
| 2400ms | Ocean-condition contours, measurements, and winds emerge |
| 2850ms | Weather starts passing context to Safety |
| 3100ms | Ocean follows 250ms later, creating a readable convergence |
| 3550ms | The primary role completes |
| 3800ms | Safety wakes after both transfers arrive; caution resolves |
| 3850ms | Ocean completes |
| 4050ms | Evidence begins freshness and agreement checks |
| 4100ms | Weather completes |
| 4200ms | Source validation begins resolving |
| 4650ms | The complete analytical state begins its uninterrupted hold |
| 4850ms | Safety completes |
| 5300ms | Evidence completes; secondary analytical detail begins receding |
| 5850ms | Conclusion rises into view |
| 6010ms | Supporting sentence follows |
| 6170ms | Source freshness appears |
| 6420ms | Answer is settled |
| 6700ms | Dock returns to rest |

## Geographic evidence

- The opportunity zone is an organic, thin-edged marine-green area with a quieter internal core. It resolves spatially rather than arriving as a generic polygon or heatmap.
- Ocean conditions use two low-opacity, flat marine contours with hairline edges—no rainbow scale and no false precision.
- Seven fine wind marks resolve once in locally aligned directions. They do not continue animating.
- A restrained amber offshore influence shows why later conditions are less favorable without turning the view into a warning state.

The fully resolved analytical peak holds from 4650ms until 5300ms. At recede, wind detail softens first, measurements and source validation follow, then condition contours and agent emphasis settle. The recommendation, selection, and meaningful caution remain prominent.

## Answer and evidence

The final answer is an open, compact 390px surface positioned away from the selected geography. A 26px semibold conclusion leads a 15px supporting sentence and 12px source line. The three parts enter 160ms apart with a 7px rise; the full entrance settles over roughly 560ms, with no bubble, typewriter effect, shimmer, or oversized panel.

The source line opens a 264px temporary evidence popover listing four deterministic sources and their freshness. It closes through its trigger, Escape, or outside pointer and restores keyboard focus after Escape.

## Secondary flow and development controls

“Analyze this area” reuses the same orchestration language with Geo as the primary role and produces a concise area result. `?demo=hero` auto-runs the golden path; pressing `R` on that URL restarts it. `?demo=hero&motion=reduce` is an internal test override for the reduced-motion path.

Reduced motion compresses the semantic state changes into 160ms, removes travel and drawing animations, preserves the final zone and complete answer, and leaves accessible status announcements intact.

## Phase 6.5 art direction

The answer now has one fixed left-middle home at every desktop state. The agent dock sits 16–32px visually above the composer and transfers prominence to or from it according to orchestration phase. The ocean adds grain and three irregular drifting current fields. Straight evidence polygons are rendered as smooth contours with temporary geographic measurements.

The cyclone is keyboard- and pointer-inspectable. Its attached context surface clearly labels all values as mock data, closes by button, outside pointer, or Escape, and restores focus. “Ask SeaWatch about this” fills and focuses the composer with “Will this cyclone affect Kochi?” without pretending to provide a disaster answer.

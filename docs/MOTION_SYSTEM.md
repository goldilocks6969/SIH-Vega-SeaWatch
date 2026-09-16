# SeaWatch Motion System

This document governs motion across future SeaWatch implementations. Motion must explain natural activity, user interaction, analysis, hazard behaviour, specialist work, or a meaningful change in state.

## Core philosophy

**Calm interface. Living ocean.**

Most UI is completely still at rest. Never animate simply because animation is available. Avoid bouncing controls, springy startup-style entrances, large translations, decorative pulses, and simultaneous competing movement.

Prefer opacity, translation of only a few pixels, and extremely subtle scaling. Appearance generally uses ease-out; environmental motion uses a soft ease-in-out curve.

## Timing tokens

| Token | Duration | Intended use |
| --- | ---: | --- |
| `--motion-instant` | 120ms | Direct press or immediate acknowledgement |
| `--motion-fast` | 180ms | Hover, focus, and compact control transitions |
| `--motion-base` | 240ms | Standard state changes and appearances |
| `--motion-slow` | 450ms | Larger contextual transitions |
| `--motion-ripple-primary` | 1550ms | Primary ocean-tap wave |
| `--motion-ripple-secondary` | 1700ms | Softer secondary ocean-tap wave |
| `--motion-environment` | 18s | First low-contrast water field |
| `--motion-environment-long` | 27s | Independent secondary water field |
| `--motion-cyclone` | 32s | One future meteorological rotation |
| `--motion-agent-working` | 2.4s | Restrained future working-state orbit |
| `--motion-agent-collaboration` | 780ms | One ephemeral role-to-role transfer |
| `--motion-vessel-a` | 18s | First subtle vessel drift variant |
| `--motion-vessel-b` | 23s | Second subtle vessel drift variant |
| `--motion-vessel-c` | 29s | Third subtle vessel drift variant |
| `--motion-weather-field` | 41s | Independent outer weather-field drift |
| `--motion-intelligence-resolve` | 900ms | Geographic evidence resolving into the sea |
| `--motion-intelligence-recede` | 650ms | Ordered removal of secondary geographic evidence |
| `--motion-answer-reveal` | 360ms | Each element in the staggered answer entrance |

Delays for the signature ripple are defined separately:

- `--motion-ripple-primary-delay`: 72ms
- `--motion-ripple-secondary-delay`: 250ms
- `--motion-selection-settle-delay`: 620ms
- `--motion-selection-action-delay`: 740ms

## Easing

- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — natural deceleration for appearing and responding UI.
- `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` — quiet state-to-state transitions.
- `--ease-environment: cubic-bezier(0.45, 0.05, 0.55, 0.95)` — slow environmental drift.
- `--ease-ripple: cubic-bezier(0.16, 0.62, 0.18, 1)` — prompt water response with a longer, more perceptible middle and tail.
- Linear motion is reserved for extremely slow environmental rotation where speed should remain meteorologically even.

There are no elastic or bounce easings in the system.

## Water motion

The future water field uses two or three enormous, extremely low-contrast tonal or texture fields. Each drifts independently over a long duration with sub-one-percent translation and sub-one-percent scale change.

The water must not look like a looping video, cartoon waves, a particle field, visible shimmer, a constant pulse, or an obvious repeating gradient. The animation should be noticed indirectly after several seconds rather than read immediately as an effect.

Foundation utilities:

- `.motion-water-field--primary` — 18-second, low-amplitude horizontal and diagonal drift.
- `.motion-water-field--secondary` — 27-second counter-drift with a slightly different scale.

These utilities define movement only. Texture, opacity, field size, and final map composition belong to the future map phase.

## Vessel motion

Visible vessels use one of three slow alternating translations: 18, 23, or 29 seconds. Each path travels only four to six pixels end to end, retains the vessel’s heading, and has no trail, bounce, or abrupt reset. In reduced-motion mode, every vessel remains in its deterministic static position.

## Signature ocean ripple

The ripple is a finite disturbance travelling through water, not sonar, radar, a location pulse, or a generic material button ripple.

| Time | Behaviour |
| ---: | --- |
| 0ms | Immediate, small elliptical water response acknowledges the tap |
| 72ms | The 1550ms primary wave fragment begins; it expands to a 108px horizontal radius |
| 250ms | The 1700ms secondary wave fragment begins; it expands to a 124px horizontal radius at substantially lower opacity |
| 620ms | An irregular selected-area zone starts settling into place |
| 740ms | The contextual “Analyze this area” action starts appearing over 240ms |
| ~1622ms | The primary physical wave has dissipated |
| ~1950ms | The secondary wave has dissipated; the selected area remains still |

Both incomplete elliptical waves use `cubic-bezier(0.16, 0.62, 0.18, 1)` rather than a generic UI ease. Their transform and opacity animations are finite and never repeat, with enough mid-travel opacity to read as water carrying energy. A restrained 1100ms local water response begins immediately beneath the waves. The persistent state is an irregular, 4.5%-opacity local area with a 0.8px broken boundary and a 2.6px centre point; it does not pulse.

Rapid selections replace the active keyed interaction. Previous waves are cancelled rather than accumulated, so only one marine area remains active. Under reduced motion, the water response and both rings are removed; the stable zone, centre point, and action appear immediately.

## Cyclone motion

A future cyclone remains subtly in motion because it represents a living meteorological phenomenon.

- Build it from a broad, soft spiral or weather structure.
- Keep the outer influence area low contrast.
- Use a slightly stronger muted-coral centre, never a bright red rotating icon.
- Rotate so slowly that perception takes a moment; the foundation uses 32 seconds per turn.
- When expanded, a faint forecast path or cone may appear through a restrained state transition.
- Do not use a spinner, hurricane emoji, glowing vortex, or game-like effect.

The `.motion-cyclone` utility defines slow rotation only; no cyclone visual is built in Phase 1.

The Phase 3 implementation combines the 32-second spiral rotation with a separate 41-second, low-amplitude outer-field drift. The muted core remains steady and never flashes or pulses.

## Agent states

Agents are still when inactive.

| State | Behaviour |
| --- | --- |
| Idle | Completely still |
| Working | A 3px neutral dot travels over a 144-degree perimeter arc over 2.4 seconds, alternating quietly; the icon stays still |
| Completed | A 14px edge check settles over 240ms, then remains still |
| Attention | A static 6px amber edge indicator and restrained border show importance without pulsing |
| Collaboration | One thin curve draws, transfers, and settles over 780ms, then disappears |

Agent hover and keyboard focus use the 180ms interaction timing and a maximum 2px rise. The compact inspection popover appears over 240ms with 5px of vertical travel and no bounce. Never show permanent network diagrams, glowing AI nodes, bouncing avatars, frantic activity, or multiple continuous spinners.

In reduced motion, the working cue becomes a static 5px status dot, the completion mark and popover appear immediately, and the collaboration path becomes a brief static relationship when development preview activates it. Meaning remains available in accessible status labels and popover copy.

## Reduced motion

The global `prefers-reduced-motion: reduce` rule makes animations and transitions effectively immediate, limits animation iteration to one, removes delays, and neutralises transforms on continuous water, cyclone, and agent utilities.

Reduced motion must preserve meaning:

- Selection is represented by a stable selected state rather than an expanding ripple.
- Working and completed states use static icons, labels, or colour-supported status.
- Hazard severity remains legible through shape, copy, and restrained colour.
- Environmental data remains fully available without drift or rotation.

No feature may require motion to be understood.

## Hero orchestration

Phase 6 uses one 6420ms deterministic presentation choreography rather than network-shaped loading. The composer acknowledges at 150ms and Planner begins at 350ms. Planner transfers to the primary specialist, Ocean, and Weather at 650ms, 950ms, and 1250ms; those recipients wake at 1350ms, 1650ms, and 1950ms, after each travelling signal has arrived. Geographic evidence begins at 2100ms and 2400ms. Weather and Ocean converge on Safety at 2850ms and 3100ms, Safety wakes at 3800ms, and Evidence begins at 4050ms. The fully resolved analytical state holds from 4400ms to 5300ms. Complexity then recedes in an ordered 650ms transition. The answer enters at 5850ms, 6010ms, and 6170ms and settles at 6420ms. The dock returns to rest at 6700ms.

The fishing analytical peak is intentionally temporary but no longer fleeting: its final field resolves at 4400ms and holds for 900ms. Receding first softens wind detail, then measurements and source marks, followed by environmental contours and agent states, while retaining the selected focus, recommendation, and caution. The answer begins after the most important secondary detail has cleared. In reduced motion, the same semantic sequence resolves in 160ms without travel, drawing, or continuous agent activity.

## Phase 6.5 layered motion

Ocean current fields drift independently over 31, 37, and 43 seconds with sub-one-percent travel. They complement the existing 18- and 27-second broad tonal fields without becoming animated waves.

Opportunity geometry resolves over 720–900ms, environmental contours over 850–950ms, measurement annotations stagger 130ms apart, and wind marks resolve across roughly 900ms. Caution arrives over 780ms and source checks resolve sequentially over 590ms. Agent collaboration lasts 780ms: the curve draws for roughly 200ms, the emphasis point travels for 350ms, and the relationship fades through the remaining dwell. The cyclone’s inner bands remain at 29 seconds while the asymmetric outer weather mass counter-rotates and drifts over 44 seconds. The forecast corridor remains nearly static.

Reduced motion removes current drift, cyclone rotation, travelling connection signals, and contour travel while preserving the same resting geometry, labels, values, inspector, and final answer.

## Phase 7 conversational pacing

Conversation uses three deterministic pacing classes. Major marine questions retain the 6420ms signature analysis sequence. Contextual follow-ups resolve over 4470ms with fewer specialists and a shorter evidence hold. Unsupported questions use an 820ms brief response and do not simulate unnecessary specialist work.

Submitting a new question cancels the prior sequence immediately, including pending timers and transient collaboration paths. This is the interaction model for interruption: the current map evidence recedes or is replaced, and only the newest scenario may complete. The mock voice path uses a finite listening cue, partial transcript near 900ms, complete transcript near 1500ms, and submission near 1800ms; it never implies real audio capture.

Under reduced motion, every pacing class resolves its semantic state in 160ms, map evidence appears without drawing or travel, the voice cue remains static, and focus behavior is unchanged.

## Phase 8 disaster orchestration

The disaster assessment uses a dedicated 6950ms pacing class. Forecast geography begins at 1400ms; marine influence follows at 2200ms; coastal and operational exposure resolves at 3000ms. Weather, Ocean, and Geo transfer separate consequence signals to Safety between 3400ms and 3900ms. Safety evaluates at 4200ms and hands the combined assessment to Evidence at 4620ms.

The complete analytical state holds from 5000ms through 6000ms. Recede removes temporary measurements, wind marks, the map-level decision cue, and secondary context before the recommendation enters at 6380ms, 6540ms, and 6700ms. Reduced motion preserves the final forecast, uncertainty, exposed objects, decision window, and recommendation while resolving in 160ms.

## Phase 9 final polish

The total fishing and disaster choreographies remain 6420ms and 6950ms. The fishing peak holds for 900ms; the disaster peak holds for 1000ms. Answer elements use a 360ms opacity-and-rise response inside the existing 160ms semantic stagger, so the content feels earned without extending the decision timeline.

Ocean depth fields drift over 48 and 56 seconds with less than one percent translation. Cyclone cloud lobes and blurred bands retain independent 44- and 29-second movement. The full selection response remains finite at 1.95 seconds, while the action becomes usable before the physical wave fully dissipates. Reduced motion removes all continuous drift, rotation, collaboration travel, ripple expansion, and stagger delays while preserving final geometry and copy.

## Implementation source

Timing and easing tokens live in `src/styles/tokens.css`. Keyframes, reusable motion utilities, and the reduced-motion override live in `src/styles/motion.css`.

# Conversational Ocean

Phase 7 turns the map into the primary conversation surface. Questions resolve as geographic evidence, specialist activity, and concise conclusions; the product does not become a generic chat panel.

Everything in this phase is deterministic and local. There is no API, model call, speech recognition, live forecast, or live vessel feed. Values and freshness labels are explicitly prototype data.

Phase 8 adds a disaster-assessment branch to this same router and composer. See `DISASTER_INTELLIGENCE.md` for its operational context, consequence model, and follow-ups.

## Supported intent model

The local router normalizes case, punctuation, whitespace, and hyphenated phrases before matching one of these intents:

| Intent | Example | Spatial response |
| --- | --- | --- |
| Fishing | “Where should I fish tomorrow morning?” | Opportunity zone, conditions, winds, and later caution |
| Cyclone | “Will this cyclone affect Kochi?” | Forecast track, closest approach, and coastal influence |
| Marine safety | “Is it safe to go out tomorrow morning?” | Early favorable field and later caution field |
| Area analysis | “Analyze this area” | Measurements around the selected ocean point |
| High waves | “Show me high-wave areas” | Two offshore risk regions and afternoon wave range |
| Vessel context | “What conditions is this vessel heading into?” | Vessel heading, projected route, and destination conditions |
| General marine | Broad questions about ocean, wind, waves, or weather | General selected-area marine context |

Two contextual follow-ups—“Why this area?” and “What changes after 9 AM?”—use the existing recommendation and prior scenario. An unmatched question receives a brief, honest explanation of the prototype’s supported scope instead of a fabricated answer.

## Objects as conversation entry points

The cyclone, vessels, and recommended fishing zone are keyboard- and pointer-inspectable. Each opens a compact, attached inspector with relevant mock context and an “Ask SeaWatch” action. Escape, outside pointer, and the close button dismiss the inspector; keyboard focus returns to the originating map object.

Clicking open water creates a selected area and exposes “Analyze this area.” Starting a new ocean selection clears stale recommendation context so the next answer reflects the new focus.

## Composer and voice demonstration

The composer supports resting, typing, listening, submitted, working, answered, and follow-up states. It stays editable while work is in progress, allowing a new question to interrupt the current sequence cleanly. At most two suggestions are shown, and they adapt to the last result.

The EN / മലയാളം control changes the mock voice path. Microphone activation is a deterministic demonstration: a restrained five-bar listening cue appears, a partial transcript arrives at about 900ms, the full Malayalam question appears at about 1500ms, and it submits at about 1800ms. No microphone, browser speech service, or audio recording is used. Malayalam strings live in `src/data/localizedDemo.ts` and retain the appropriate `lang="ml"` semantics.

## Orchestration and interruption

Major scenarios retain the deliberate 6420ms analysis rhythm from Phase 6.5. Contextual follow-ups use a shorter 4470ms sequence, while unsupported questions resolve in roughly 820ms. Only specialists relevant to the current intent activate; unrelated roles remain quiet.

Every submission first cancels pending timers and ephemeral agent connections. Rapid question changes therefore replace the active analysis rather than stacking answers, overlays, or collaboration paths. Escape resets the conversation when no temporary inspector or popover owns the key. `?demo=reset` starts from a clean state, and `?motion=reduce` compresses the semantic sequence to 160ms while preserving all final evidence and copy.

## Verification targets

The Phase 7 acceptance set covers the fishing conclusion, fishing-zone evidence follow-up, cyclone conclusion, vessel inspector, and Malayalam listening state. Responsive checks target 1440×900, 1280×800, and 1600×900. Keyboard inspection, focus restoration, interruption, reduced motion, and unsupported-query behavior are part of the expected interaction contract.

# Disaster Intelligence

Phase 8 extends the same SeaWatch ocean into a coastal-operations decision surface. It follows one deterministic story: weather event → coastal consequence → human decision. It is not a dashboard, command-center theme, or separate application.

All conditions, sources, positions, freshness values, and recommendations are mock prototype intelligence. SeaWatch does not issue official warnings, closures, or safety guarantees.

## Entry points

- Inspect the cyclone and choose “Assess coastal impact.”
- Ask “Assess coastal impact” or “What happens if this cyclone moves toward Kochi?”
- Use `?demo=disaster` to auto-run the complete sequence.
- Use `?demo=disaster&state=peak` or `?demo=disaster&state=final` for deterministic visual review.
- Use `?demo=alert` for the calm, spatially anchored forecast-update alert.

The assessment adds a small “Coastal operations · Mock decision support” context label. It does not recolor the application or introduce a permanent role switcher.

## Orchestration

The complete sequence settles at 6950ms.

| Time | Operational event |
| ---: | --- |
| 0ms | Question accepted; previous timers, overlays, and collaboration paths are cleared |
| 400ms | Planner begins understanding the affected area |
| 900ms | Planner transfers cyclone context to Weather |
| 1400ms | Forecast positions and widening uncertainty resolve |
| 1700ms | Weather transfers marine context to Ocean |
| 2200ms | Wave, wind, and marine-influence fields begin resolving |
| 2500ms | Weather transfers geographic context to Geo |
| 3000ms | Exposed coastline, Kochi operations, and affected vessels resolve |
| 3400–3900ms | Weather, Ocean, and Geo converge independently on Safety |
| 4200ms | Safety evaluates the combined operational consequence |
| 4620ms | Safety transfers the assessment to Evidence |
| 4700ms | Evidence checks advisory freshness and uncertainty |
| 5000–6000ms | Full analytical peak is held for narration and comprehension |
| 6000ms | Secondary measurements, winds, and map-level decision detail recede |
| 6380–6700ms | Conclusion, support, decision window, sources, and operational action settle |
| 6950ms | Final operational state |

Fishing remains inactive. The relevant set is Planner, Weather, Ocean, Geo, Safety, and Evidence. Temporary status copy describes semantic work only and never exposes chain-of-thought.

## Geographic consequence model

The map shows four forecast positions—Now, +6h, +12h, and +18h—inside a soft corridor that broadens and fades with time. A linked note states that track uncertainty increases after 12 hours.

An organic marine-influence field connects the weather system to offshore operations. Restrained annotations show mock offshore waves of 2.4–3.1m and later winds of 28–36km/h. Five directional wind marks communicate flow without creating an arrow field.

A narrow feathered coastal band identifies increasing exposure around the relevant Kerala coast. Kochi receives an anchored “Marine conditions worsening later” consequence, without claiming closure or flooding. FV Neeraj and Samudra 04 are identified as affected; MV Malabar is shown outside the primary area for comparison.

At synthesis, detailed measurements and the map-level decision cue recede. The persistent operational answer carries the decision window: review small-vessel departures before 2 PM.

## Inspectable decisions

“Review affected vessels” starts a focused follow-up that reduces environmental emphasis and makes the two affected vessels clearer. The vessels remain keyboard- and pointer-inspectable through the shared object inspector, including Escape dismissal and focus restoration.

Operational context supports:

- “Which vessels are exposed?”
- “Why?” and “Why before 2 PM?”
- “What’s changed?” with previous and updated trajectories
- “What should we watch next?” with emphasis on the post-12-hour uncertainty
- “Will this affect Kochi?” after operational context has been established

The existing six-source evidence popover uses generic mock categories: cyclone advisory, marine weather, wave forecast, coastal warning, vessel positions, and geospatial boundary. It contains no institutional branding and makes no live-data claim.

## Accessibility and state cleanup

Reduced motion resolves the same forecast, uncertainty, consequences, affected entities, recommendation, and action in 160ms without drawing or travelling signals. A new question cancels the active scenario before starting. Escape returns to the calm ocean when no temporary inspector or popover owns the key. Inspectors and evidence popovers restore focus to their triggers.

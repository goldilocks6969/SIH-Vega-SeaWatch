# SeaWatch Design Principles

## Desired character

SeaWatch must feel simple, calm, credible, approachable, spacious, and easy on the eyes. It should feel premium but not luxurious, modern but not futuristic, intelligent without looking like an “AI product,” and understandable without training.

SeaWatch must not feel like a cyberpunk or futuristic command centre, military radar screen, crypto product, stock-trading terminal, generic SaaS analytics dashboard, dense GIS application, children’s application, social-network clone, or science-fiction AI interface.

## Map-first experience

- The ocean is the hero and the map remains the product.
- Land is visually secondary and exists mainly for geographic orientation.
- The default state is sparse; information appears progressively through **tap → inspect → understand → go deeper**.
- Do not use a permanent left sidebar, a default right analytics sidebar, a top row of KPI cards, or a dashboard grid that covers the map.
- Marine intelligence should appear geographically wherever possible.
- The primary experience is designed for an approximately 1440 × 900 laptop viewport, centered on Kochi and the surrounding Kerala coast and Arabian Sea.

## Colour direction

Exact colour tokens are deliberately deferred.

- Primary surfaces: warm off-white, soft white, and very light stone or warm grey.
- Land: desaturated light grey or stone, intentionally lower priority than water.
- Sea: a soft, restrained, moderately desaturated natural marine blue that remains clearly distinct from land.
- Text: dark warm charcoal rather than pure black where possible.
- Critical hazards: muted coral or soft red.
- Caution: amber or ochre.
- Avoid large fields of bright alarm red.
- Strictly avoid neon, cyan, purple, black-heavy UI, glowing gradients, holographic effects, and electric-blue “AI” aesthetics.

## Specialised intelligence

Agents represent reasoning responsibilities, not every dataset. Candidate responsibilities are Planner, Fishing, Ocean, Weather, Safety, Geo, and Evidence.

- Represent agents symbolically with simple marks in circles or similarly soft containers.
- Use restrained differentiation and subtle active or working states.
- Do not use human avatars, robots, cartoon characters, or Bitmojis.
- Collaboration should read as **specialised expertise collaborating**, never as a swarm of AI bots.

## Data sources, tools, and layers

SST, chlorophyll, PFZ, tide, weather, vessel, and geofence feeds are data sources, tools, or map layers—not autonomous agents. The interface may reveal their evidence on demand without pretending each source is intelligent.

## Product behaviour

- The user asks one question of the ocean instead of manually interrogating fragmented datasets.
- The product may use deterministic scripted states; no live APIs, agents, voice, or marine feeds are required for the prototype.
- Evidence and sources should be available on demand without cluttering the default screen.
- Disaster warnings and marine alerts should be immediately understandable.
- Lightweight animation is acceptable only when it genuinely improves comprehension.
- The experience should remain convincing and useful even when every backend capability is simulated.

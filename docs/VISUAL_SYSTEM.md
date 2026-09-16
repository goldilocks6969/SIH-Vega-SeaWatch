# SeaWatch Visual System

This document is the visual foundation for future SeaWatch implementation. It defines the shared language; it does not prescribe a finished screen.

## Core idea

**Calm at rest. Alive when touched.**

The interface is quiet, restrained, and spacious. The ocean, user interaction, changing marine conditions, and brief signs of specialist activity provide the motion and emphasis. Colour communicates geography and meaning rather than decoration.

## Typography

SeaWatch uses the Inter variable family throughout. Normal and italic weights are bundled locally through `@fontsource-variable/inter`; the product does not depend on a remote font service.

```css
font-family:
  'Inter Variable', Inter, 'Noto Sans', 'Noto Sans Malayalam',
  'Noto Sans Devanagari', system-ui, sans-serif;
```

The Noto and system fallbacks prepare the interface for future Malayalam and Devanagari content. Use comfortable line height, sentence case, restrained weight, and normal tracking. Avoid tiny type, habitual uppercase, excessive bold, and wide futuristic letter spacing.

### Hierarchy

| Role | Token | Size | Weight | Guidance |
| --- | --- | ---: | ---: | --- |
| SeaWatch wordmark | `--type-wordmark` | 25px | 550 / 475 italic | Optical pair: upright Sea, italic Watch |
| Major contextual answer | `--type-answer` | 28px | 600 | Use for the main answer, never as a KPI tile |
| Context heading | `--type-heading` | 16px | 600 | Short, descriptive section language |
| Normal UI | `--type-ui` | 15px | 400–500 | Default controls and readable UI copy |
| Contextual measurement | `--type-measurement` | 18px | 500 | Natural readings within geographic context |
| Agent label | `--type-agent` | 12px | 500 | Future specialist labels only |
| Metadata | `--type-meta` | 12px | 400–450 | Sources, freshness, and supporting detail |
| Map label | `--type-map` | 13px | 500 | Geographic labels with concise wording |

### Italic voice

Inter Italic is an observational voice for quiet context such as “Monitoring movement,” “Conditions are changing,” “Updated moments ago,” or “Based on latest observations.” Keep it subtle and infrequent.

Never use italics for warnings, critical information, numeric readings, buttons, primary headings, or navigation labels.

## SeaWatch wordmark

The text wordmark is visually composed as **Sea** + ***Watch*** while remaining one accessible name.

- `Sea`: upright Inter, weight 550.
- `Watch`: Inter Italic, weight 475.
- Size: 25px in the current product canvas.
- Tracking: slightly tightened as a natural wordmark, without decorative spacing.
- No symbol, gradient, all-caps treatment, second font family, or dramatic weight contrast.

The italic supplies a small suggestion of current and movement while keeping the mark calm enough for the future map’s top-left corner.

## Colour palette

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Warm paper | `--color-paper` | `#F6F5F1` | Primary application ground |
| Raised surface | `--color-surface-raised` | `#FBFAF7` | Lightweight floating or raised elements |
| Secondary surface | `--color-surface-secondary` | `#EEECE6` | Quiet separation and selected neutral states |
| Land | `--color-land` | `#DEDED9` | Low-priority geographic land |
| Marine water | `--color-water` | `#78AABD` | Primary water field |
| Deep water | `--color-water-deep` | `#5F92AA` | Restrained depth or emphasis variation |
| Shallow water | `--color-water-shallow` | `#9BC0C7` | Very subtle shallow-water variation |
| Primary text | `--color-text-primary` | `#263238` | Main text without pure black |
| Secondary text | `--color-text-secondary` | `#68777C` | Supporting copy |
| Muted text | `--color-text-muted` | `#8A9699` | Metadata and tertiary labels |
| Hairline | `--color-border-hairline` | `rgba(38, 50, 56, 0.10)` | Lightweight boundaries |
| Opportunity | `--color-opportunity` | `#5F886F` | Positive marine opportunity |
| Caution | `--color-caution` | `#B1813E` | Conditions needing attention |
| Critical | `--color-critical` | `#C96C62` | Hazards and urgent states, used sparingly |

Do not introduce cyan, purple, neon blue, pure-black surfaces, high-saturation red, or electric green. Semantic colours require a supporting label or icon; colour alone must not carry status.

## Surfaces and elevation

SeaWatch is not a collection of cards. Prefer open composition, whitespace, and hairline separators. A surface should exist only when it clarifies hierarchy, grouping, or interaction.

- Use warm light surfaces, `--border-hairline`, and generous padding.
- `--shadow-raised` is the default restrained elevation.
- `--shadow-floating` is reserved for controls that genuinely float above geographic content.
- Avoid nested cards, strong glassmorphism, large translucent panels, heavy blur, and deep shadows.
- Avoid converting every label or value into a pill.

## Spacing

The scale follows a 4px base rhythm:

| Token | Value | Token | Value |
| --- | ---: | --- | ---: |
| `--space-1` | 4px | `--space-2` | 8px |
| `--space-3` | 12px | `--space-4` | 16px |
| `--space-5` | 20px | `--space-6` | 24px |
| `--space-8` | 32px | `--space-10` | 40px |
| `--space-12` | 48px | `--space-16` | 64px |

Do not compress controls merely because the map offers limited clear space. Whitespace is functional: it protects comprehension and keeps the ocean visually dominant.

## Radius

| Token | Value | Intended use |
| --- | ---: | --- |
| `--radius-small` | 8px | Compact, contained details |
| `--radius-medium` | 12px | Standard controls and light surfaces |
| `--radius-large` | 18px | Larger contextual surfaces |
| `--radius-floating` | 22px | Occasional floating map controls |
| `--radius-circle` | 50% | Agent and map controls that must be circular |

Moderate radius supports approachability. Do not make every container fully rounded.

## Iconography

Use Lucide React for functional iconography. The default range is 16–20px with consistent stroke widths. Icons are functional and outline-based, never filled cartoon illustrations. Phase 3 uses the Anchor symbol for permanent port locations; vessel silhouettes remain custom top-down geographic marks. Future agents may receive simple symbolic Lucide identities, but no agent identity is defined yet.

## Measurements

Measurements belong inside geographic context and explanatory language; they are not oversized dashboard KPIs.

- Use `font-variant-numeric: tabular-nums` when values change or align vertically.
- Keep the number and unit together: `28.4°C`, `1.7 m`, `18 km/h`, `6.2 km`.
- Do not italicise numeric readings.
- Give the measurement label enough context to be understood without a dashboard tile.
- Use weight and spacing before introducing semantic colour.

## Ocean selection

Ocean selection is SeaWatch's signature progressive-disclosure pattern. A pointer-down on unobstructed water creates an immediate 2.6px acknowledgement, two finite soft rings, and a quiet 47px selected-area zone. Only one selection exists at a time. Land, labels, controls, ports, vessels, and the cyclone intercept input before it reaches the ocean plane.

The persistent state uses a near-transparent off-white fill and hairline boundary rather than glow, pulsing, or radar-like graphics. “Analyze this area” appears as a compact anchored action after the location begins to settle. It intentionally produces no results in Phase 4.

Accessibility is carried by an announced selected-location status and a native keyboard-focusable action, not by colour or animation alone. Reduced-motion users receive the same stable selected state and action without expanding rings.

## Specialized intelligence dock

Seven reasoning roles—Planner, Fishing, Ocean, Weather, Safety, Geo, and Evidence—form a quiet bottom-centre instrument cluster. The dock is 436 × 64px at the primary viewport and sits 188px above the bottom edge, with a subtle 56px eastward desktop adjustment to clear the cyclone annotation and existing vessels. This reserves space for a future compact composer. It has no shared toolbar surface.

Each role has a 52px-wide interaction column, a 40px warm translucent circle, a 17px Lucide icon at 1.65px stroke, and a 12px medium-weight label. Columns are separated by 12px. The icon family is Route, Fish, Waves, CloudSun, ShieldCheck, MapPin, and FileCheck2.

All roles are still and visually unified while idle. Hover, focus, or inspection raises only the circle by 2px and strengthens its border and surface. A concise tooltip provides the responsibility on hover and keyboard focus. Click or keyboard activation opens one 244px inspection popover with role, specialty, semantic status, collaborators, and tool/data categories. Escape, its close control, another role, or an outside pointer closes it without trapping focus.

Working is represented by a 3px neutral activity dot travelling slowly along part of the perimeter. Complete adds a small restrained check at the circle edge. Attention adds a static 6px amber indicator. These treatments supplement semantic status text and never rely on colour alone.

## Hero composer and answer

The Phase 6 composer is a 52px-high aperture centered near the bottom of the map. Its desktop width clamps between 360px and 460px. One quiet suggestion appears only at rest; microphone and send actions are the only controls. During analysis the submitted question remains visible, and after completion the field clears to “Ask a follow-up…”.

The final recommendation is not a chat bubble. It uses a compact 390px warm surface with one straight hairline edge, a 26px semibold conclusion, 15px support, and 12px interactive source metadata. A temporary 264px evidence surface is the only nested detail.

Geographic evidence stays in the water plane: a low-opacity organic marine-green recommendation, two neutral marine condition contours, seven fine wind marks, and one restrained amber constraint. The analytical peak may show all four together briefly; the final state reduces secondary contours and winds so the recommendation reads first.

## Living intelligence canvas

Phase 6.5 replaces straight-edged evidence geometry with smooth closed environmental contours. The opportunity field has an outer marine-green body, a nested stronger core, a progressive hairline reveal, and an unboxed anchored label. Four small scientific annotations—sea surface, chlorophyll, waves, and wind—are present only during active analysis and recede before the answer settles.

The seven-agent dock is a quiet intelligence strip rather than a toolbar. Idle roles use 34px low-opacity surfaces; working roles rise 3px, gain contrast and a partial current, and expose only one temporary activity phrase at a time. Collaboration paths pass above the strip briefly and include a travelling emphasis point.

The cyclone is an interactive meteorological object with separate cloud, outer-band, inner-band, eye, and forecast-track layers. Its 286px contextual inspector uses the shared warm context surface, explicit mock-data labeling, compact measurements, and an “Ask SeaWatch about this” handoff to the composer.

## Phase 9 final art direction

The final canvas is an ocean-first composition rather than a map interface laid over a blue field. Deep-water masses, a restrained coastal shelf, broad current fields, and fine non-repeating texture create depth at rest. Bathymetric traces remain below reading contrast; they support scale without becoming GIS contour decoration. Land stays warm, quiet, and nearly textureless so that the sea owns the frame.

The answer is an editorial wash with one straight anchor edge, not a floating card. It uses a 28px conclusion, 15px support, and 12px evidence metadata. Its right edge dissolves into the ocean so the recommendation feels composed with the map. Context inspectors use the same anchored logic with one meaningful edge and a restrained translucent paper surface.

The specialist strip has no shared toolbar container. A single low-contrast connective hairline gives the roles cohesion at rest. During analysis, irrelevant roles recede, the working role rises four pixels, its temporary phrase is readable at 10px, and collaboration curves cross above the strip. Completed states become still immediately.

The cyclone is deliberately asymmetric: three offset cloud lobes, a broad diffuse weather mass, independently moving outer and inner bands, a quiet eye, and a nearly static forecast corridor. Blurred broken bands are subordinate to the cloud mass so the object reads as weather rather than a hurricane icon or a geometric spiral.

Ocean selection uses two imperfect elliptical wave fragments instead of complete circular rings. The lasting selection is an irregular local area with a still centre point; it has no glow or pulse. Composer suggestions are text invitations with a hairline response, not pills.

## Implementation source

Visual tokens live in `src/styles/tokens.css`. The temporary style board in `src/App.tsx` demonstrates the foundation only and must not be reused as a product layout.

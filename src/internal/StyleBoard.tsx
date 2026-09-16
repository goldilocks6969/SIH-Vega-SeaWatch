import { SeaWatchWordmark } from '../components/SeaWatchWordmark'

const palette = [
  ['Warm paper', '--color-paper', '#F6F5F1'],
  ['Raised surface', '--color-surface-raised', '#FBFAF7'],
  ['Land', '--color-land', '#DDDCD7'],
  ['Marine water', '--color-water', '#7FAFC0'],
  ['Deep water', '--color-water-deep', '#699CAF'],
  ['Shallow water', '--color-water-shallow', '#98BBC5'],
  ['Opportunity', '--color-opportunity', '#5F886F'],
  ['Caution', '--color-caution', '#B1813E'],
  ['Critical', '--color-critical', '#C96C62'],
] as const

export function StyleBoard() {
  return (
    <main className="style-board">
      <div className="style-board__shell">
        <header className="style-board__header">
          <p className="style-board__eyebrow">Internal foundation reference · Phase 1</p>
          <SeaWatchWordmark />
          <p className="style-board__intro">
            Calm at rest. Alive when touched. This board validates the visual
            foundation—it is not the SeaWatch product interface.
          </p>
        </header>

        <section className="board-section" aria-labelledby="type-title">
          <div className="board-section__heading">
            <p className="board-section__index">01</p>
            <h1 id="type-title">Typography</h1>
          </div>
          <div className="type-specimens">
            <div className="type-specimen type-specimen--wide">
              <p className="type-specimen__label">Major contextual answer · 26/600</p>
              <p className="type-answer">
                Conditions west of Kochi remain suitable through late afternoon.
              </p>
            </div>
            <div className="type-specimen">
              <p className="type-specimen__label">Context heading · 16/600</p>
              <p className="type-heading">Nearshore conditions</p>
            </div>
            <div className="type-specimen">
              <p className="type-specimen__label">Normal UI · 15/450</p>
              <p className="type-ui">Wave height is moderate along the selected route.</p>
            </div>
            <div className="type-specimen">
              <p className="type-specimen__label">Observational italic · 12/450</p>
              <p className="type-observation">Updated moments ago</p>
            </div>
            <div className="type-specimen">
              <p className="type-specimen__label">Map label · 13/500</p>
              <p className="type-map-label">Fort Kochi</p>
            </div>
          </div>
        </section>

        <section className="board-section" aria-labelledby="measurement-title">
          <div className="board-section__heading">
            <p className="board-section__index">02</p>
            <h2 id="measurement-title">Measurements in context</h2>
          </div>
          <div className="measurements">
            <p><span>Sea surface</span><strong>28.4°C</strong></p>
            <p><span>Wave height</span><strong>1.7 m</strong></p>
            <p><span>Wind</span><strong>18 km/h</strong></p>
            <p><span>Distance</span><strong>6.2 km</strong></p>
          </div>
        </section>

        <section className="board-section" aria-labelledby="palette-title">
          <div className="board-section__heading">
            <p className="board-section__index">03</p>
            <h2 id="palette-title">Restrained marine palette</h2>
          </div>
          <div className="swatches" role="list">
            {palette.map(([name, token, value]) => (
              <div className="swatch" role="listitem" key={token}>
                <span
                  className="swatch__colour"
                  style={{ backgroundColor: `var(${token})` }}
                  aria-hidden="true"
                />
                <span className="swatch__name">{name}</span>
                <span className="swatch__value">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="board-section" aria-labelledby="surface-title">
          <div className="board-section__heading">
            <p className="board-section__index">04</p>
            <h2 id="surface-title">Surfaces and radius</h2>
          </div>
          <div className="surface-examples">
            <div className="surface-example surface-example--small">
              <span>Small</span><strong>8px</strong>
            </div>
            <div className="surface-example surface-example--medium">
              <span>Medium</span><strong>12px</strong>
            </div>
            <div className="surface-example surface-example--large">
              <span>Large</span><strong>18px</strong>
            </div>
          </div>
        </section>

        <section className="board-section" aria-labelledby="motion-title">
          <div className="board-section__heading">
            <p className="board-section__index">05</p>
            <h2 id="motion-title">Motion timing</h2>
          </div>
          <div className="motion-reference">
            <div className="motion-reference__tokens" aria-label="Motion durations">
              <span>Instant · 120ms</span>
              <span>Fast · 180ms</span>
              <span>Base · 240ms</span>
              <span>Slow · 450ms</span>
              <span>Ripple · 1080ms</span>
              <span>Environment · 18s+</span>
            </div>
            <button className="motion-sample" type="button">Touch response</button>
            <p className="motion-reference__note">
              At rest, nothing moves. Hover, focus, or press to preview a restrained
              control response.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

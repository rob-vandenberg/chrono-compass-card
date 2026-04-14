import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';
import { live } from 'https://unpkg.com/lit@2.0.0/directives/live.js?module';

// ─── Library Version ──────────────────────────────────────────────────────────
const LIB_VERSION = '4.4.802';

// ─── Library Version History ──────────────────────────────────────────────────
// v4.4.802: Add ccTextField(), ccToggleField(), ccColorPicker(), ccButtonPicker() editor helper functions
// v4.4.801: Match console log color to chrono-compass-card (#29b6cf)
// v4.4.800: Initial extraction from chrono-compass-card.js — ccParseNumber(), ChronoTextfield, ChronoButtonToggleGroup

// Log version info
console.info(
  `%c CHRONO-COMPASS-LIB %c v${LIB_VERSION} `,
  'background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;',
  'background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;'
);

// ─── ccParseNumber ────────────────────────────────────────────────────────────
// Mirrors ha-form-float._handleInput logic exactly.
// Returns the parsed number, undefined if the value is incomplete/invalid,
// or null to signal "return early, do not fire config-changed".
export function ccParseNumber(raw) {
  const v = String(raw).replace(',', '.');
  if (v === '-' || v === '-0' || v.endsWith('.')) return null;
  if (v.includes('.') && v.endsWith('0')) return null;
  if (v === '') return undefined;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// ─── ccTextField ──────────────────────────────────────────────────────────────
// Returns a labeled chrono-textfield block.
// opts: { type, step, min, max }
export function ccTextField(label, value, onChange, opts = {}) {
  return html`
    <div class="text-field">
      <label>${label}</label>
      <chrono-textfield
        .value=${String(value)}
        type=${opts.type || 'text'}
        step=${opts.step || ''}
        min=${opts.min !== undefined ? opts.min : ''}
        max=${opts.max !== undefined ? opts.max : ''}
        @input=${onChange}
      ></chrono-textfield>
    </div>
  `;
}

// ─── ccToggleField ────────────────────────────────────────────────────────────
// Returns a labeled ha-switch block.
// extraClass: optional extra CSS class added to the wrapper div.
export function ccToggleField(label, checked, onChange, extraClass = '') {
  return html`
    <div class="toggle-field${extraClass ? ' ' + extraClass : ''}">
      <label>${label}</label>
      <ha-switch
        .checked=${checked}
        @change=${onChange}
      ></ha-switch>
    </div>
  `;
}

// ─── ccColorPicker ────────────────────────────────────────────────────────────
// Returns a color field with native color input + chrono-textfield for hex entry.
export function ccColorPicker(label, value, onChange) {
  const colorValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#ffffff';
  return html`
    <div class="color-field">
      <label>${label}</label>
      <div class="color-row">
        <input
          type="color"
          .value=${colorValue}
          @input=${onChange}
        />
        <chrono-textfield
          .value=${value}
          placeholder="#RRGGBB or #RRGGBBAA"
          @input=${onChange}
        ></chrono-textfield>
      </div>
    </div>
  `;
}

// ─── ccButtonPicker ───────────────────────────────────────────────────────────
// Returns a chrono-button-toggle-group wrapped in a toggle-field div.
// options: array of { label, value }
// align: optional 'end' for justify-self:end
export function ccButtonPicker(label, value, options, onChange, align = '') {
  return html`
    <div class="toggle-field" style="${align ? `justify-self:${align}` : ''}">
      ${label ? html`<label>${label}</label>` : ''}
      <chrono-button-toggle-group
        .value=${String(value)}
        .options=${options}
        @change=${onChange}
      ></chrono-button-toggle-group>
    </div>
  `;
}

// ─── chrono-textfield ─────────────────────────────────────────────────────────
// Own text field component — replaces ha-textfield removed in HA 2026.5.
// Exposes .value and .type so _valueChanged() works identically to before.
// Uses live() to preserve intermediate input states (e.g. '-', '1.') without
// Lit overwriting the displayed value on re-render.
export class ChronoTextfield extends LitElement {
  static properties = {
    value:       { type: String },
    type:        { type: String },
    step:        { type: String },
    min:         { type: String },
    max:         { type: String },
    placeholder: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      height: 56px;
      padding: 0 12px;
      background: var(--input-fill-color, rgba(0,0,0,0.06));
      border: none;
      border-bottom: 1px solid var(--secondary-text-color, #888);
      border-radius: 4px 4px 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-family: inherit;
      outline: none;
      transition: border-bottom-color 0.2s;
    }
    input:focus {
      border-bottom: 2px solid var(--primary-color);
    }
  `;

  render() {
    return html`
      <input
        .value=${live(this.value ?? '')}
        type=${this.type || 'text'}
        step=${this.step || ''}
        min=${this.min || ''}
        max=${this.max || ''}
        @input=${this._onInput}
      />
    `;
  }

  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }
}
customElements.define('chrono-textfield', ChronoTextfield);


// ─── chrono-button-toggle-group ───────────────────────────────────────────────
// Segmented button control — mimics HA's ha-button-toggle-group appearance.
// Dispatches CustomEvent('change', { detail: { value } }) on selection.
export class ChronoButtonToggleGroup extends LitElement {
  static properties = {
    value:   { type: String },
    options: { type: Array },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }
    button {
      height: 28px;
      min-width: 70px;
      padding: 0 12px;
      border: none;
      border-right: 1px solid var(--ha-color-border-neutral-quiet, #5e5e5e);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      background: var(--ha-color-fill-primary-normal-resting, #002e3e);
      color: var(--primary-text-color, #e1e1e1);
      transition: background 150ms ease, color 150ms ease;
      border-radius: 0;
    }
    button:last-child {
      border-right: none;
    }
    button.first {
      border-radius: 9999px 0 0 9999px;
    }
    button.last {
      border-radius: 0 9999px 9999px 0;
    }
    button.only {
      border-radius: 9999px;
    }
    button.active {
      background: var(--ha-color-fill-primary-loud-resting, #009ac7);
      color: var(--primary-text-color, #e1e1e1);
    }
    button:hover:not(.active) {
      background: var(--ha-color-fill-primary-quiet-hover, #004156);
    }
  `;

  render() {
    const opts = this.options || [];
    return html`${opts.map((opt, i) => {
      const isFirst  = i === 0;
      const isLast   = i === opts.length - 1;
      const isOnly   = opts.length === 1;
      const isActive = opt.value === this.value;
      const cls = [
        isActive ? 'active' : '',
        isOnly ? 'only' : (isFirst ? 'first' : (isLast ? 'last' : '')),
      ].filter(Boolean).join(' ');
      return html`<button class="${cls}" @click=${() => this._select(opt.value)}>${opt.label}</button>`;
    })}`;
  }

  _select(value) {
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }
}
customElements.define('chrono-button-toggle-group', ChronoButtonToggleGroup);

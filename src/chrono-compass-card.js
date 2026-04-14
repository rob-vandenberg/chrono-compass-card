import { LitElement, html, svg, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';
import { live } from 'https://unpkg.com/lit@2.0.0/directives/live.js?module';
import { ccParseNumber, ccTextField, ccToggleField, ccColorPicker, ccButtonPicker, ChronoTextfield, ChronoButtonToggleGroup } from './chrono-compass-lib.js';

// ─── Card Version ─────────────────────────────────────────────────────────────
const CARD_VERSION = '4.4.802';

// ─── Card Version History ─────────────────────────────────────────────────────
// v4.4.802: Move _textField, _toggleField, _colorPicker, _buttonPicker editor helpers to chrono-compass-lib.js; import ccTextField, ccToggleField, ccColorPicker, ccButtonPicker
// v4.4.800: Extract ChronoTextfield, ChronoButtonToggleGroup, ccParseNumber into chrono-compass-lib.js; import from library
// v4.3.727: Refactor tick tiers from flat keys (major_ticks_*, minor_ticks_*, micro_ticks_*) to ticks[] array; add DEFAULT_TICK constant; tier offset constants removed, default position values used instead; tier 0 exempt from occupied check, tiers 1+ blocked by occupied
// v4.3.726: Update editor to modify fields[] array elements instead of flat field_1/2/3 keys; add _fieldChanged() method; replace three hardcoded field blocks with single fields.map() loop
// v4.3.725: Refactor custom fields from flat keys (field_1_*, field_2_*, field_3_*) to fields[] array; add DEFAULT_CUSTOM_FIELD constant; position is now absolute percentage (default 25/50/75), replacing previous relative offset from fixed base
// v4.3.724: Added second catch in _teardownSubscriptions() to prevent console warning: Uncaught (in promise) {code: 'not_found', message: 'Subscription not found.'}
// v4.3.723: Revert to v4.3.719 — image clipping feature parked; clip path offset issue not resolved
// v4.3.722: Fix image_clip bounding box center Y — use _yShift+_h (P2/P4 line) not _yShift+_h/2
// v4.3.721: When image_clip is true, use square bounding box (side=max(width,height*2)) centered on needle — morph ignored; ensures full moon image fills circle before clipping to crescent
// v4.3.720: Add image_clip to DEFAULT_NEEDLE; when true, needle path used as clipPath for image; add Clip image toggle to needle-image-toggles-grid; grid updated to 1fr 1fr
// v4.3.719: Fix P3 control point distance — use cHoriz instead of cP3; P3 distance is always equal to P1, independent of morph
// v4.3.718: Split cDown into cDown (P2/P4, signed morph) and cP3 (abs morph) — fixes negative morph direction flip on P2/P4 while keeping P3 control distance correct
// v4.3.717: Fix cDown — use Math.abs(morph) so negative morph does not invert control point distances
// v4.3.716: Fix _buildNeedlePath control point scaling — P1/P3 horizontal scaled by width/2, P2/P4 upward scaled by height, P2/P4 downward and P3 scaled by morph; curve converted to curveNormalized=(curve/50)*0.5523 so curve=50 always produces a perfect circle regardless of needle dimensions
// v4.3.715: Fix _buildNeedlePath control points — remove angleRatio/angleRadians/p2_out/p4_in; P1 control distance=curve; P2/P4 upper control distance=curve, lower=curve*morphRatio; P3 both controls=curve*morphRatio; morphRatio=morph/height (zero-safe)
// v4.3.714: Rename --cc-bg-color to --cc-background-color
// v4.3.713: Add bezel_radius to DEFAULT_CONFIG; set --cc-bezel-radius in setConfig; replace hardcoded border-radius:50% with CSS variable on compass-bezel-layer
// v4.3.712: Add COMPASS_DEFAULT_MARGIN constant; fix margin formula to (100+COMPASS_DEFAULT_MARGIN)-compass_size; fix header/footer position to use fixed 6cqi baseline independent of compass_size; change position units from px to cqi; revert requestAnimationFrame to direct callback()
// v4.3.711: Defer plain-string template callbacks via requestAnimationFrame — fixes small font on first render; support <br> in header/footer by splitting on literal <br> and rendering Lit <br> elements
// v4.3.710: Add min-width:70px to ChronoButtonToggleGroup button; fix compass_rotate migration to single line (dial or needle); remove z-index from header/footer; lower field z-index from 100 to 1
// v4.3.709: compass_size default 100, margin formula 112-compass_size; bezel_width default 25; compass_rotate 'compass'→'dial' in UI, setConfig migrations and render
// v4.3.708: Field 1/2/3 position defaults to 0; base offsets 25/50/75 hardcoded; position is relative offset (positive=up, subtracted from base)
// v4.3.707: Fix position sign — negate background_image_y and needle image_y so positive=up; fix footer position so positive=up (+ instead of -)
// v4.3.706: Fix _buildNeedlePath comment (P3 is height+morph not height-morph); fix _renderTicks indentation
// v4.3.705: Fix tick priority logic — rewrite _renderTicks; cardinals independent block; major exempt from occupied check; minor/micro blocked by occupied
// v4.3.704: Remove clip-path from needle image — image fills bounding box with aspect ratio preserved; transparency handled by image itself
// v4.3.703: (skipped — reserved for previous chat)
// v4.3.702: Fix needle image rendering — size <image> to needle bounding box instead of full 100×100 SVG; center image transform on bounding box center; image now scales correctly with needle dimensions
// v4.3.701: Rename compass-bezel → compass-bezel-layer; rename cc-button-toggle-group/CcButtonToggleGroup → chrono-button-toggle-group/ChronoButtonToggleGroup
// v4.3.700: Add _textField/_toggleField helpers; replace all repeated editor blocks — 562 lines removed
// v4.2.605: Add min-width:80px to rotate-compass-toggle-grid label
// v4.2.604: Add config migrations to editor setConfig — same as card setConfig
// v4.2.603: Add config migrations in setConfig — compass_rotate boolean→string, ticks_round boolean→ticks_linecap string
// v4.2.602: Update rotate compass hint text
// v4.2.601: Replace compass_rotate ha-switch with buttonPicker (Needle/Compass); compass_rotate now string; remove path.trim().replace(); simplify degrees fallback
// v4.2.600: Dead code removal — empty updated() method, unused _error property and all references
// v4.1.524: Remove PRESETS, _applyPreset, preset selector HTML and CSS — presets deferred to future version
// v4.1.523: Add tick-toggle-field class to Cardinals show toggle; reverse linecap button order to Square/Round
// v4.1.522: Right-align linecap buttonPicker in tick-toggles-grid via justify-self:end
// v4.1.521: Clamp tick length to min 0.001 in SVG rendering only — fixes zero-length line orientation for square linecap dots
// v4.1.520: Fix chrono-button-toggle-group colors — inactive uses primary-normal-resting, active uses primary-loud-resting, text uses primary-text-color
// v4.1.519: Add ChronoButtonToggleGroup; add _buttonPicker helper; rename ticks_round to ticks_linecap; add PRESETS (Compass+Clock); add preset selector in editor; default header/footer fontsize 1.0
// v4.1.518: Update defaults — needle height:40, morph:40; header/footer fontsize:1.4; field 1/3 fontsize:1.8, unit:1.4; field 2 fontsize:2.2, unit:1.4
// v4.1.517: Fix header position sign (positive=up); default compassMargin 12; default needle height 50; update CSS margin fallbacks to 12%
// v4.1.516: Move header/footer inside compass-container as absolute elements; default fontsize 1.0; position=0 centers in margin gap; tick-toggle-field label min-width:90px; fix CSS order; stroke-linecap square
// v4.1.515: Fix stroke-linecap — use square not butt when Round is off
// v4.1.514: Add Round/Square toggle per tick tier; tick-toggles-grid 2 columns; min-width:90px on toggle-field label; gap:24px on tick-toggles-grid
// v4.1.513: Fix invert — flip Y around needle midpoint (height-p.y) not around y=0
// v4.1.512: Fix needle centering — apply (50-height) offset so P2-P4 base sits at compass center when position=0
// v4.1.511: Add overflow:visible to compass-needle SVG — needle may legally protrude outside viewBox
// v4.1.510: Fix P3 morph direction — height+morph (pushes tail down) not height-morph
// v4.1.509: Rewrite needle rendering — fixed viewBox 0 0 100 100; P1 at (50,0), P2 at (50-w/2,height), P3 tail at (50,height-morph), P4 at (50+w/2,height); position shifts Y; compass-needle fills layer; no dynamic bounds
// v4.1.508: Fix needle position reference — P2-P3 base now at compass center when position=0; pass height to _buildNeedlePath; shift = -minY - position + (50 - height); positive position moves toward North
// v4.1.507: Change needle position reference to P2-P3 base midpoint; position=0 now centers base on compass center; shift = -minY + position - 50
// v4.1.506: Rename ChronoCcTextfield/chrono-cc-textfield to ChronoTextfield/chrono-textfield — corrects naming mistake; intended name was always chrono-textfield
// v4.1.505: Update defaults — bezel_width:24, needle width:7, all tick/cardinal positions:0, field positions calibrated; calibrate _renderTicks offsets for cardinals/major/minor/micro
// v4.1.504: Introduce compass-bezel-layer as separate element inside compass-layer; compass-layer becomes invisible square; bezel owns background-color/border/border-radius/overflow:hidden/container-type; compass-rotate-group is sibling of bezel
// v4.1.503: Fix hierarchy — move compass-rotate-group inside compass-layer; change compass-layer overflow from hidden to visible
// v4.1.502: Move container-type to compass-layer so children use cqi; fields use cqi directly for font-size; remove font-size from compass-layer
// v4.1.243: Remove animation suppression — no longer needed since only one render occurs with correct degrees
// v4.1.235: Rewrite lifecycle — _needleDegrees non-reactive, single render triggered only after subscription callback fires with correct value; remove _needleDegreesCache entirely
// v4.1.234: Fix needle flash — move _setupSubscriptions from updated() to willUpdate() so subscriptions fire before first render
// v4.1.233: Rename cc-textfield to chrono-textfield to avoid conflict with custom-compass-card when both installed simultaneously
// v4.1.232: Fix needle bump — move cache restore to connectedCallback before _setupSubscriptions so callbacks never see empty _needleDegrees
// v4.1.231: Fix needle bump — remove _needleDegrees/_needlePrevDegrees reset in _setupSubscriptions; willUpdate cache handles restoration
// v4.1.230: Fix needle bump bug — remove changedProperties.has('config') from updated() to prevent subscription rebuild on every config change
// v4.1.229: Reorder compass styling grid — Background, Size, Bezel color, Bezel width; rename label to "Size"; update grid columns to 7fr 4fr 7fr 4fr
// v4.1.228: Rename compass_size to compass_size; rename DOM classes compass-layer/rotate-wrapper/ticks-wrapper/needle-wrapper to compass-layer/rotate-group/ticks-layer/needle-layer; rename CSS vars --cc-compass-size/circle-border-width/circle-color/circle-size to --cc-compass-size/bezel-width/bezel-color/ticks-size; update JS variables and editor UI label
// v4.0.227: Bump major version to 4.0 — marks full rewrite milestone from 3.x series
// v3.8.226: Rename card from custom-compass-card to chrono-compass-card; class names updated accordingly
// v3.8.225: Refactor _colorPicker to accept value+callback — all color fields now use single method, no duplication
// v3.8.224: Suppress console warnings when typing hex colors — only pass valid 6-digit hex to color input
// v3.8.223: Scale compass_size using host element offsetWidth — truly unaffected by internal layout
// v3.8.222: Scale compass_size using compass-container width — no feedback loop, correct proportional scaling
// v3.8.221: Revert _scaleElements to 3.8.214 state — remove compass_size scaling which caused feedback loop
// v3.8.220: Fix _scaleElements early return — only require compass-layer, handle compass-container separately
// v3.8.219: Revert compass-layer DOM check — it fires on every recreation not just first render
// v3.8.218: Skip needle render on first render (compass-layer not yet in DOM) — eliminates oversized needle flash
// v3.8.217: Fix scale calculation — use compass-layer for _scale, compass-container for border-size only
// v3.8.216: Fix infinite resize loop — use compass-container for scale calculation, not compass-layer
// v3.8.215: Fix compass_size scaling — now multiplied by _scale factor like bezel_width
// v3.8.214: Fix needle reset to 0 on config changes — willUpdate() seeds _needleDegrees from module-level cache before render
// v3.8.213: Rename marker length property to height — matches editor label change
// v3.8.212: Add name property to needles — shown as panel header, editable field at top of needle panel
// v3.8.211: Reorder editor CSS to match HTML order; fix chrono-textfield input vertical alignment
// v3.8.210: Revert chrono-textfield to native input; add live() to fix minus/decimal display; add min-width:0 to color-field
// v3.8.209: Add min-width:0 to .text-field grid item
// v3.8.208: Fix chrono-textfield wa-input layout — hide label/hint parts, constrain width with min-width:0; fix handler null check
// v3.8.207: Replace native <input> in chrono-textfield with wa-input, mirroring ha-input
// v3.8.206: Fix numeric input — replicate ha-form-float logic for minus and decimal handling
// v3.8.205: Remove mutual exclusivity between cardinal labels and primary ticks — both can be enabled simultaneously
// v3.8.204: Cardinal labels and primary ticks can now both render at same position
// v3.8.203: Fix cardinals-styling-grid — missing Font size text-field wrapper was dropped in previous edit
// v3.8.202: Separate cardinals-styling-grid CSS from tick-styling-grid; update tick-styling-grid to 5fr 5fr 5fr 5fr 9fr
// v3.8.201: Fix cardinal labels — render independently of major_ticks_show
// v3.8.151: Reverse needle render order so needle 1 renders on top
// v3.8.150: Increase toggle-field gap to 8px for better label-to-switch spacing
// v3.8.149: Remove min-width from toggle-field label — fixes toggle spacing in needle panel
// v3.8.148: Move Rotate compass toggle from Needle panel to Compass configuration panel
// v3.8.147: Multiple needles — needles[] array replaces single needle_* flat keys; full per-needle config; compass_rotate wraps all needles
// v3.8.146: Restyle add/remove marker buttons to match mwc-button appearance
// v3.7.145: Replace marker_1/2 flat keys with markers[] array; add flip option; unlimited markers; dynamic editor
// v3.7.144: Version bump to force HACS cache refresh — clears corrupt hacs.json cached from v3.7.143 initial release
// v3.7.143: Replace ha-textfield with own chrono-textfield component — future-proof against HA 2026.5 removal; fixes width issue in 2026.4
// v3.7.142: Fix TypeError in field callback — convert HA result to String before calling replace()
// v3.7.141: Remove unnecessary _fieldRawValues; simplify ${compass_direction} handling
// v3.7.140: Fix ${compass_direction} in mixed templates: send template to HA untouched, replace token in callback and on bearing change
// v3.7.139: Rename compass_template to needle_template; move to needle block in DEFAULT_CONFIG
// v3.7.138: DRY fixes: _fieldDefs getter replaces duplicate arrays; markers handled in a loop
// v3.7.137: Move {{ check into sub() helper — single place, applies to all templates automatically
// v3.7.136: Apply {{ check before every sub() call — never call HA with a plain string; applies to all 10 templates
// v3.7.135: Correct ${compass_direction}: replace first then decide subscription based on whether Jinja2 remains
// v3.7.134: Fix ${compass_direction} handling: resolved client-side via getCompassDirection(), no HA subscription
// v3.7.133: Replace REST template polling with WebSocket subscribeMessage; HA tracks entity dependencies and pushes updates automatically
// v3.7.132: Move bearing template field from Compass panel to Needle panel; rename CSS class to needle-template-grid
// v3.7.131: Replace compass entity/attribute/adjustment with needle_template (Jinja2); remove willUpdate entity watch

// ─── Constants ────────────────────────────────────────────────────────────────
const COMPASS_DEFAULT_MARGIN = 12;

// ─── Default Needle ───────────────────────────────────────────────────────────
const DEFAULT_NEEDLE = {
  name:         '',
  show:         true,
  template:     "{{ state_attr('sun.sun', 'azimuth') | float(0) }}",
  invert:       false,
  rotate:       false,
  color_1:      '#FF0000',
  color_1_pos:  50,
  color_2:      '#EEEEEE',
  color_2_pos:  50,
  height:       40,
  width:        7,
  position:     0,
  morph:        40,
  curve:        0,
  image_show:   false,
  image_url:    '/local/community/chrono-compass-card/moon.png',
  image_scale:  100,
  image_x:      0,
  image_y:      0,
  image_rotate: 0,
};

// ─── Default Marker ───────────────────────────────────────────────────────────
const DEFAULT_MARKER = {
  show:     true,
  degrees:  '0',
  height:   5,
  width:    4,
  position: 0,
  color:    '#FF0000',
  flip:     false,
};

// ─── Default Tick ─────────────────────────────────────────────────────────────
const DEFAULT_TICK = {
  show:      false,
  linecap:   'round',
  divisions: 4,
  length:    3,
  width:     1.5,
  position:  0,
  color:     '#AAAAAA',
};

// ─── Default Custom Field ─────────────────────────────────────────────────────
const DEFAULT_CUSTOM_FIELD = {
  show:             true,
  template:         '',
  fontsize:         1.8,
  fontweight:       400,
  position:         50,
  fontcolor:        '#FFFFFF',
  unit:             '',
  unit_fontsize:    1.4,
  unit_fontweight:  400,
  unit_fontcolor:   '#FFFFFF',
};

// ─── Default Configuration ────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  background_color:         '#101010',
  bezel_color:              '#383838',
  bezel_width:              25,
  bezel_radius:             50,
  compass_size:             100,
  background_image_show:    true,
  background_image_url:     '/local/community/chrono-compass-card/black.png',
  background_image_scale:   100,
  background_image_x:       0,
  background_image_y:       0,
  background_image_rotate:  0,
  compass_rotate:           'needle',
  
  needles:                  [{ ...DEFAULT_NEEDLE }],
  markers:                  [],
  
  cardinals_show:           true,
  cardinal_north:           'N',
  cardinal_east:            'E',
  cardinal_south:           'S',
  cardinal_west:            'W',
  cardinals_fontsize:       10,
  cardinals_fontweight:     400,
  cardinals_position:       0,
  cardinals_fontcolor:      '#EEEEEE',
  
  ticks: [
    {
      ...DEFAULT_TICK,
      show:      false,
      linecap:   'round',
      divisions: 4,
      length:    6,
      width:     2,
      position:  -2.9,
      color:     '#CCCCCC',
    },
    {
      ...DEFAULT_TICK,
      show:      true,
      linecap:   'round',
      divisions: 8,
      length:    3,
      width:     1.5,
      position:  -4.6,
      color:     '#AAAAAA',
    },
    {
      ...DEFAULT_TICK,
      show:      true,
      linecap:   'round',
      divisions: 16,
      length:    0,
      width:     2,
      position:  -6.3,
      color:     '#888888',
    },
  ],
  
  header_show:              false,
  header_text:              'header',
  header_fontsize:          1.0,
  header_fontweight:        400,
  header_position:          0,
  header_fontcolor:         '#FFFFFF',
  
  footer_show:              false,
  footer_text:              'footer',
  footer_fontsize:          1.0,
  footer_fontweight:        400,
  footer_position:          0,
  footer_fontcolor:         '#FFFFFF',
  
  fields: [
    {
      ...DEFAULT_CUSTOM_FIELD,
      show:           true,
      template:       '${compass_direction}',
      fontsize:       1.8,
      fontweight:     400,
      position:       25,
      fontcolor:      '#29B6CF',
      unit:           '',
      unit_fontsize:  1.4,
      unit_fontweight: 400,
      unit_fontcolor: '#196D7C',
    },
    {
      ...DEFAULT_CUSTOM_FIELD,
      show:           false,
      template:       "{{ states('sensor.ws_wind_speed') | round(1) }}",
      fontsize:       2.2,
      fontweight:     400,
      position:       50,
      fontcolor:      '#E8E8E8',
      unit:           'km/h',
      unit_fontsize:  1.4,
      unit_fontweight: 400,
      unit_fontcolor: '#8C8C8C',
    },
    {
      ...DEFAULT_CUSTOM_FIELD,
      show:           true,
      template:       "{{ state_attr('sun.sun', 'azimuth') | round(0) }}",
      fontsize:       1.8,
      fontweight:     400,
      position:       75,
      fontcolor:      '#808080',
      unit:           '°',
      unit_fontsize:  1.4,
      unit_fontweight: 400,
      unit_fontcolor: '#606060',
    },
  ],
  
  rotation_animation_time:  0.5,
};

// ─── Visual Editor ────────────────────────────────────────────────────────────
class ChronoCompassCardEditor extends LitElement {
  static properties = {
    hass:    { type: Object },
    _config: { type: Object },
  };

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };

    // compass_rotate: 'dial' is the only valid non-default value; everything else → 'needle'
    if (this._config.compass_rotate !== 'dial') this._config.compass_rotate = 'needle';
  }

  _valueChanged(key, ev) {
    if (!this._config || !this.hass) return;
    let value;
    if (ev.detail?.value !== undefined) {
      value = ev.detail.value;
    } else if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
    }
    if (ev.target.type === 'number') {
      const parsed = ccParseNumber(value);
      if (parsed == null) return;
      value = parsed;
    }
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _addNeedle() {
    const needles = [...(this._config.needles || []), { ...DEFAULT_NEEDLE }];
    this._config = { ...this._config, needles };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _removeNeedle(i) {
    const needles = this._config.needles.filter((_, idx) => idx !== i);
    this._config = { ...this._config, needles };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _needleChanged(i, key, ev) {
    let value;
    if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
      if (ev.target.type === 'number') {
        const parsed = ccParseNumber(value);
        if (parsed == null) return;
        value = parsed;
      }
    }
    const needles = this._config.needles.map((n, idx) =>
      idx === i ? { ...n, [key]: value } : n
    );
    this._config = { ...this._config, needles };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _addMarker() {
    const markers = [...(this._config.markers || []), { ...DEFAULT_MARKER }];
    this._config = { ...this._config, markers };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _removeMarker(i) {
    const markers = this._config.markers.filter((_, idx) => idx !== i);
    this._config = { ...this._config, markers };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _markerChanged(i, key, ev) {
    let value;
    if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
      if (ev.target.type === 'number') {
        const parsed = ccParseNumber(value);
        if (parsed == null) return;
        value = parsed;
      }
    }
    const markers = this._config.markers.map((m, idx) =>
      idx === i ? { ...m, [key]: value } : m
    );
    this._config = { ...this._config, markers };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _fieldChanged(i, key, ev) {
    let value;
    if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
      if (ev.target.type === 'number') {
        const parsed = ccParseNumber(value);
        if (parsed == null) return;
        value = parsed;
      }
    }
    const fields = this._config.fields.map((f, idx) =>
      idx === i ? { ...f, [key]: value } : f
    );
    this._config = { ...this._config, fields };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _tickChanged(i, key, ev) {
    let value;
    if (ev.target.tagName === 'HA-SWITCH') {
      value = ev.target.checked;
    } else {
      value = ev.target.value;
      if (ev.target.type === 'number') {
        const parsed = ccParseNumber(value);
        if (parsed == null) return;
        value = parsed;
      }
    }
    const ticks = this._config.ticks.map((t, idx) =>
      idx === i ? { ...t, [key]: value } : t
    );
    this._config = { ...this._config, ticks };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const c = this._config;

    return html`

      <ha-expansion-panel header="Compass configuration" outlined>

      <!-- Compass styling -->
      <div class="compass-styling-grid">
        ${ccColorPicker('Background', this._config['background_color'] || '#ffffff', e => this._valueChanged('background_color', e))}
        ${ccTextField('Size', c.compass_size, e => this._valueChanged('compass_size', e), {type:'number', step:'1'})}
        ${ccColorPicker('Bezel color', this._config['bezel_color'] || '#ffffff', e => this._valueChanged('bezel_color', e))}
        ${ccTextField('Bezel width', c.bezel_width, e => this._valueChanged('bezel_width', e), {type:'number', step:'1', min:'0'})}
      </div>

      <!-- Background image -->
      <div class="background-toggles-grid">
        ${ccToggleField('Background image', c.background_image_show, e => this._valueChanged('background_image_show', e))}
      </div>
      <div class="background-image-template-grid">
        ${ccTextField('URL (jinja template allowed)', c.background_image_url, e => this._valueChanged('background_image_url', e))}
      </div>
      <div class="background-image-styling-grid">
        ${ccTextField('X pos', c.background_image_x, e => this._valueChanged('background_image_x', e), {type:'number', step:'0.5'})}
        ${ccTextField('Y pos', c.background_image_y, e => this._valueChanged('background_image_y', e), {type:'number', step:'0.5'})}
        ${ccTextField('Scale (%)', c.background_image_scale, e => this._valueChanged('background_image_scale', e), {type:'number', step:'1', min:'1'})}
        ${ccTextField('Rotate', c.background_image_rotate, e => this._valueChanged('background_image_rotate', e), {type:'number', step:'1'})}
      </div>

      <!-- Rotate compass -->
      <div class="rotate-compass-toggle-grid">
        ${ccButtonPicker('Rotate', c.compass_rotate, [{ label: 'Needle', value: 'needle' }, { label: 'Dial', value: 'dial' }], e => this._valueChanged('compass_rotate', e))}
        <div class="toggle-hint"><b>Needle</b> rotates the needle. <b>Dial</b> keeps Needle 1 pointing north while rotating the compass.</div>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Needle configuration" outlined>

      ${(c.needles || []).map((n, i) => html`
        <ha-expansion-panel header="${n.name || 'Needle ' + (i + 1)}" outlined>

          <!-- Name -->
          <div class="needle-name-grid">
            ${ccTextField('Name (optional)', n.name || '', e => this._needleChanged(i, 'name', e))}
          </div>

          <!-- Toggles -->
          <div class="needle-toggles-grid">
            ${ccToggleField('Show', n.show, e => this._needleChanged(i, 'show', e))}
            ${ccToggleField('Invert', n.invert, e => this._needleChanged(i, 'invert', e))}
            ${ccToggleField('Rotate 180°', n.rotate, e => this._needleChanged(i, 'rotate', e))}
          </div>

          <!-- Bearing template -->
          <div class="needle-template-grid">
            ${ccTextField('Bearing (jinja template)', n.template, e => this._needleChanged(i, 'template', e))}
          </div>

          <!-- Colors -->
          <div class="needle-color-grid">
            ${ccColorPicker('Color 1', n.color_1 || '#FF0000', e => this._needleChanged(i, 'color_1', e))}
            ${ccTextField('Pos (%)', n.color_1_pos, e => this._needleChanged(i, 'color_1_pos', e), {type:'number', step:'1', min:'0', max:'100'})}
            ${ccColorPicker('Color 2', n.color_2 || '#EEEEEE', e => this._needleChanged(i, 'color_2', e))}
            ${ccTextField('Pos (%)', n.color_2_pos, e => this._needleChanged(i, 'color_2_pos', e), {type:'number', step:'1', min:'0', max:'100'})}
          </div>

          <!-- Dimensions -->
          <div class="needle-dimensions-grid">
            ${ccTextField('Position', n.position, e => this._needleChanged(i, 'position', e), {type:'number', step:'1'})}
            ${ccTextField('Height', n.height, e => this._needleChanged(i, 'height', e), {type:'number', step:'1', min:'4'})}
            ${ccTextField('Width', n.width, e => this._needleChanged(i, 'width', e), {type:'number', step:'1', min:'1'})}
            ${ccTextField('Morph', n.morph, e => this._needleChanged(i, 'morph', e), {type:'number', step:'1'})}
            ${ccTextField('Curve', n.curve, e => this._needleChanged(i, 'curve', e), {type:'number', step:'1'})}
          </div>

          <!-- Needle image -->
          <div class="needle-image-toggles-grid">
            ${ccToggleField('Needle image', n.image_show, e => this._needleChanged(i, 'image_show', e))}
          </div>
          <div class="needle-image-template-grid">
            ${ccTextField('URL (jinja template allowed)', n.image_url, e => this._needleChanged(i, 'image_url', e))}
          </div>
          <div class="needle-image-styling-grid">
            ${ccTextField('X pos', n.image_x, e => this._needleChanged(i, 'image_x', e), {type:'number', step:'0.5'})}
            ${ccTextField('Y pos', n.image_y, e => this._needleChanged(i, 'image_y', e), {type:'number', step:'0.5'})}
            ${ccTextField('Scale (%)', n.image_scale, e => this._needleChanged(i, 'image_scale', e), {type:'number', step:'1', min:'1'})}
            ${ccTextField('Rotate', n.image_rotate, e => this._needleChanged(i, 'image_rotate', e), {type:'number', step:'1'})}
          </div>

          <!-- Remove button -->
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${() => this._removeNeedle(i)}>Remove needle</button>
          </div>

        </ha-expansion-panel>
      `)}

      <div class="marker-add-grid">
        <button class="marker-add-btn" @click=${this._addNeedle}>+ Add needle</button>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Markers configuration" outlined>

      ${(c.markers || []).map((m, i) => html`
        <ha-expansion-panel header="Marker ${i + 1}" outlined>
          <div class="marker-toggles-grid">
            ${ccToggleField('Show', m.show, e => this._markerChanged(i, 'show', e))}
            ${ccToggleField('Flip', m.flip, e => this._markerChanged(i, 'flip', e))}
          </div>
          <div class="marker-template-grid">
            ${ccTextField('Degrees (jinja template allowed)', m.degrees, e => this._markerChanged(i, 'degrees', e))}
          </div>
          <div class="marker-styling-grid">
            ${ccTextField('Position', m.position, e => this._markerChanged(i, 'position', e), {type:'number', step:'0.5'})}
            ${ccTextField('Height', m.height, e => this._markerChanged(i, 'height', e), {type:'number', step:'0.1', min:'0'})}
            ${ccTextField('Width', m.width, e => this._markerChanged(i, 'width', e), {type:'number', step:'0.1', min:'0'})}
            ${ccColorPicker('Color', m.color || '#FF0000', e => this._markerChanged(i, 'color', e))}
          </div>
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${() => this._removeMarker(i)}>Remove marker</button>
          </div>
        </ha-expansion-panel>
      `)}

      <div class="marker-add-grid">
        <button class="marker-add-btn" @click=${this._addMarker}>+ Add marker</button>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Ticks configuration" outlined>

      <!-- Cardinal labels -->
      <div class="tick-toggles-grid">
        ${ccToggleField('Cardinal labels', c.cardinals_show, e => this._valueChanged('cardinals_show', e), 'tick-toggle-field')}
      </div>
      
      <div class="cardinal-labels-grid">
        ${ccTextField('North', c.cardinal_north, e => this._valueChanged('cardinal_north', e))}
        ${ccTextField('East', c.cardinal_east, e => this._valueChanged('cardinal_east', e))}
        ${ccTextField('South', c.cardinal_south, e => this._valueChanged('cardinal_south', e))}
        ${ccTextField('West', c.cardinal_west, e => this._valueChanged('cardinal_west', e))}
      </div>
      
      <div class="cardinals-styling-grid">
        ${ccTextField('Position', c.cardinals_position, e => this._valueChanged('cardinals_position', e), {type:'number', step:'0.5'})}
        ${ccTextField('Font size', c.cardinals_fontsize, e => this._valueChanged('cardinals_fontsize', e), {type:'number', step:'0.5', min:'0'})}
        ${ccTextField('Font weight', c.cardinals_fontweight, e => this._valueChanged('cardinals_fontweight', e), {type:'number', step:'100', min:'100', max:'900'})}
        ${ccColorPicker('Color', this._config['cardinals_fontcolor'] || '#ffffff', e => this._valueChanged('cardinals_fontcolor', e))}
      </div>

      ${(c.ticks || []).map((t, i) => {
        const labels = ['Primary', 'Secondary', 'Tertiary'];
        const label  = labels[i] || `Tier ${i + 1}`;
        return html`
      <!-- ${label} ticks -->
      <div class="tick-toggles-grid">
        ${ccToggleField(`${label} ticks`, t.show, e => this._tickChanged(i, 'show', e), 'tick-toggle-field')}
        <div class="toggle-field" style="justify-self:end">
          <chrono-button-toggle-group
            .value=${String(t.linecap)}
            .options=${[{ label: 'Square', value: 'square' }, { label: 'Round', value: 'round' }]}
            @change=${e => this._tickChanged(i, 'linecap', e)}
          ></chrono-button-toggle-group>
        </div>
      </div>
      <div class="tick-styling-grid">
        ${ccTextField('Position', t.position, e => this._tickChanged(i, 'position', e), {type:'number', step:'0.5'})}
        ${ccTextField('Length', t.length, e => this._tickChanged(i, 'length', e), {type:'number', step:'0.1', min:'0'})}
        ${ccTextField('Width', t.width, e => this._tickChanged(i, 'width', e), {type:'number', step:'0.1', min:'0'})}
        ${ccTextField('Divisions', t.divisions, e => this._tickChanged(i, 'divisions', e), {type:'number', step:'1', min:'1'})}
        ${ccColorPicker('Color', t.color || '#ffffff', e => this._tickChanged(i, 'color', e))}
      </div>
        `;
      })}

      </ha-expansion-panel>

      <ha-expansion-panel header="Header &amp; Footer configuration" outlined>

      <!-- Header -->
      <div class="field-toggles-grid">
        ${ccToggleField('Show header', c.header_show, e => this._valueChanged('header_show', e))}
      </div>
      <div class="field-template-grid">
        ${ccTextField('Header (jinja template allowed)', c.header_text, e => this._valueChanged('header_text', e))}
      </div>
      <div class="field-styling-grid">
        ${ccTextField('Position', c.header_position, e => this._valueChanged('header_position', e), {type:'number', step:'1'})}
        ${ccTextField('Font size', c.header_fontsize, e => this._valueChanged('header_fontsize', e), {type:'number', step:'0.1'})}
        ${ccTextField('Font weight', c.header_fontweight, e => this._valueChanged('header_fontweight', e), {type:'number', step:'100', min:'100', max:'900'})}
        ${ccColorPicker('Color', this._config['header_fontcolor'] || '#ffffff', e => this._valueChanged('header_fontcolor', e))}
      </div>

      <!-- Footer -->
      <div class="field-toggles-grid">
        ${ccToggleField('Show footer', c.footer_show, e => this._valueChanged('footer_show', e))}
      </div>
      <div class="field-template-grid">
        ${ccTextField('Footer (jinja template allowed)', c.footer_text, e => this._valueChanged('footer_text', e))}
      </div>
      <div class="field-styling-grid">
        ${ccTextField('Position', c.footer_position, e => this._valueChanged('footer_position', e), {type:'number', step:'1'})}
        ${ccTextField('Font size', c.footer_fontsize, e => this._valueChanged('footer_fontsize', e), {type:'number', step:'0.1'})}
        ${ccTextField('Font weight', c.footer_fontweight, e => this._valueChanged('footer_fontweight', e), {type:'number', step:'100', min:'100', max:'900'})}
        ${ccColorPicker('Color', this._config['footer_fontcolor'] || '#ffffff', e => this._valueChanged('footer_fontcolor', e))}
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Custom fields configuration" outlined>

      ${(c.fields || []).map((f, i) => html`

      <!-- Field ${i + 1} -->
      <div class="field-toggles-grid">
        ${ccToggleField(`Show Field ${i + 1}`, f.show, e => this._fieldChanged(i, 'show', e))}
      </div>
      <div class="field-template-grid">
        ${ccTextField('Text (jinja template allowed)', f.template, e => this._fieldChanged(i, 'template', e))}
      </div>
      <div class="field-styling-grid">
        ${ccTextField('Position (%)', f.position, e => this._fieldChanged(i, 'position', e), {type:'number', step:'1'})}
        ${ccTextField('Font size', f.fontsize, e => this._fieldChanged(i, 'fontsize', e), {type:'number', step:'0.1'})}
        ${ccTextField('Font weight', f.fontweight, e => this._fieldChanged(i, 'fontweight', e), {type:'number', step:'100', min:'100', max:'900'})}
        ${ccColorPicker('Color', f.fontcolor || '#ffffff', e => this._fieldChanged(i, 'fontcolor', e))}
      </div>
      <div class="field-unit-grid">
        ${ccTextField('Unit', f.unit, e => this._fieldChanged(i, 'unit', e))}
        ${ccTextField('Font size', f.unit_fontsize, e => this._fieldChanged(i, 'unit_fontsize', e), {type:'number', step:'0.1'})}
        ${ccTextField('Font weight', f.unit_fontweight, e => this._fieldChanged(i, 'unit_fontweight', e), {type:'number', step:'100', min:'100', max:'900'})}
        ${ccColorPicker('Color', f.unit_fontcolor || '#ffffff', e => this._fieldChanged(i, 'unit_fontcolor', e))}
      </div>

      `)}

      </ha-expansion-panel>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }


    ha-expansion-panel {
      margin-top: 8px;
    }

    ha-expansion-panel > *:first-child {
      margin-top: 16px;
    }

    ha-expansion-panel + ha-expansion-panel > *:first-child {
      margin-top: 24px;
    }

    .color-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .color-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .color-row {
      display: flex;
      gap: 8px;
      align-items: center;
      background-color: var(--input-fill-color, #1e1e1e);
      border-radius: 4px 4px 0 0;
      padding-left: 8px;
    }
    .color-row input[type="color"] {
      width: 24px;
      height: 40px;
      border: none;
      border-radius: 4px 4px 0 0;
      background: transparent;
      cursor: pointer;
      flex-shrink: 0;
    }
    .color-row chrono-textfield {
      flex: 1;
      --input-fill-color: transparent;
    }

    .text-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .text-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }

    .toggle-field {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
    }
    .toggle-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .tick-toggle-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      min-width: 90px;
    }
    .toggle-hint {
      font-size: 11px;
      color: var(--disabled-text-color, #888);
      margin-left: 6px;
      font-style: italic;
    }

    chrono-textfield {
      display: block;
      width: 100%;
    }

    .compass-styling-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr 1fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 16px;
    }

    .background-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 32px;
      margin-bottom: 16px;
    }

    .background-image-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .background-image-styling-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .rotate-compass-toggle-grid {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 28px;
      margin-bottom: 16px;
    }
    .rotate-compass-toggle-grid label {
      min-width: 60px;
    }

    .needle-name-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    .needle-toggles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .needle-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .needle-color-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr 1fr;
      gap: 8px;
      margin-top: 24px;
      margin-bottom: 8px;
    }

    .needle-dimensions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 16px;
    }

    .needle-image-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .needle-image-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .needle-image-styling-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .marker-remove-grid {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    .marker-remove-btn {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .marker-remove-btn:hover {
      background: rgba(219, 68, 55, 0.08);
    }

    .marker-add-grid {
      display: flex;
      justify-content: center;
      margin-top: 12px;
      margin-bottom: 4px;
    }

    .marker-add-btn {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .marker-add-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }

    .marker-toggles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .marker-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .marker-styling-grid {
      display: grid;
      grid-template-columns: 3fr 3fr 3fr 5fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .tick-toggles-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .tick-styling-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .cardinal-labels-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .cardinals-styling-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .field-toggles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 28px;
      margin-bottom: 16px;
    }

    .field-template-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-top: 8px;
    }

    .field-styling-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      margin-bottom: 8px;
      align-items: end;
    }

    .field-unit-grid {
      display: grid;
      grid-template-columns: 2fr 2fr 2fr 3fr;
      gap: 8px;
      margin-top: 8px;
      align-items: end;
    }

  `;
}

customElements.define('chrono-compass-card-editor', ChronoCompassCardEditor);

// ─── Main Card ────────────────────────────────────────────────────────────────
class ChronoCompassCard extends LitElement {
  static properties = {
    _fieldValues:           { type: Array },
    _headerValue:           { type: String },
    _footerValue:           { type: String },
    _markerDegrees:         { type: Array },
    _backgroundImageUrl:    { type: String },
    _needleImageUrls:       { type: Array },
  };

  constructor() {
    super();
    this._needleDegrees       = [];
    this._needlePrevDegrees   = [];   // non-reactive, for shortest-arc tracking
    this._templateUnsubs      = [];
    this._subscriptionsActive = false;
    this._fieldValues         = [];
    this._headerValue         = '';
    this._footerValue         = '';
    this._markerDegrees       = [];
    this._backgroundImageUrl  = '';
    this._needleImageUrls     = [];
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config && !this._subscriptionsActive) {
      this._setupSubscriptions();
    }
  }

  get hass() {
    return this._hass;
  }

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };

    // compass_rotate: 'dial' is the only valid non-default value; everything else → 'needle'
    if (this._config.compass_rotate !== 'dial') this._config.compass_rotate = 'needle';

    // Set all CSS custom properties once — browser handles all resizing from here
    const c = this._config;
    const compassMargin = (100 + COMPASS_DEFAULT_MARGIN) - (parseFloat(c.compass_size) ?? 100);
    this.style.setProperty('--cc-compass-margin',     `${compassMargin}%`);
    this.style.setProperty('--cc-bezel-width',        `${parseFloat(c.bezel_width) / 2}cqi`);
    this.style.setProperty('--cc-bezel-color',         c.bezel_color);
    this.style.setProperty('--cc-bezel-radius',        `${parseFloat(c.bezel_radius)}%`);
    this.style.setProperty('--cc-background-color',   c.background_color);
    this.style.setProperty('--cc-animation-duration', `${c.rotation_animation_time}s`);
    if (this._hass && !this._subscriptionsActive) {
      this._setupSubscriptions();
    }
  }

  get config() {
    return this._config;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._hass && this._config) {
      this._setupSubscriptions();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownSubscriptions();
  }

  _setupSubscriptions() {
    this._teardownSubscriptions();
    if (!this.hass?.connection || !this.config) return;
    this._subscriptionsActive = true;

    const sub = (template, callback) => {
      const tmpl = String(template);
      if (!tmpl.includes('{{')) {
        callback(tmpl);
        return;
      }
      const unsub = this.hass.connection.subscribeMessage(
        (msg) => callback(msg.result),
        { type: 'render_template', template: tmpl }
      );
      this._templateUnsubs.push(unsub);
    };

    // Needle bearings — one subscription per needle.
    // _needleDegrees and _needlePrevDegrees are plain (non-reactive) arrays.
    // We call requestUpdate() manually after populating them, ensuring
    // exactly one render happens with the correct value — never at 0.
    (this.config.needles || []).forEach((needle, i) => {
      sub(needle.template, (result) => {
        const raw = parseFloat(result);
        if (!isNaN(raw)) {
          const targetNormalized = ((raw % 360) + 360) % 360;
          const prev    = this._needlePrevDegrees[i] ?? null;
          const current = this._needleDegrees[i]     ?? targetNormalized;
          if (targetNormalized !== prev) {
            const currentMod = ((current % 360) + 360) % 360;
            let delta = targetNormalized - currentMod;
            if (delta > 180)  delta -= 360;
            if (delta < -180) delta += 360;
            this._needleDegrees[i]     = current + delta;
            this._needlePrevDegrees[i] = targetNormalized;
            this.requestUpdate();
          }
        } else {
          this._needleDegrees[i]     = 0;
          this._needlePrevDegrees[i] = null;
          this.requestUpdate();
        }
        if (i === 0) this._updateCompassDirectionFields();
      });
    });

    // Custom fields
    for (const def of this._fieldDefs) {
      if (!def.show) { this._fieldValues[def.index] = ''; continue; }
      const idx = def.index;
      sub(String(def.template), (result) => {
        const newValues = [...this._fieldValues];
        newValues[idx] = String(result).replace('${compass_direction}', this.getCompassDirection(this._needleDegrees[0] ?? 0));
        this._fieldValues = newValues;
      });
    }

    // Header and footer
    if (this.config.header_show && this.config.header_text) {
      sub(this.config.header_text, (result) => { this._headerValue = result; });
    } else { this._headerValue = ''; }

    if (this.config.footer_show && this.config.footer_text) {
      sub(this.config.footer_text, (result) => { this._footerValue = result; });
    } else { this._footerValue = ''; }

    // Marker degrees
    this._markerDegrees = [];
    (this.config.markers || []).forEach((m, i) => {
      sub(m.degrees, (result) => {
        const newDegrees = [...this._markerDegrees];
        newDegrees[i] = ((parseFloat(result) % 360) + 360) % 360;
        this._markerDegrees = newDegrees;
      });
    });

    // Background image URL
    if (this.config.background_image_show) {
      sub(this.config.background_image_url, (result) => { this._backgroundImageUrl = result; });
    } else { this._backgroundImageUrl = ''; }

    // Needle image URLs
    this._needleImageUrls = [];
    (this.config.needles || []).forEach((needle, i) => {
      if (needle.image_show) {
        sub(needle.image_url, (result) => {
          const newUrls = [...this._needleImageUrls];
          newUrls[i] = result;
          this._needleImageUrls = newUrls;
        });
      } else {
        const newUrls = [...this._needleImageUrls];
        newUrls[i] = '';
        this._needleImageUrls = newUrls;
      }
    });
  }

  // Called from the bearing callback whenever _degrees changes.
  // Handles fields whose template is a plain string containing ${compass_direction}.
  // Mixed templates (${compass_direction} + Jinja2) are handled by their HA callback.
  _updateCompassDirectionFields() {
    const direction = this.getCompassDirection(this._needleDegrees[0] ?? 0);
    for (const def of this._fieldDefs) {
      if (!def.show) continue;
      const tmpl = String(def.template);
      if (!tmpl.includes('${compass_direction}')) continue;
      if (tmpl.includes('{{')) continue;
      const newValues = [...this._fieldValues];
      newValues[def.index] = tmpl.replace('${compass_direction}', direction);
      this._fieldValues = newValues;
    }
  }

  get _fieldDefs() {
    return (this.config.fields || []).map((f, i) => ({ index: i, show: f.show, template: f.template }));
  }

  _teardownSubscriptions() {
    const unsubs = this._templateUnsubs;
    this._templateUnsubs      = [];
    this._subscriptionsActive = false;
    for (const unsub of unsubs) {
      // Promise.resolve(unsub).then(fn => fn()).catch(() => {});
      // Prevents warning in the console:
      Promise.resolve(unsub).then(fn => fn().catch(() => {})).catch(() => {});
    }
  }

  getCompassDirection(degrees) {
    const normalized = ((degrees % 360) + 360) % 360;
    const N = this.config.cardinal_north;
    const E = this.config.cardinal_east;
    const S = this.config.cardinal_south;
    const W = this.config.cardinal_west;
    const directions = [
      N, N+N+E, N+E, E+N+E,
      E, E+S+E, S+E, S+S+E,
      S, S+S+W, S+W, W+S+W,
      W, W+N+W, N+W, N+N+W,
    ];
    return directions[Math.floor((normalized + 11.25) / 22.5) % 16];
  }

  _buildNeedlePath(morph, curve, invert, position, width, height) {
    // Fixed 100x100 coordinate space, center at 50,50.
    // P1 tip at (50, 0), P2 base-left at (50-width/2, height),
    // P3 tail at (50, height+morph), P4 base-right at (50+width/2, height).
    // position shifts needle along Y (positive = toward North = up in SVG).
    // invert flips needle vertically.
    const hw = width / 2;
    let points = [
      { x: 50,      y: 0             },  // P1: tip
      { x: 50 - hw, y: height        },  // P2: base left
      { x: 50,      y: height + morph},  // P3: tail (morph point)
      { x: 50 + hw, y: height        },  // P4: base right
    ];

    // curve=50 produces a perfect circle regardless of needle dimensions.
    // Internally converted to the Bezier circle approximation constant (4/3 * tan(π/8) ≈ 0.5523).
    const curveNormalized = (curve / 50) * 0.5523;

    // Control point distances scaled by actual shape dimensions:
    // Horizontal controls (P1, P3) scale with half-width.
    // Vertical controls upward (P2, P4) scale with height.
    // Vertical controls downward (P2, P4) and both P3 controls scale with morph.
    const cHoriz  = curveNormalized * hw;               // P1 left/right, P3 left/right
    const cUp     = curveNormalized * height;           // P2 up, P4 up
    const cDown   = curveNormalized * morph;            // P2 down, P4 down — signed, flips with morph

    let controlDirections = [
      { in: { x:  1, y:  0 }, out: { x: -1, y:  0 }, inDist: cHoriz, outDist: cHoriz }, // P1: left/right
      { in: { x:  0, y: -1 }, out: { x:  0, y:  1 }, inDist: cUp,    outDist: cDown  }, // P2: up/down
      { in: { x: -1, y:  0 }, out: { x:  1, y:  0 }, inDist: cHoriz, outDist: cHoriz }, // P3: left/right, always cHoriz
      { in: { x:  0, y:  1 }, out: { x:  0, y: -1 }, inDist: cDown,  outDist: cUp    }, // P4: down/up
    ];

    // Step 1: If invert, flip Y around needle midpoint (y = height/2)
    if (invert) {
      points.forEach(p => { p.y = height - p.y; });
      controlDirections.forEach(d => {
        d.in.y  = -d.in.y;
        d.out.y = -d.out.y;
      });
    }

    // Step 2: Apply centering offset and position shift (positive = toward North = subtract in SVG Y)
    points.forEach(p => { p.y += (50 - height) - position; });

    // Step 3: Compute control points
    const controls = points.map((p, i) => {
      return {
        in:  { x: p.x + controlDirections[i].in.x  * controlDirections[i].inDist,
               y: p.y + controlDirections[i].in.y  * controlDirections[i].inDist  },
        out: { x: p.x + controlDirections[i].out.x * controlDirections[i].outDist,
               y: p.y + controlDirections[i].out.y * controlDirections[i].outDist },
      };
    });

    // Step 4: Build SVG path string using cubic Bezier curves
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      path += ` C ${controls[i].out.x},${controls[i].out.y} ${controls[next].in.x},${controls[next].in.y} ${points[next].x},${points[next].y}`;
    }
    path += ' Z';

    return path;
  }

  _renderTicks() {
    const c   = this.config;
    const cx  = 50, cy = 50, r = 50;

    const _cardinals_offset   =  2.5;

    const cardinals = [c.cardinal_north, c.cardinal_east, c.cardinal_south, c.cardinal_west];
    const round1    = (v) => Math.round(v * 10) / 10;
    const occupied  = new Set();
    const ticks     = [];

    // 1. Cardinals: Render and Occupy
    if (c.cardinals_show) {
      [0, 90, 180, 270].forEach((angleDeg, cardinalIdx) => {
        occupied.add(round1(angleDeg));

        const angleRad = angleDeg * Math.PI / 180;
        const sinA     = Math.sin(angleRad);
        const cosA     = Math.cos(angleRad);
        const tx       = cx + (r + _cardinals_offset + (c.cardinals_position || 0)) * sinA;
        const ty       = cy - (r + _cardinals_offset + (c.cardinals_position || 0)) * cosA;
        const offset   = c.cardinals_fontsize * 0.85;
        const lx       = tx - offset * sinA;
        const ly       = ty + offset * cosA;

        ticks.push({
          type: 'text', x: lx, y: ly,
          letter: cardinals[cardinalIdx],
          fontSize: c.cardinals_fontsize,
          fontWeight: c.cardinals_fontweight,
          color: c.cardinals_fontcolor,
        });
      });
    }

    // 2. Tier Definitions
    const tierDefs = (c.ticks || []).map((t) => ({
      show:      t.show,
      linecap:   t.linecap || 'round',
      divisions: parseInt(t.divisions) || 4,
      length:    t.length,
      width:     t.width,
      color:     t.color,
      position:  t.position || 0,
    }));

    // 3. Tick Rendering: Strict Hierarchy
    // Tier 0 always renders regardless of occupied positions.
    // Tiers 1+ are blocked if the angle is already occupied.
    tierDefs.forEach((tier, tierIndex) => {
      if (tier.show) {
        const step = 360 / tier.divisions;
        for (let i = 0; i < tier.divisions; i++) {
          const angleDeg = round1(i * step);

          if (tierIndex !== 0 && occupied.has(angleDeg)) continue;

          occupied.add(angleDeg);

          const angleRad = angleDeg * Math.PI / 180;
          const sinA     = Math.sin(angleRad);
          const cosA     = Math.cos(angleRad);
          const length   = Math.max(parseFloat(tier.length), 0.001);
          const width    = parseFloat(tier.width);
          const position = parseFloat(tier.position);

          const x1 = cx + (r + position)          * sinA;
          const y1 = cy - (r + position)          * cosA;
          const x2 = cx + (r + position - length) * sinA;
          const y2 = cy - (r + position - length) * cosA;

          ticks.push({
            type: 'line', x1, y1, x2, y2,
            color: tier.color, width, linecap: tier.linecap,
          });
        }
      }
    });

    // 4. Markers
    const markerDefs = (c.markers || []).map((m, i) => ({
      show:     m.show,
      degrees:  this._markerDegrees[i] ?? 0,
      height:   parseFloat(m.height),
      width:    parseFloat(m.width),
      position: parseFloat(m.position),
      color:    m.color,
      flip:     m.flip,
    }));

    const markers = markerDefs.map(m => {
      if (!m.show) return null;
      const angle  = m.degrees * Math.PI / 180;
      const sinA   = Math.sin(angle);
      const cosA   = Math.cos(angle);
      const tipR   = r + m.position;
      const baseR  = tipR + m.height;
      const tipCx  = cx + (m.flip ? baseR : tipR)  * sinA;
      const tipCy  = cy - (m.flip ? baseR : tipR)  * cosA;
      const baseCx = cx + (m.flip ? tipR  : baseR) * sinA;
      const baseCy = cy - (m.flip ? tipR  : baseR) * cosA;
      const half   = m.width / 2;
      const b1x    = baseCx + half * cosA;
      const b1y    = baseCy + half * sinA;
      const b2x    = baseCx - half * cosA;
      const b2y    = baseCy - half * sinA;
      return { color: m.color, path: `M ${tipCx},${tipCy} L ${b1x},${b1y} L ${b2x},${b2y} Z` };
    }).filter(Boolean);

    return html`
      <div class="compass-ticks-layer">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${ticks.map(t => {
            if (t.type === 'text') return svg`
              <text x="${t.x}" y="${t.y}" text-anchor="middle" dominant-baseline="central"
                    font-size="${t.fontSize}" font-weight="${t.fontWeight}" fill="${t.color}">${t.letter}</text>
            `;
            return svg`
              <line x1="${t.x1}" y1="${t.y1}" x2="${t.x2}" y2="${t.y2}"
                    stroke="${t.color}" stroke-width="${t.width}" stroke-linecap="${t.linecap || 'round'}"/>
            `;
          })}
          ${markers.map(m => svg`<path d="${m.path}" fill="${m.color}" />`)}
        </svg>
      </div>
    `;
  }
  _fieldStyle(def) {
    return `font-size:${def.fontsize * 8}cqi; font-weight:${def.fontweight}; color:${def.fontcolor}; top:${def.position}%;`;
  }

  _unitStyle(def) {
    return `font-size:${def.unit_fontsize * 8}cqi; font-weight:${def.unit_fontweight}; color:${def.unit_fontcolor};`;
  }

  render() {
    const c       = this.config || {};
    const needles = c.needles || [];

    // compass_rotate: compute the rotation that puts needle 1 at north
    const needle0Degrees  = this._needleDegrees[0] ?? 0;
    const compassRotation = c.compass_rotate === 'dial' ? -needle0Degrees : 0;

    const fieldDefs = (c.fields || []).map((f, i) => ({
      index:          i,
      show:           f.show,
      unit:           f.unit,
      fontsize:       parseFloat(f.fontsize),
      fontweight:     f.fontweight,
      position:       f.position,
      fontcolor:      f.fontcolor,
      unit_fontsize:  parseFloat(f.unit_fontsize),
      unit_fontweight: f.unit_fontweight,
      unit_fontcolor: f.unit_fontcolor,
    }));

    const renderField = (def) => {
      if (!def.show) return html``;
      return html`
        <div class="field field-${def.index}" style=${this._fieldStyle(def)}>
          ${this._fieldValues[def.index] ?? ''}${def.unit ? html`<span style=${this._unitStyle(def)}>${def.unit}</span>` : ''}
        </div>
      `;
    };

    // Build and render each needle
    const renderNeedle = (needle, i) => {
      if (!needle.show) return html``;
      if (this._needleDegrees[i] === undefined) return html``;
      const degrees  = this._needleDegrees[i];
      const rotation = needle.rotate ? degrees + 180 : degrees;
      const path     = this._buildNeedlePath(parseFloat(needle.morph), parseFloat(needle.curve), needle.invert, parseFloat(needle.position), parseFloat(needle.width), parseFloat(needle.height));
      const gradId   = `needleGradient-${i}`;
      const imageUrl = this._needleImageUrls[i] || '';

      // Compute the needle bounding box for image sizing.
      // Mirrors the point construction in _buildNeedlePath (key points only, no curve control points).
      // This ensures the <image> fills exactly the needle shape and scales with needle dimensions.
      const _hw     = parseFloat(needle.width) / 2;
      const _h      = parseFloat(needle.height);
      const _m      = parseFloat(needle.morph);
      const _pos    = parseFloat(needle.position);
      const _yShift = (50 - _h) - _pos;
      const _pts    = needle.invert
        ? [
            { x: 50,        y: _h      + _yShift },  // P1 inverted
            { x: 50 - _hw,  y: 0       + _yShift },  // P2 inverted
            { x: 50,        y: -_m     + _yShift },  // P3 inverted
            { x: 50 + _hw,  y: 0       + _yShift },  // P4 inverted
          ]
        : [
            { x: 50,        y: 0       + _yShift },  // P1
            { x: 50 - _hw,  y: _h      + _yShift },  // P2
            { x: 50,        y: _h + _m + _yShift },  // P3
            { x: 50 + _hw,  y: _h      + _yShift },  // P4
          ];
      const imgMinX = Math.min(..._pts.map(p => p.x));
      const imgMaxX = Math.max(..._pts.map(p => p.x));
      const imgMinY = Math.min(..._pts.map(p => p.y));
      const imgMaxY = Math.max(..._pts.map(p => p.y));
      const imgCx   = (imgMinX + imgMaxX) / 2;
      const imgCy   = (imgMinY + imgMaxY) / 2;
      const g1       = needle.invert ? needle.color_2 : needle.color_1;
      const g1pos    = needle.invert ? 100 - parseFloat(needle.color_2_pos) : parseFloat(needle.color_1_pos);
      const g2       = needle.invert ? needle.color_1 : needle.color_2;
      const g2pos    = needle.invert ? 100 - parseFloat(needle.color_1_pos) : parseFloat(needle.color_2_pos);

      return html`
        <div class="compass-needle-layer" style="transform:rotate(${rotation}deg)">
          <svg class="compass-needle"
               viewBox="0 0 100 100"
               preserveAspectRatio="none">
            <defs>
              <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"        stop-color="${g1}" />
                <stop offset="${g1pos}%" stop-color="${g1}" />
                <stop offset="${g2pos}%" stop-color="${g2}" />
                <stop offset="100%"      stop-color="${g2}" />
              </linearGradient>
            </defs>
            ${needle.image_show && imageUrl ? svg`
              <image
                href="${imageUrl}"
                x="${imgMinX}" y="${imgMinY}" width="${imgMaxX - imgMinX}" height="${imgMaxY - imgMinY}"
                preserveAspectRatio="xMidYMid meet"
                transform="translate(${imgCx},${imgCy}) rotate(${needle.image_rotate}) scale(${needle.image_scale / 100}) translate(${needle.image_x}, ${-needle.image_y}) translate(${-imgCx},${-imgCy})"
              />
            ` : svg`
              <path d="${path}" fill="url(#${gradId})" />
            `}
          </svg>
        </div>
      `;
    };

    return html`
      <ha-card>
        <div class="compass-container">
          ${c.header_show ? html`
            <div class="card-header-text" style="font-size:${c.header_fontsize}em; font-weight:${c.header_fontweight}; color:${c.header_fontcolor}; top:calc(${COMPASS_DEFAULT_MARGIN / 2}cqi - ${c.header_position}cqi);">
              ${this._headerValue.split('<br>').map((line, i, arr) => html`${line}${i < arr.length - 1 ? html`<br>` : ''}`)}
            </div>
          ` : ''}
          <div class="compass-layer">
            <div class="compass-bezel-layer">
              ${c.background_image_show && this._backgroundImageUrl ? html`
                <img class="compass-bg-image"
                  src="${this._backgroundImageUrl}"
                  style="transform: translate(-50%, -50%) translate(${c.background_image_x}%, ${-c.background_image_y}%) rotate(${c.background_image_rotate}deg) scale(${c.background_image_scale / 100});"
                />
              ` : ''}
              ${fieldDefs.map(def => renderField(def))}
            </div>
            <div class="compass-rotate-group" style="transform:rotate(${compassRotation}deg)">
              ${this._renderTicks()}
              ${[...needles].reverse().map((n, ri) => renderNeedle(n, needles.length - 1 - ri))}
            </div>
          </div>
          ${c.footer_show ? html`
            <div class="card-footer-text" style="font-size:${c.footer_fontsize}em; font-weight:${c.footer_fontweight}; color:${c.footer_fontcolor}; bottom:calc(${COMPASS_DEFAULT_MARGIN / 2}cqi + ${c.footer_position}cqi);">
              ${this._footerValue.split('<br>').map((line, i, arr) => html`${line}${i < arr.length - 1 ? html`<br>` : ''}`)}
            </div>
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
    .card-header-text {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      line-height: 1.3;
      transform: translateY(-50%);
      pointer-events: none;
    }
    .card-footer-text {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      line-height: 1.3;
      transform: translateY(50%);
      pointer-events: none;
    }
    .compass-container {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      margin: 0 auto;
      overflow: hidden;
      box-sizing: border-box;
      container-type: inline-size;
    }
    .compass-layer {
      position: absolute;
      top:    var(--cc-compass-margin, 12%);
      left:   var(--cc-compass-margin, 12%);
      right:  var(--cc-compass-margin, 12%);
      bottom: var(--cc-compass-margin, 12%);
      container-type: inline-size;
    }
    .compass-bezel-layer {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: var(--cc-bezel-radius, 50%);
      background-color: var(--cc-background-color, #111111);
      border: var(--cc-bezel-width, 1.5cqi) solid var(--cc-bezel-color, #333333);
      box-sizing: border-box;
      overflow: hidden;
      container-type: inline-size;
    }
    .compass-bg-image {
      position: absolute;
      top: 50%;
      left: 50%;
      height: 100%;
      width: auto;
      max-width: none;
      transform-origin: center center;
      pointer-events: none;
      z-index: 0;
    }
    .compass-rotate-group {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      transition: transform var(--cc-animation-duration, 0.3s) ease-out;
    }
    .compass-ticks-layer {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      pointer-events: none;
    }
    .compass-ticks {
      position: absolute;
      width:  100%;
      height: 100%;
      overflow: visible;
    }
    .compass-needle-layer {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      transition: transform var(--cc-animation-duration, 0.3s) ease-out;
    }
    .compass-needle {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .field {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 1;
      line-height: 1.15;
      display: flex;
      justify-content: center;
      align-items: baseline;
      gap: 0.1em;
      transform: translateY(-50%);
      white-space: nowrap;
    }
  `;

  static getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement('chrono-compass-card-editor');
  }

  static getStubConfig() {
    return { ...DEFAULT_CONFIG };
  }
}

customElements.define('chrono-compass-card', ChronoCompassCard);

// Log version info
console.info(
  `%c CHRONO-COMPASS-CARD %c v${CARD_VERSION} `,
  'background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;',
  'background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;'
);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'chrono-compass-card',
  name:        'Chrono Compass Card',
  description: 'A fully configurable compass card with dynamic fields.',
  preview:     true,
  config:      ChronoCompassCard.getStubConfig(),
});

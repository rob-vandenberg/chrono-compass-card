import{LitElement,html,css}from"https://unpkg.com/lit@2.0.0/index.js?module";import{live}from"https://unpkg.com/lit@2.0.0/directives/live.js?module";const LIB_VERSION="4.4.802";console.info("%c CHRONO-COMPASS-LIB %c v4.4.802 ","background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;","background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");export function ccParseNumber(t){const e=String(t).replace(",",".");if("-"===e||"-0"===e||e.endsWith("."))return null;if(e.includes(".")&&e.endsWith("0"))return null;if(""===e)return;const o=parseFloat(e);return isNaN(o)?null:o}export function ccTextField(t,e,o,r={}){return html`
    <div class="text-field">
      <label>${t}</label>
      <chrono-textfield
        .value=${String(e)}
        type=${r.type||"text"}
        step=${r.step||""}
        min=${void 0!==r.min?r.min:""}
        max=${void 0!==r.max?r.max:""}
        @input=${o}
      ></chrono-textfield>
    </div>
  `}export function ccToggleField(t,e,o,r=""){return html`
    <div class="toggle-field${r?" "+r:""}">
      <label>${t}</label>
      <ha-switch
        .checked=${e}
        @change=${o}
      ></ha-switch>
    </div>
  `}export function ccColorPicker(t,e,o){const r=/^#[0-9a-fA-F]{6}$/.test(e)?e:"#ffffff";return html`
    <div class="color-field">
      <label>${t}</label>
      <div class="color-row">
        <input
          type="color"
          .value=${r}
          @input=${o}
        />
        <chrono-textfield
          .value=${e}
          placeholder="#RRGGBB or #RRGGBBAA"
          @input=${o}
        ></chrono-textfield>
      </div>
    </div>
  `}export function ccButtonPicker(t,e,o,r,i=""){return html`
    <div class="toggle-field" style="${i?`justify-self:${i}`:""}">
      ${t?html`<label>${t}</label>`:""}
      <chrono-button-toggle-group
        .value=${String(e)}
        .options=${o}
        @change=${r}
      ></chrono-button-toggle-group>
    </div>
  `}export class ChronoTextfield extends LitElement{static properties={value:{type:String},type:{type:String},step:{type:String},min:{type:String},max:{type:String},placeholder:{type:String}};static styles=css`
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
  `;render(){return html`
      <input
        .value=${live(this.value??"")}
        type=${this.type||"text"}
        step=${this.step||""}
        min=${this.min||""}
        max=${this.max||""}
        @input=${this._onInput}
      />
    `}_onInput(t){this.value=t.target.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}}customElements.define("chrono-textfield",ChronoTextfield);export class ChronoButtonToggleGroup extends LitElement{static properties={value:{type:String},options:{type:Array}};static styles=css`
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
  `;render(){const t=this.options||[];return html`${t.map((e,o)=>{const r=0===o,i=o===t.length-1,n=1===t.length,l=[e.value===this.value?"active":"",n?"only":r?"first":i?"last":""].filter(Boolean).join(" ");return html`<button class="${l}" @click=${()=>this._select(e.value)}>${e.label}</button>`})}`}_select(t){this.value=t,this.dispatchEvent(new CustomEvent("change",{detail:{value:t},bubbles:!0,composed:!0}))}}customElements.define("chrono-button-toggle-group",ChronoButtonToggleGroup);
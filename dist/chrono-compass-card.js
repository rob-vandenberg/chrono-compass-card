import{LitElement,html,svg,css}from"https://unpkg.com/lit@2.0.0/index.js?module";import{live}from"https://unpkg.com/lit@2.0.0/directives/live.js?module";import{ccParseNumber,ccTextField,ccToggleField,ccColorPicker,ccButtonPicker,ChronoTextfield,ChronoButtonToggleGroup}from"./chrono-compass-lib.js";const CARD_VERSION="4.4.802",COMPASS_DEFAULT_MARGIN=12,DEFAULT_NEEDLE={name:"",show:!0,template:"{{ state_attr('sun.sun', 'azimuth') | float(0) }}",invert:!1,rotate:!1,color_1:"#FF0000",color_1_pos:50,color_2:"#EEEEEE",color_2_pos:50,height:40,width:7,position:0,morph:40,curve:0,image_show:!1,image_url:"/local/community/chrono-compass-card/moon.png",image_scale:100,image_x:0,image_y:0,image_rotate:0},DEFAULT_MARKER={show:!0,degrees:"0",height:5,width:4,position:0,color:"#FF0000",flip:!1},DEFAULT_TICK={show:!1,linecap:"round",divisions:4,length:3,width:1.5,position:0,color:"#AAAAAA"},DEFAULT_CUSTOM_FIELD={show:!0,template:"",fontsize:1.8,fontweight:400,position:50,fontcolor:"#FFFFFF",unit:"",unit_fontsize:1.4,unit_fontweight:400,unit_fontcolor:"#FFFFFF"},DEFAULT_CONFIG={background_color:"#101010",bezel_color:"#383838",bezel_width:25,bezel_radius:50,compass_size:100,background_image_show:!0,background_image_url:"/local/community/chrono-compass-card/black.png",background_image_scale:100,background_image_x:0,background_image_y:0,background_image_rotate:0,compass_rotate:"needle",needles:[{...DEFAULT_NEEDLE}],markers:[],cardinals_show:!0,cardinal_north:"N",cardinal_east:"E",cardinal_south:"S",cardinal_west:"W",cardinals_fontsize:10,cardinals_fontweight:400,cardinals_position:0,cardinals_fontcolor:"#EEEEEE",ticks:[{...DEFAULT_TICK,show:!1,linecap:"round",divisions:4,length:6,width:2,position:-2.9,color:"#CCCCCC"},{...DEFAULT_TICK,show:!0,linecap:"round",divisions:8,length:3,width:1.5,position:-4.6,color:"#AAAAAA"},{...DEFAULT_TICK,show:!0,linecap:"round",divisions:16,length:0,width:2,position:-6.3,color:"#888888"}],header_show:!1,header_text:"header",header_fontsize:1,header_fontweight:400,header_position:0,header_fontcolor:"#FFFFFF",footer_show:!1,footer_text:"footer",footer_fontsize:1,footer_fontweight:400,footer_position:0,footer_fontcolor:"#FFFFFF",fields:[{...DEFAULT_CUSTOM_FIELD,show:!0,template:"${compass_direction}",fontsize:1.8,fontweight:400,position:25,fontcolor:"#29B6CF",unit:"",unit_fontsize:1.4,unit_fontweight:400,unit_fontcolor:"#196D7C"},{...DEFAULT_CUSTOM_FIELD,show:!1,template:"{{ states('sensor.ws_wind_speed') | round(1) }}",fontsize:2.2,fontweight:400,position:50,fontcolor:"#E8E8E8",unit:"km/h",unit_fontsize:1.4,unit_fontweight:400,unit_fontcolor:"#8C8C8C"},{...DEFAULT_CUSTOM_FIELD,show:!0,template:"{{ state_attr('sun.sun', 'azimuth') | round(0) }}",fontsize:1.8,fontweight:400,position:75,fontcolor:"#808080",unit:"°",unit_fontsize:1.4,unit_fontweight:400,unit_fontcolor:"#606060"}],rotation_animation_time:.5};class ChronoCompassCardEditor extends LitElement{static properties={hass:{type:Object},_config:{type:Object}};setConfig(e){this._config={...DEFAULT_CONFIG,...e},"dial"!==this._config.compass_rotate&&(this._config.compass_rotate="needle")}_valueChanged(e,t){if(!this._config||!this.hass)return;let i;if(i=void 0!==t.detail?.value?t.detail.value:"HA-SWITCH"===t.target.tagName?t.target.checked:t.target.value,"number"===t.target.type){const e=ccParseNumber(i);if(null==e)return;i=e}this._config={...this._config,[e]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_addNeedle(){const e=[...this._config.needles||[],{...DEFAULT_NEEDLE}];this._config={...this._config,needles:e},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_removeNeedle(e){const t=this._config.needles.filter((t,i)=>i!==e);this._config={...this._config,needles:t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_needleChanged(e,t,i){let o;if("HA-SWITCH"===i.target.tagName)o=i.target.checked;else if(o=i.target.value,"number"===i.target.type){const e=ccParseNumber(o);if(null==e)return;o=e}const s=this._config.needles.map((i,s)=>s===e?{...i,[t]:o}:i);this._config={...this._config,needles:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_addMarker(){const e=[...this._config.markers||[],{...DEFAULT_MARKER}];this._config={...this._config,markers:e},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_removeMarker(e){const t=this._config.markers.filter((t,i)=>i!==e);this._config={...this._config,markers:t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_markerChanged(e,t,i){let o;if("HA-SWITCH"===i.target.tagName)o=i.target.checked;else if(o=i.target.value,"number"===i.target.type){const e=ccParseNumber(o);if(null==e)return;o=e}const s=this._config.markers.map((i,s)=>s===e?{...i,[t]:o}:i);this._config={...this._config,markers:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_fieldChanged(e,t,i){let o;if("HA-SWITCH"===i.target.tagName)o=i.target.checked;else if(o=i.target.value,"number"===i.target.type){const e=ccParseNumber(o);if(null==e)return;o=e}const s=this._config.fields.map((i,s)=>s===e?{...i,[t]:o}:i);this._config={...this._config,fields:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_tickChanged(e,t,i){let o;if("HA-SWITCH"===i.target.tagName)o=i.target.checked;else if(o=i.target.value,"number"===i.target.type){const e=ccParseNumber(o);if(null==e)return;o=e}const s=this._config.ticks.map((i,s)=>s===e?{...i,[t]:o}:i);this._config={...this._config,ticks:s},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config)return html``;const e=this._config;return html`

      <ha-expansion-panel header="Compass configuration" outlined>

      <!-- Compass styling -->
      <div class="compass-styling-grid">
        ${ccColorPicker("Background",this._config.background_color||"#ffffff",e=>this._valueChanged("background_color",e))}
        ${ccTextField("Size",e.compass_size,e=>this._valueChanged("compass_size",e),{type:"number",step:"1"})}
        ${ccColorPicker("Bezel color",this._config.bezel_color||"#ffffff",e=>this._valueChanged("bezel_color",e))}
        ${ccTextField("Bezel width",e.bezel_width,e=>this._valueChanged("bezel_width",e),{type:"number",step:"1",min:"0"})}
      </div>

      <!-- Background image -->
      <div class="background-toggles-grid">
        ${ccToggleField("Background image",e.background_image_show,e=>this._valueChanged("background_image_show",e))}
      </div>
      <div class="background-image-template-grid">
        ${ccTextField("URL (jinja template allowed)",e.background_image_url,e=>this._valueChanged("background_image_url",e))}
      </div>
      <div class="background-image-styling-grid">
        ${ccTextField("X pos",e.background_image_x,e=>this._valueChanged("background_image_x",e),{type:"number",step:"0.5"})}
        ${ccTextField("Y pos",e.background_image_y,e=>this._valueChanged("background_image_y",e),{type:"number",step:"0.5"})}
        ${ccTextField("Scale (%)",e.background_image_scale,e=>this._valueChanged("background_image_scale",e),{type:"number",step:"1",min:"1"})}
        ${ccTextField("Rotate",e.background_image_rotate,e=>this._valueChanged("background_image_rotate",e),{type:"number",step:"1"})}
      </div>

      <!-- Rotate compass -->
      <div class="rotate-compass-toggle-grid">
        ${ccButtonPicker("Rotate",e.compass_rotate,[{label:"Needle",value:"needle"},{label:"Dial",value:"dial"}],e=>this._valueChanged("compass_rotate",e))}
        <div class="toggle-hint"><b>Needle</b> rotates the needle. <b>Dial</b> keeps Needle 1 pointing north while rotating the compass.</div>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Needle configuration" outlined>

      ${(e.needles||[]).map((e,t)=>html`
        <ha-expansion-panel header="${e.name||"Needle "+(t+1)}" outlined>

          <!-- Name -->
          <div class="needle-name-grid">
            ${ccTextField("Name (optional)",e.name||"",e=>this._needleChanged(t,"name",e))}
          </div>

          <!-- Toggles -->
          <div class="needle-toggles-grid">
            ${ccToggleField("Show",e.show,e=>this._needleChanged(t,"show",e))}
            ${ccToggleField("Invert",e.invert,e=>this._needleChanged(t,"invert",e))}
            ${ccToggleField("Rotate 180°",e.rotate,e=>this._needleChanged(t,"rotate",e))}
          </div>

          <!-- Bearing template -->
          <div class="needle-template-grid">
            ${ccTextField("Bearing (jinja template)",e.template,e=>this._needleChanged(t,"template",e))}
          </div>

          <!-- Colors -->
          <div class="needle-color-grid">
            ${ccColorPicker("Color 1",e.color_1||"#FF0000",e=>this._needleChanged(t,"color_1",e))}
            ${ccTextField("Pos (%)",e.color_1_pos,e=>this._needleChanged(t,"color_1_pos",e),{type:"number",step:"1",min:"0",max:"100"})}
            ${ccColorPicker("Color 2",e.color_2||"#EEEEEE",e=>this._needleChanged(t,"color_2",e))}
            ${ccTextField("Pos (%)",e.color_2_pos,e=>this._needleChanged(t,"color_2_pos",e),{type:"number",step:"1",min:"0",max:"100"})}
          </div>

          <!-- Dimensions -->
          <div class="needle-dimensions-grid">
            ${ccTextField("Position",e.position,e=>this._needleChanged(t,"position",e),{type:"number",step:"1"})}
            ${ccTextField("Height",e.height,e=>this._needleChanged(t,"height",e),{type:"number",step:"1",min:"4"})}
            ${ccTextField("Width",e.width,e=>this._needleChanged(t,"width",e),{type:"number",step:"1",min:"1"})}
            ${ccTextField("Morph",e.morph,e=>this._needleChanged(t,"morph",e),{type:"number",step:"1"})}
            ${ccTextField("Curve",e.curve,e=>this._needleChanged(t,"curve",e),{type:"number",step:"1"})}
          </div>

          <!-- Needle image -->
          <div class="needle-image-toggles-grid">
            ${ccToggleField("Needle image",e.image_show,e=>this._needleChanged(t,"image_show",e))}
          </div>
          <div class="needle-image-template-grid">
            ${ccTextField("URL (jinja template allowed)",e.image_url,e=>this._needleChanged(t,"image_url",e))}
          </div>
          <div class="needle-image-styling-grid">
            ${ccTextField("X pos",e.image_x,e=>this._needleChanged(t,"image_x",e),{type:"number",step:"0.5"})}
            ${ccTextField("Y pos",e.image_y,e=>this._needleChanged(t,"image_y",e),{type:"number",step:"0.5"})}
            ${ccTextField("Scale (%)",e.image_scale,e=>this._needleChanged(t,"image_scale",e),{type:"number",step:"1",min:"1"})}
            ${ccTextField("Rotate",e.image_rotate,e=>this._needleChanged(t,"image_rotate",e),{type:"number",step:"1"})}
          </div>

          <!-- Remove button -->
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${()=>this._removeNeedle(t)}>Remove needle</button>
          </div>

        </ha-expansion-panel>
      `)}

      <div class="marker-add-grid">
        <button class="marker-add-btn" @click=${this._addNeedle}>+ Add needle</button>
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Markers configuration" outlined>

      ${(e.markers||[]).map((e,t)=>html`
        <ha-expansion-panel header="Marker ${t+1}" outlined>
          <div class="marker-toggles-grid">
            ${ccToggleField("Show",e.show,e=>this._markerChanged(t,"show",e))}
            ${ccToggleField("Flip",e.flip,e=>this._markerChanged(t,"flip",e))}
          </div>
          <div class="marker-template-grid">
            ${ccTextField("Degrees (jinja template allowed)",e.degrees,e=>this._markerChanged(t,"degrees",e))}
          </div>
          <div class="marker-styling-grid">
            ${ccTextField("Position",e.position,e=>this._markerChanged(t,"position",e),{type:"number",step:"0.5"})}
            ${ccTextField("Height",e.height,e=>this._markerChanged(t,"height",e),{type:"number",step:"0.1",min:"0"})}
            ${ccTextField("Width",e.width,e=>this._markerChanged(t,"width",e),{type:"number",step:"0.1",min:"0"})}
            ${ccColorPicker("Color",e.color||"#FF0000",e=>this._markerChanged(t,"color",e))}
          </div>
          <div class="marker-remove-grid">
            <button class="marker-remove-btn" @click=${()=>this._removeMarker(t)}>Remove marker</button>
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
        ${ccToggleField("Cardinal labels",e.cardinals_show,e=>this._valueChanged("cardinals_show",e),"tick-toggle-field")}
      </div>
      
      <div class="cardinal-labels-grid">
        ${ccTextField("North",e.cardinal_north,e=>this._valueChanged("cardinal_north",e))}
        ${ccTextField("East",e.cardinal_east,e=>this._valueChanged("cardinal_east",e))}
        ${ccTextField("South",e.cardinal_south,e=>this._valueChanged("cardinal_south",e))}
        ${ccTextField("West",e.cardinal_west,e=>this._valueChanged("cardinal_west",e))}
      </div>
      
      <div class="cardinals-styling-grid">
        ${ccTextField("Position",e.cardinals_position,e=>this._valueChanged("cardinals_position",e),{type:"number",step:"0.5"})}
        ${ccTextField("Font size",e.cardinals_fontsize,e=>this._valueChanged("cardinals_fontsize",e),{type:"number",step:"0.5",min:"0"})}
        ${ccTextField("Font weight",e.cardinals_fontweight,e=>this._valueChanged("cardinals_fontweight",e),{type:"number",step:"100",min:"100",max:"900"})}
        ${ccColorPicker("Color",this._config.cardinals_fontcolor||"#ffffff",e=>this._valueChanged("cardinals_fontcolor",e))}
      </div>

      ${(e.ticks||[]).map((e,t)=>{const i=["Primary","Secondary","Tertiary"][t]||`Tier ${t+1}`;return html`
      <!-- ${i} ticks -->
      <div class="tick-toggles-grid">
        ${ccToggleField(`${i} ticks`,e.show,e=>this._tickChanged(t,"show",e),"tick-toggle-field")}
        <div class="toggle-field" style="justify-self:end">
          <chrono-button-toggle-group
            .value=${String(e.linecap)}
            .options=${[{label:"Square",value:"square"},{label:"Round",value:"round"}]}
            @change=${e=>this._tickChanged(t,"linecap",e)}
          ></chrono-button-toggle-group>
        </div>
      </div>
      <div class="tick-styling-grid">
        ${ccTextField("Position",e.position,e=>this._tickChanged(t,"position",e),{type:"number",step:"0.5"})}
        ${ccTextField("Length",e.length,e=>this._tickChanged(t,"length",e),{type:"number",step:"0.1",min:"0"})}
        ${ccTextField("Width",e.width,e=>this._tickChanged(t,"width",e),{type:"number",step:"0.1",min:"0"})}
        ${ccTextField("Divisions",e.divisions,e=>this._tickChanged(t,"divisions",e),{type:"number",step:"1",min:"1"})}
        ${ccColorPicker("Color",e.color||"#ffffff",e=>this._tickChanged(t,"color",e))}
      </div>
        `})}

      </ha-expansion-panel>

      <ha-expansion-panel header="Header &amp; Footer configuration" outlined>

      <!-- Header -->
      <div class="field-toggles-grid">
        ${ccToggleField("Show header",e.header_show,e=>this._valueChanged("header_show",e))}
      </div>
      <div class="field-template-grid">
        ${ccTextField("Header (jinja template allowed)",e.header_text,e=>this._valueChanged("header_text",e))}
      </div>
      <div class="field-styling-grid">
        ${ccTextField("Position",e.header_position,e=>this._valueChanged("header_position",e),{type:"number",step:"1"})}
        ${ccTextField("Font size",e.header_fontsize,e=>this._valueChanged("header_fontsize",e),{type:"number",step:"0.1"})}
        ${ccTextField("Font weight",e.header_fontweight,e=>this._valueChanged("header_fontweight",e),{type:"number",step:"100",min:"100",max:"900"})}
        ${ccColorPicker("Color",this._config.header_fontcolor||"#ffffff",e=>this._valueChanged("header_fontcolor",e))}
      </div>

      <!-- Footer -->
      <div class="field-toggles-grid">
        ${ccToggleField("Show footer",e.footer_show,e=>this._valueChanged("footer_show",e))}
      </div>
      <div class="field-template-grid">
        ${ccTextField("Footer (jinja template allowed)",e.footer_text,e=>this._valueChanged("footer_text",e))}
      </div>
      <div class="field-styling-grid">
        ${ccTextField("Position",e.footer_position,e=>this._valueChanged("footer_position",e),{type:"number",step:"1"})}
        ${ccTextField("Font size",e.footer_fontsize,e=>this._valueChanged("footer_fontsize",e),{type:"number",step:"0.1"})}
        ${ccTextField("Font weight",e.footer_fontweight,e=>this._valueChanged("footer_fontweight",e),{type:"number",step:"100",min:"100",max:"900"})}
        ${ccColorPicker("Color",this._config.footer_fontcolor||"#ffffff",e=>this._valueChanged("footer_fontcolor",e))}
      </div>

      </ha-expansion-panel>

      <ha-expansion-panel header="Custom fields configuration" outlined>

      ${(e.fields||[]).map((e,t)=>html`

      <!-- Field ${t+1} -->
      <div class="field-toggles-grid">
        ${ccToggleField(`Show Field ${t+1}`,e.show,e=>this._fieldChanged(t,"show",e))}
      </div>
      <div class="field-template-grid">
        ${ccTextField("Text (jinja template allowed)",e.template,e=>this._fieldChanged(t,"template",e))}
      </div>
      <div class="field-styling-grid">
        ${ccTextField("Position (%)",e.position,e=>this._fieldChanged(t,"position",e),{type:"number",step:"1"})}
        ${ccTextField("Font size",e.fontsize,e=>this._fieldChanged(t,"fontsize",e),{type:"number",step:"0.1"})}
        ${ccTextField("Font weight",e.fontweight,e=>this._fieldChanged(t,"fontweight",e),{type:"number",step:"100",min:"100",max:"900"})}
        ${ccColorPicker("Color",e.fontcolor||"#ffffff",e=>this._fieldChanged(t,"fontcolor",e))}
      </div>
      <div class="field-unit-grid">
        ${ccTextField("Unit",e.unit,e=>this._fieldChanged(t,"unit",e))}
        ${ccTextField("Font size",e.unit_fontsize,e=>this._fieldChanged(t,"unit_fontsize",e),{type:"number",step:"0.1"})}
        ${ccTextField("Font weight",e.unit_fontweight,e=>this._fieldChanged(t,"unit_fontweight",e),{type:"number",step:"100",min:"100",max:"900"})}
        ${ccColorPicker("Color",e.unit_fontcolor||"#ffffff",e=>this._fieldChanged(t,"unit_fontcolor",e))}
      </div>

      `)}

      </ha-expansion-panel>
    `}static styles=css`
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

  `}customElements.define("chrono-compass-card-editor",ChronoCompassCardEditor);class ChronoCompassCard extends LitElement{static properties={_fieldValues:{type:Array},_headerValue:{type:String},_footerValue:{type:String},_markerDegrees:{type:Array},_backgroundImageUrl:{type:String},_needleImageUrls:{type:Array}};constructor(){super(),this._needleDegrees=[],this._needlePrevDegrees=[],this._templateUnsubs=[],this._subscriptionsActive=!1,this._fieldValues=[],this._headerValue="",this._footerValue="",this._markerDegrees=[],this._backgroundImageUrl="",this._needleImageUrls=[]}set hass(e){this._hass=e,this._config&&!this._subscriptionsActive&&this._setupSubscriptions()}get hass(){return this._hass}setConfig(e){this._config={...DEFAULT_CONFIG,...e},"dial"!==this._config.compass_rotate&&(this._config.compass_rotate="needle");const t=this._config,i=112-(parseFloat(t.compass_size)??100);this.style.setProperty("--cc-compass-margin",`${i}%`),this.style.setProperty("--cc-bezel-width",parseFloat(t.bezel_width)/2+"cqi"),this.style.setProperty("--cc-bezel-color",t.bezel_color),this.style.setProperty("--cc-bezel-radius",`${parseFloat(t.bezel_radius)}%`),this.style.setProperty("--cc-background-color",t.background_color),this.style.setProperty("--cc-animation-duration",`${t.rotation_animation_time}s`),this._hass&&!this._subscriptionsActive&&this._setupSubscriptions()}get config(){return this._config}connectedCallback(){super.connectedCallback(),this._hass&&this._config&&this._setupSubscriptions()}disconnectedCallback(){super.disconnectedCallback(),this._teardownSubscriptions()}_setupSubscriptions(){if(this._teardownSubscriptions(),!this.hass?.connection||!this.config)return;this._subscriptionsActive=!0;const e=(e,t)=>{const i=String(e);if(!i.includes("{{"))return void t(i);const o=this.hass.connection.subscribeMessage(e=>t(e.result),{type:"render_template",template:i});this._templateUnsubs.push(o)};(this.config.needles||[]).forEach((t,i)=>{e(t.template,e=>{const t=parseFloat(e);if(isNaN(t))this._needleDegrees[i]=0,this._needlePrevDegrees[i]=null,this.requestUpdate();else{const e=(t%360+360)%360,o=this._needlePrevDegrees[i]??null,s=this._needleDegrees[i]??e;if(e!==o){let t=e-(s%360+360)%360;t>180&&(t-=360),t<-180&&(t+=360),this._needleDegrees[i]=s+t,this._needlePrevDegrees[i]=e,this.requestUpdate()}}0===i&&this._updateCompassDirectionFields()})});for(const t of this._fieldDefs){if(!t.show){this._fieldValues[t.index]="";continue}const i=t.index;e(String(t.template),e=>{const t=[...this._fieldValues];t[i]=String(e).replace("${compass_direction}",this.getCompassDirection(this._needleDegrees[0]??0)),this._fieldValues=t})}this.config.header_show&&this.config.header_text?e(this.config.header_text,e=>{this._headerValue=e}):this._headerValue="",this.config.footer_show&&this.config.footer_text?e(this.config.footer_text,e=>{this._footerValue=e}):this._footerValue="",this._markerDegrees=[],(this.config.markers||[]).forEach((t,i)=>{e(t.degrees,e=>{const t=[...this._markerDegrees];t[i]=(parseFloat(e)%360+360)%360,this._markerDegrees=t})}),this.config.background_image_show?e(this.config.background_image_url,e=>{this._backgroundImageUrl=e}):this._backgroundImageUrl="",this._needleImageUrls=[],(this.config.needles||[]).forEach((t,i)=>{if(t.image_show)e(t.image_url,e=>{const t=[...this._needleImageUrls];t[i]=e,this._needleImageUrls=t});else{const e=[...this._needleImageUrls];e[i]="",this._needleImageUrls=e}})}_updateCompassDirectionFields(){const e=this.getCompassDirection(this._needleDegrees[0]??0);for(const t of this._fieldDefs){if(!t.show)continue;const i=String(t.template);if(!i.includes("${compass_direction}"))continue;if(i.includes("{{"))continue;const o=[...this._fieldValues];o[t.index]=i.replace("${compass_direction}",e),this._fieldValues=o}}get _fieldDefs(){return(this.config.fields||[]).map((e,t)=>({index:t,show:e.show,template:e.template}))}_teardownSubscriptions(){const e=this._templateUnsubs;this._templateUnsubs=[],this._subscriptionsActive=!1;for(const t of e)Promise.resolve(t).then(e=>e().catch(()=>{})).catch(()=>{})}getCompassDirection(e){const t=(e%360+360)%360,i=this.config.cardinal_north,o=this.config.cardinal_east,s=this.config.cardinal_south,n=this.config.cardinal_west;return[i,i+i+o,i+o,o+i+o,o,o+s+o,s+o,s+s+o,s,s+s+n,s+n,n+s+n,n,n+i+n,i+n,i+i+n][Math.floor((t+11.25)/22.5)%16]}_buildNeedlePath(e,t,i,o,s,n){const a=s/2;let r=[{x:50,y:0},{x:50-a,y:n},{x:50,y:n+e},{x:50+a,y:n}];const l=t/50*.5523,d=l*a,c=l*n,g=l*e;let h=[{in:{x:1,y:0},out:{x:-1,y:0},inDist:d,outDist:d},{in:{x:0,y:-1},out:{x:0,y:1},inDist:c,outDist:g},{in:{x:-1,y:0},out:{x:1,y:0},inDist:d,outDist:d},{in:{x:0,y:1},out:{x:0,y:-1},inDist:g,outDist:c}];i&&(r.forEach(e=>{e.y=n-e.y}),h.forEach(e=>{e.in.y=-e.in.y,e.out.y=-e.out.y})),r.forEach(e=>{e.y+=50-n-o});const p=r.map((e,t)=>({in:{x:e.x+h[t].in.x*h[t].inDist,y:e.y+h[t].in.y*h[t].inDist},out:{x:e.x+h[t].out.x*h[t].outDist,y:e.y+h[t].out.y*h[t].outDist}}));let m=`M ${r[0].x},${r[0].y}`;for(let e=0;e<r.length;e++){const t=(e+1)%r.length;m+=` C ${p[e].out.x},${p[e].out.y} ${p[t].in.x},${p[t].in.y} ${r[t].x},${r[t].y}`}return m+=" Z",m}_renderTicks(){const e=this.config,t=50,i=[e.cardinal_north,e.cardinal_east,e.cardinal_south,e.cardinal_west],o=e=>Math.round(10*e)/10,s=new Set,n=[];e.cardinals_show&&[0,90,180,270].forEach((t,a)=>{s.add(o(t));const r=t*Math.PI/180,l=Math.sin(r),d=Math.cos(r),c=50+(52.5+(e.cardinals_position||0))*l,g=50-(52.5+(e.cardinals_position||0))*d,h=.85*e.cardinals_fontsize,p=c-h*l,m=g+h*d;n.push({type:"text",x:p,y:m,letter:i[a],fontSize:e.cardinals_fontsize,fontWeight:e.cardinals_fontweight,color:e.cardinals_fontcolor})});(e.ticks||[]).map(e=>({show:e.show,linecap:e.linecap||"round",divisions:parseInt(e.divisions)||4,length:e.length,width:e.width,color:e.color,position:e.position||0})).forEach((e,i)=>{if(e.show){const a=360/e.divisions;for(let r=0;r<e.divisions;r++){const l=o(r*a);if(0!==i&&s.has(l))continue;s.add(l);const d=l*Math.PI/180,c=Math.sin(d),g=Math.cos(d),h=Math.max(parseFloat(e.length),.001),p=parseFloat(e.width),m=parseFloat(e.position),f=50+(t+m)*c,_=50-(t+m)*g,u=50+(t+m-h)*c,x=50-(t+m-h)*g;n.push({type:"line",x1:f,y1:_,x2:u,y2:x,color:e.color,width:p,linecap:e.linecap})}}});const a=(e.markers||[]).map((e,t)=>({show:e.show,degrees:this._markerDegrees[t]??0,height:parseFloat(e.height),width:parseFloat(e.width),position:parseFloat(e.position),color:e.color,flip:e.flip})).map(e=>{if(!e.show)return null;const i=e.degrees*Math.PI/180,o=Math.sin(i),s=Math.cos(i),n=t+e.position,a=n+e.height,r=50+(e.flip?a:n)*o,l=50-(e.flip?a:n)*s,d=50+(e.flip?n:a)*o,c=50-(e.flip?n:a)*s,g=e.width/2,h=d+g*s,p=c+g*o,m=d-g*s,f=c-g*o;return{color:e.color,path:`M ${r},${l} L ${h},${p} L ${m},${f} Z`}}).filter(Boolean);return html`
      <div class="compass-ticks-layer">
        <svg class="compass-ticks" viewBox="0 0 100 100" preserveAspectRatio="none">
          ${n.map(e=>"text"===e.type?svg`
              <text x="${e.x}" y="${e.y}" text-anchor="middle" dominant-baseline="central"
                    font-size="${e.fontSize}" font-weight="${e.fontWeight}" fill="${e.color}">${e.letter}</text>
            `:svg`
              <line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}"
                    stroke="${e.color}" stroke-width="${e.width}" stroke-linecap="${e.linecap||"round"}"/>
            `)}
          ${a.map(e=>svg`<path d="${e.path}" fill="${e.color}" />`)}
        </svg>
      </div>
    `}_fieldStyle(e){return`font-size:${8*e.fontsize}cqi; font-weight:${e.fontweight}; color:${e.fontcolor}; top:${e.position}%;`}_unitStyle(e){return`font-size:${8*e.unit_fontsize}cqi; font-weight:${e.unit_fontweight}; color:${e.unit_fontcolor};`}render(){const e=this.config||{},t=e.needles||[],i=this._needleDegrees[0]??0,o="dial"===e.compass_rotate?-i:0,s=(e.fields||[]).map((e,t)=>({index:t,show:e.show,unit:e.unit,fontsize:parseFloat(e.fontsize),fontweight:e.fontweight,position:e.position,fontcolor:e.fontcolor,unit_fontsize:parseFloat(e.unit_fontsize),unit_fontweight:e.unit_fontweight,unit_fontcolor:e.unit_fontcolor})),n=e=>e.show?html`
        <div class="field field-${e.index}" style=${this._fieldStyle(e)}>
          ${this._fieldValues[e.index]??""}${e.unit?html`<span style=${this._unitStyle(e)}>${e.unit}</span>`:""}
        </div>
      `:html``,a=(e,t)=>{if(!e.show)return html``;if(void 0===this._needleDegrees[t])return html``;const i=this._needleDegrees[t],o=e.rotate?i+180:i,s=this._buildNeedlePath(parseFloat(e.morph),parseFloat(e.curve),e.invert,parseFloat(e.position),parseFloat(e.width),parseFloat(e.height)),n=`needleGradient-${t}`,a=this._needleImageUrls[t]||"",r=parseFloat(e.width)/2,l=parseFloat(e.height),d=parseFloat(e.morph),c=50-l-parseFloat(e.position),g=e.invert?[{x:50,y:l+c},{x:50-r,y:0+c},{x:50,y:-d+c},{x:50+r,y:0+c}]:[{x:50,y:0+c},{x:50-r,y:l+c},{x:50,y:l+d+c},{x:50+r,y:l+c}],h=Math.min(...g.map(e=>e.x)),p=Math.max(...g.map(e=>e.x)),m=Math.min(...g.map(e=>e.y)),f=Math.max(...g.map(e=>e.y)),_=(h+p)/2,u=(m+f)/2,x=e.invert?e.color_2:e.color_1,b=e.invert?100-parseFloat(e.color_2_pos):parseFloat(e.color_1_pos),v=e.invert?e.color_1:e.color_2,y=e.invert?100-parseFloat(e.color_1_pos):parseFloat(e.color_2_pos);return html`
        <div class="compass-needle-layer" style="transform:rotate(${o}deg)">
          <svg class="compass-needle"
               viewBox="0 0 100 100"
               preserveAspectRatio="none">
            <defs>
              <linearGradient id="${n}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"        stop-color="${x}" />
                <stop offset="${b}%" stop-color="${x}" />
                <stop offset="${y}%" stop-color="${v}" />
                <stop offset="100%"      stop-color="${v}" />
              </linearGradient>
            </defs>
            ${e.image_show&&a?svg`
              <image
                href="${a}"
                x="${h}" y="${m}" width="${p-h}" height="${f-m}"
                preserveAspectRatio="xMidYMid meet"
                transform="translate(${_},${u}) rotate(${e.image_rotate}) scale(${e.image_scale/100}) translate(${e.image_x}, ${-e.image_y}) translate(${-_},${-u})"
              />
            `:svg`
              <path d="${s}" fill="url(#${n})" />
            `}
          </svg>
        </div>
      `};return html`
      <ha-card>
        <div class="compass-container">
          ${e.header_show?html`
            <div class="card-header-text" style="font-size:${e.header_fontsize}em; font-weight:${e.header_fontweight}; color:${e.header_fontcolor}; top:calc(${6}cqi - ${e.header_position}cqi);">
              ${this._headerValue.split("<br>").map((e,t,i)=>html`${e}${t<i.length-1?html`<br>`:""}`)}
            </div>
          `:""}
          <div class="compass-layer">
            <div class="compass-bezel-layer">
              ${e.background_image_show&&this._backgroundImageUrl?html`
                <img class="compass-bg-image"
                  src="${this._backgroundImageUrl}"
                  style="transform: translate(-50%, -50%) translate(${e.background_image_x}%, ${-e.background_image_y}%) rotate(${e.background_image_rotate}deg) scale(${e.background_image_scale/100});"
                />
              `:""}
              ${s.map(e=>n(e))}
            </div>
            <div class="compass-rotate-group" style="transform:rotate(${o}deg)">
              ${this._renderTicks()}
              ${[...t].reverse().map((e,i)=>a(e,t.length-1-i))}
            </div>
          </div>
          ${e.footer_show?html`
            <div class="card-footer-text" style="font-size:${e.footer_fontsize}em; font-weight:${e.footer_fontweight}; color:${e.footer_fontcolor}; bottom:calc(${6}cqi + ${e.footer_position}cqi);">
              ${this._footerValue.split("<br>").map((e,t,i)=>html`${e}${t<i.length-1?html`<br>`:""}`)}
            </div>
          `:""}
        </div>
      </ha-card>
    `}static styles=css`
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
  `;static getCardSize(){return 4}static getConfigElement(){return document.createElement("chrono-compass-card-editor")}static getStubConfig(){return{...DEFAULT_CONFIG}}}customElements.define("chrono-compass-card",ChronoCompassCard),console.info("%c CHRONO-COMPASS-CARD %c v4.4.802 ","background-color: #29b6cf; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 3px 0 0 3px;","background-color: #1e1e1e; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;"),window.customCards=window.customCards||[],window.customCards.push({type:"chrono-compass-card",name:"Chrono Compass Card",description:"A fully configurable compass card with dynamic fields.",preview:!0,config:ChronoCompassCard.getStubConfig()});
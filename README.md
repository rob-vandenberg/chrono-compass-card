# Chrono Compass Card for Home Assistant

<div align="center">
  <img src="[https://via.placeholder.com/800x400?text=Chrono+Compass+Hero+Image](https://via.placeholder.com/800x400?text=Chrono+Compass+Hero+Image)" width="800" alt="Chrono Compass Card Banner">
  
  <p align="center">
    <strong>A high-performance, SVG-driven instrumentation framework for Home Assistant.</strong>
  </p>

  <p align="center">
    <a href="#introduction">Introduction</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#visual-showcase">Showcase</a> •
    <a href="#installation">Installation</a> •
    <a href="#configuration">Configuration</a> •
    <a href="#license">License</a>
  </p>

  [![](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
  [![](https://img.shields.io/badge/License-AGPL_3.0-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)
  [![](https://img.shields.io/badge/Version-4.3.723-brightgreen.svg?style=for-the-badge)](#)
</div>

---

The **Chrono Compass Card** is a professional-grade vector rendering engine designed to bring advanced directional instrumentation to the Home Assistant dashboard. While the underlying technology is versatile enough to support clock faces and celestial tracking, its primary architectural focus is **precision compass telemetry**.

By utilizing client-side SVG rendering, the card provides fluid, real-time feedback for wind bearings, sun azimuth, and navigation data without the performance overhead typical of heavy image-based dials.

---

## 📋 Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Visual Showcase](#visual-showcase)
- [Installation](#installation)
  - [HACS (Recommended)](#hacs-recommended)
  - [Manual Installation](#manual-installation)
- [Uninstallation](#uninstallation)
- [Configuration](#configuration)
  - [Main Options](#main-options)
  - [Needle Objects](#needle-objects)
  - [Marker Objects](#marker-objects)
- [License](#license)
- [Support](#support)

---

## 🚀 Key Features

### 🧭 Directional Instrumentation First
Designed specifically for navigational and meteorological data. The card supports both **Needle Rotation** (fixed dial) and **Dial Rotation** (where the compass rose itself turns relative to a fixed North), ensuring a professional instrumentation experience.

### 🎨 Needle Morphing Technology
Needles are generated programmatically rather than using static assets. This allows you to adjust "morph" factors to transform a needle from a utilitarian pointer into a broad, curved aesthetic directly within the browser.

### 🛠️ Visual Configuration Suite
The Chrono Compass Card features a comprehensive built-in **Visual Editor**. You can adjust every bezel, tick mark, and color gradient via a graphical interface, significantly reducing the reliance on manual YAML editing.

### 🔗 Jinja2 Template Ingestion
Integrate your instruments deeply with the Home Assistant ecosystem. The card natively supports Jinja2 templates for bearings, labels, and image paths, allowing your UI to react dynamically to any entity state or attribute.

---

## 🖼️ Visual Showcase

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img src="[https://via.placeholder.com/400x400?text=Compass+Standard+View](https://via.placeholder.com/400x400?text=Compass+Standard+View)" alt="Standard Compass"/><br/>
        <b>Precision Directional Data</b>
      </td>
      <td width="50%">
        <img src="[https://via.placeholder.com/400x400?text=Visual+Editor+UI](https://via.placeholder.com/400x400?text=Visual+Editor+UI)" alt="Visual Editor"/><br/>
        <b>Zero-YAML Visual Editor</b>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="[https://via.placeholder.com/400x400?text=Solar+Tracking+Showcase](https://via.placeholder.com/400x400?text=Solar+Tracking+Showcase)" alt="Solar Tracking"/><br/>
        <b>Celestial Instrumentation (Showcase)</b>
      </td>
      <td width="50%">
        <img src="[https://via.placeholder.com/400x400?text=Morphing+Needle+Demo](https://via.placeholder.com/400x400?text=Morphing+Needle+Demo)" alt="Morphing Demo"/><br/>
        <b>Variable Needle Geometry</b>
      </td>
    </tr>
  </table>
</div>

---

## 📦 Installation

### HACS (Recommended)
1. Open **HACS** in your Home Assistant instance.
2. Navigate to **Frontend** and click the three dots in the top right.
3. Select **Custom repositories**.
4. Paste the URL of this repository and select **Lovelace** as the category.
5. Search for `Chrono Compass Card` and click **Download**.

### Manual Installation
1. Download the `chrono-compass-card.js` file from the [latest release](https://github.com/your-repo/releases).
2. Upload the file to your `/config/www/` directory.
3. Add the following to your Resources in **Settings > Dashboards > Resources**:
   - **URL:** `/local/chrono-compass-card.js`
   - **Type:** `JavaScript Module`

---

## 🗑️ Uninstallation

To completely remove the Chrono Compass Card from your system:

1. **Delete Card Instances:** Remove all `custom:chrono-compass-card` entries from your Lovelace dashboards.
2. **Remove Resource:** Go to **Settings > Dashboards > Resources** and delete the entry for `/local/chrono-compass-card.js`.
3. **Delete Files:**
   - If using **HACS**: Go to HACS > Frontend, find the card, and select **Remove**.
   - If **Manual**: Delete the `.js` file from your `www` directory.
4. **Cache Clear:** Perform a hard refresh in your browser (Ctrl+F5) to ensure the cached card definition is cleared.

---

## ⚙️ Configuration

The following schema is used for YAML configuration, though the **Visual Editor** is the recommended tool for adjustment.

### Main Options
| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | string | **Required** | `custom:chrono-compass-card` |
| `compass_size` | number | `100` | The relative size of the compass engine |
| `compass_rotate` | string | `needle` | Set to `needle` (default) or `dial` |
| `bezel_width` | number | `25` | The thickness of the outer bezel ring |
| `bezel_color` | string | `#383838` | The color of the bezel layer |

### Needle Objects
The `needles` array supports multiple instrumentation layers.
| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `template` | string | *Jinja2* | Sensor value or calculation for the bearing |
| `morph` | number | `40` | Curvature factor of the needle path |
| `height` | number | `40` | Vertical length of the needle |
| `width` | number | `7` | Horizontal width of the needle |

### Marker Objects
| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `degrees` | string | `0` | Static or dynamic position of the marker |
| `color` | string | `#FF0000` | The color of the marker element |

---

## ⚖️ License

**GNU AFFERO GENERAL PUBLIC LICENSE (AGPL-3.0)**

This project is licensed under the AGPL-3.0. You may redistribute and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation. 

Copyright © 2026 Chrono Compass Project.

---

## ☕ Support

If you find this project useful and wish to support its continued development, please consider a contribution.

[![](https://img.shields.io/badge/Buy_Me_A_Coffee-Support-yellow.svg?style=for-the-badge)](https://www.buymeacoffee.com/)

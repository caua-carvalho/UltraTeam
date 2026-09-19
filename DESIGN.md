---
name: Tactical Operations Command
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1a1c1e'
  surface-container: '#1e2022'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#b9ccb5'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#2f3033'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e55b'
  primary: '#edffe8'
  on-primary: '#003911'
  primary-container: '#00ff66'
  on-primary-container: '#007128'
  inverse-primary: '#006e27'
  secondary: '#bdc8d3'
  on-secondary: '#28313a'
  secondary-container: '#404a54'
  on-secondary-container: '#afbac5'
  tertiary: '#fff9f5'
  on-tertiary: '#412d00'
  tertiary-container: '#ffd895'
  on-tertiary-container: '#805b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff83'
  primary-fixed-dim: '#00e55b'
  on-primary-fixed: '#002107'
  on-primary-fixed-variant: '#00531b'
  secondary-fixed: '#d9e4ef'
  secondary-fixed-dim: '#bdc8d3'
  on-secondary-fixed: '#131d25'
  on-secondary-fixed-variant: '#3e4851'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#ffba20'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#121316'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
typography:
  headline-xl:
    fontFamily: Oswald
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: 0.06em
  headline-xl-mobile:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.05em
  headline-lg:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Oswald
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.04em
  headline-md:
    fontFamily: Oswald
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.04em
  headline-sm:
    fontFamily: Oswald
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.04em
  body-lg:
    fontFamily: Chivo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Chivo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Chivo
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.08em
  telemetry-display:
    fontFamily: JetBrains Mono
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves high-endurance operators and ultramarathon athletes operating under extreme physical and psychological stress. The brand identity fuses tier-one special operations doctrine with ruthless endurance athletic execution: mental callousness, zero-tolerance accountability, and absolute precision.

The design movement is **Tactical HUD / Brutalist Telemetry**:
- High-contrast night-vision legibility tailored for pitch-black environments, headlamp illumination, and rain-slicked screens.
- Zero decorative softness; every element serves tactical situational awareness.
- HUD conventions including corner ticks, coordinate indices, reticles, scanline backdrops, and raw mission-critical telemetry.
- Emotional resonance: cold determination, hyper-vigilance, absolute resilience, and militaristic discipline.

## Colors

The palette is engineered for tactical war room displays and nocturnal outdoor field conditions:

- **Primary (`#00FF66` - Electric Military Lime):** Aggressive optical focal point. Reserved for active targeting, primary telemetry pulses, verified operator status, and definitive action triggers.
- **Secondary (`#2A343D` - Stealth Cold Slate):** Structural scaffolding, panel dividers, reticle brackets, and inactive control surfaces.
- **Tertiary (`#FFB800` - Tactical Alert Amber):** Warning, threshold breaches, impending time-caps, and pending execution states.
- **Neutral (`#060709` - Absolute Void Black):** The deepest foundation. Eliminates display glare and saves OLED power on field devices.
- **Functional Semantics:**
  - **Surface Container Base (`#0A0A0A`):** Core background for deep canvas zones.
  - **Surface Container Elevation 1 (`#14171A`):** Tactical card panels and HUD modular bays.
  - **Surface Container Elevation 2 (`#1A1F24`):** Active telemetry blocks, floating drawers, and popovers.
  - **Combat Alert Red (`#FF2A3D`):** DNF, missed checkpoints, bio-failure, heart-rate ceiling violations, AWOL statuses.
  - **Mission Complete (`#00E676`):** Objective cleared, sector pacified, mileage logged.
  - **Text High-Contrast (`#FFFFFF`):** Primary readings, vital stats, tactical headers.
  - **Text Tactical Muted (`#8F9CA8`):** Coordinates, technical specs, timestamps, baseline metadata.

## Typography

The typography reinforces operational discipline through rigid optical hierarchy:

- **Display & Headings (Oswald):** Condensed, commanding, and monolithic. Rendered exclusively in UPPERCASE with expanded tracking (`0.04em` to `0.06em`) to invoke military field manifests, callsigns, and tactical briefing boards.
- **Mission Logs & Body Text (Chivo):** Crisp, sharp, neutral sans-serif delivering unambiguous scanning legibility during high-velocity movement and severe exhaustion.
- **Technical Telemetry & Badges (JetBrains Mono):** Monospaced precision for tabular biometric readouts, geographic coordinates (LAT/LON, MGRS), split times, heart rate variability, and terminal prompts. Ensures strict column alignment across real-time dynamic data feeds.

## Layout & Spacing

Layout follows a strict, mathematical HUD telemetry grid modeled after command-center multi-monitor consoles:

- **Grid Architecture:** Desktop views deploy a 12-column tactical grid with tight `1.5rem` gutters, minimizing dead space and maximizing high-density data packaging. Tablet collapses to 8 columns; mobile collapses to 4 columns.
- **Rhythm & Padding:** Strict 4px base increment (`0.25rem`). Component padding adheres strictly to `space-sm` (8px) for compact telemetry modules, `space-md` (16px) for standard panels, and `space-lg` (24px) for major mission briefings.
- **Tactical Coordinate Frame:** The primary viewport contains outer framing margins anchored by coordinate stamps (e.g., `SEC-04 // 45.109.882` at top-left and `ZULU TIME` at top-right). Content panels fit edge-to-edge within internal borders to prevent ambient drift.

## Elevation & Depth

This design system rejects diffused ambient blur and soft drop shadows. Depth is achieved via **Tonal Stacking and High-Contrast Mechanical Outlines**:

- **Ground Level (Elevation 0):** `#060709` solid void canvas.
- **Tactical Panels (Elevation 1):** `#14171A` background encased by a `1px` structural border in `#2A343D`.
- **Targeting / Elevated Layers (Elevation 2):** `#1A1F24` surface with a `1px` accent border in `#00FF66` or `#FFB800`.
- **Active Reticle Glow:** Critical alerts or active operators receive an ultra-sharp, non-diffuse glow (`box-shadow: 0 0 0 1px #00FF66, 0 0 8px rgba(0, 255, 102, 0.45)`).
- **HUD Markings:** Tactical brackets (`+` markers at grid intersections, corner crop-marks `L` on cards) are layered directly on top of panel borders to simulate optical crosshairs.

## Shapes

The interface is entirely devoid of organic curvature. The shape language is strictly **Sharp (`0px` default, with selective `2px` micro-bevels or 45-degree tactical chamfers)**:

- Standard modules, metric tiles, buttons, and status containers use hard 90-degree right angles (`border-radius: 0px`).
- Specialized tactical panels and primary action containers may employ a clipped corner (`clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)`) to emulate reinforced combat electronics and field hardware casings.

## Components

### Buttons & Trigger Controls
- **Primary Mission Button:** Flat `#00FF66` background, pitch-black `#060709` bold Oswald text, zero border-radius, `0.08em` tracking. Hover initiates a monochrome invert with an electric green inner perimeter.
- **Secondary / Stealth Action:** `#14171A` background, `1px solid #2A343D`, white mono text. Hover transforms border to `#00FF66` with electric lime text.
- **Destructive / Abort Trigger:** `#14171A` background, `1px solid #FF2A3D`, text in `#FF2A3D`. Hover fills `#FF2A3D` with pure black text.

### Military Status Chips & Badges
- Encased in `1px` high-contrast outlines with letter-spacing `0.1em` uppercase JetBrains Mono.
- **ACTIVE:** `#00FF66` border and text with `rgba(0, 255, 102, 0.1)` fill.
- **MIA / CRITICAL:** `#FF2A3D` border and text with `rgba(255, 42, 61, 0.15)` fill.
- **AWOL / PENALTY:** Solid `#FF2A3D` fill with pure `#000000` text.
- **OPERATOR ID:** Cold slate `#2A343D` border with `#8F9CA8` text, prefixed with tactical index hashes (`#OP-08`).

### Telemetry Cards & War Room Modules
- Built on `#14171A` with a crisp `1px solid #2A343D` perimeter.
- Top-left of every card features a bracketed micro-header (e.g., `[ GRID REF: 38°53'N / ELEV: +1,240M ]`).
- Corner ticks: CSS pseudo-elements generate `4px` corner brackets simulating target acquisition windows.

### Form Inputs & Terminal Fields
- Dark recessed background `#0A0A0A`, bottom border only (`2px solid #2A343D`), text in pure `#FFFFFF` mono.
- On focus: bottom border illuminates to `#00FF66`, displaying a blinking block cursor (`▋`).

### Telemetry Lists & Mission Logs
- Striped with alternating `#0A0A0A` and `#14171A` rows.
- Left-edge status indicator stripe (2px solid) indicating sector status: green for on-pace, amber for warning, red for cardiac/pace drop.
- Numerical columns right-aligned in JetBrains Mono with tabular figures enabled (`font-variant-numeric: tabular-nums`).

### Reticle Checkboxes & Selectors
- Replaced standard rounded checkboxes with 12px square target indicators.
- Unchecked: `#2A343D` square outline. Checked: solid `#00FF66` center square fill with crosshair reticle pips extending 2px outside the bounds.
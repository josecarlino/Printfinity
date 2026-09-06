---
name: Precision Dark
colors:
  surface: '#161618'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c4c7c5'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#8e928f'
  outline-variant: '#444846'
  surface-tint: '#c6c7c5'
  primary: '#ffffff'
  on-primary: '#2f3130'
  primary-container: '#e2e3e1'
  on-primary-container: '#636563'
  inverse-primary: '#5d5f5d'
  secondary: '#c6c6ce'
  on-secondary: '#2f3037'
  secondary-container: '#45464d'
  on-secondary-container: '#b5b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#342f2f'
  tertiary-container: '#eae0df'
  on-tertiary-container: '#696362'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e3e1'
  primary-fixed-dim: '#c6c7c5'
  on-primary-fixed: '#1a1c1b'
  on-primary-fixed-variant: '#454746'
  secondary-fixed: '#e2e2ea'
  secondary-fixed-dim: '#c6c6ce'
  on-secondary-fixed: '#1a1b21'
  on-secondary-fixed-variant: '#45464d'
  tertiary-fixed: '#eae0df'
  tertiary-fixed-dim: '#cdc4c4'
  on-tertiary-fixed: '#1f1b1a'
  on-tertiary-fixed-variant: '#4b4545'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
  surface-subtle: '#1B1B1E'
  border: '#26262A'
  border-hover: '#3F3F46'
  text-primary: '#F5F5F5'
  text-secondary: '#9A9AA2'
  text-on-primary: '#0B0B0C'
  status-delivered-text: '#34D399'
  status-delivered-bg: rgba(52, 211, 153, 0.12)
  status-progress-text: '#FB923C'
  status-progress-bg: rgba(251, 146, 60, 0.12)
  status-new-text: '#A1A1AA'
  status-new-bg: rgba(161, 161, 170, 0.12)
typography:
  display:
    fontFamily: inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  table-header:
    fontFamily: inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  metric-display:
    fontFamily: inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 2.5rem
  space-3xl: 3rem
  layout-margin-mobile: 1rem
  layout-margin-desktop: 2rem
  layout-max-width: 1200px
---

## Brand & Style

This design system delivers an industrial, high-precision dark interface tailored for modern 3D printing and digital fabrication studios. The aesthetic is utilitarian, calculated, and minimal—eschewing decorative fluff in favor of crisp legibility, exact numeric data, and tactile clarity. 

Drawing from modern technical minimalism and developer tool architectures, the interface relies on structured monochromatic planes offset by luminous translucent indicators. The visual tone evokes quiet competence, mechanical precision, and studio craftsmanship, instilling immediate operational confidence for makers managing materials, machine runtime, and order fulfillment.

## Colors

The palette operates on high-contrast monochromatic values paired with functional chromatic status cues:

- **Base Environment**: `#0B0B0C` provides a deep, warm-tinted void that eliminates pure black glare while granting maximum depth.
- **Structural Surfaces**: `#161618` lifts interactive panels, cards, and modal sheets off the canvas. Dividers and component boundaries use `#26262A`.
- **Primary Action**: `#F4F4F2` (Warm Ivory) acts as an assertive primary beacon across dark surfaces, paired strictly with `#0B0B0C` bold text for immediate focus.
- **Translucent Status Badges**: Contextual feedback utilizes luminous alpha washes (`rgba(..., 0.12)`) paired with solid saturated typography to prevent visual noise while retaining instant recognizability.

## Typography

The typographic hierarchy is built exclusively around **Inter**, emphasizing geometric uniformity, open counters, and high numerical legibility.

- **Headings & Values**: Titles and financial metrics employ weights 600–700 with negative tracking for an authoritative, compact footprint.
- **Table Headers**: Defined with `table-header`, uppercase casing, wide tracking (`0.08em`), and muted coloring (`#9A9AA2`) to structure complex production listings cleanly.
- **Monospaced Numbers**: For cost calculators, order totals, and weight/time inputs, use tabular numerals (`font-variant-numeric: tabular-nums`) to ensure alignment along data grids.

## Layout & Spacing

This design system uses a constrained fluid grid system built on an 8px base rhythm (with 4px micro-increments):

- **Grid Architecture**: Standard 12-column desktop layout maxing out at `1200px` for optimal data density without horizontal dispersion.
- **Responsive Adaptations**:
  - **Desktop (≥1024px)**: 24px gutters, 32px lateral page margins. Split-screen arrangements (e.g., 8-column calculation input paired with a 4-column sticky summary card).
  - **Tablet (768px - 1023px)**: 16px gutters, 24px margins. Summary and secondary panels stack beneath main workflows.
  - **Mobile (<768px)**: Single-column flow with 16px lateral padding. Tables transition into scrollable cards or horizontally pinned views. Modals convert to bottom sheets.

## Elevation & Depth

In alignment with pure contrast-driven design, **drop shadows are eliminated**. Spatial depth and layer stacking are achieved strictly through tonal surfaces, fine outlines, and backdrop overlays:

- **Level 0 (Canvas Base)**: `#0B0B0C` — Underlying application canvas.
- **Level 1 (Cards & Data Tables)**: `#161618` — Raised panels bordered with 1px `#26262A`.
- **Level 2 (Active Controls / Secondary Panels)**: `#1B1B1E` — Sub-regions such as note blocks, nested containers, or table hover states.
- **Level 3 (Floating Sheets & Modals)**: `#161618` with a 1px `#26262A` border, suspended over the lower layers via a semi-translucent backdrop mask (`rgba(11, 11, 12, 0.8)` with an 8px blur).

## Shapes

Corner geometry enforces an ergonomic, machined appearance:

- **Base Corner Radius (8px / `rounded-md`)**: Applied to standard buttons, input fields, and inline toggle elements.
- **Large Radius (12px / `rounded-lg`)**: Reserved for structural containers, production cards, and modals.
- **Pill (9999px / `rounded-full`)**: Strictly reserved for operational status badges (`Nuevo`, `En proceso`, `Entregado`).

## Components

### Buttons
- **Primary Action**: Background `#F4F4F2`, text `#0B0B0C` (weight 600), border none, radius 8px, height 40px, horizontal padding 16px. Active/hover state slightly reduces opacity to `0.92`.
- **Secondary Action / Ghost**: Background transparent, border 1px solid `#26262A`, text `#F5F5F5`, radius 8px. Hover shifts border to `#3F3F46` and adds background `#161618`.
- **Full-Width Modal Actions**: Bordered secondary button with height 44px for easy dismiss interactions.

### Inputs & Form Fields
- Surface background `#161618`, 1px border `#26262A`, text `#F5F5F5`, placeholder `#9A9AA2`.
- Corner radius 8px, internal height 40px (12px vertical padding on textareas).
- Focus state: Border transitions instantly to `#F4F4F2` with no ambient glow or drop shadow.

### Status Badges (Pills)
- Fully rounded (`rounded-full`), height 24px, padding 4px 10px, typography `label-sm`.
- **Entregado**: Background `rgba(52, 211, 153, 0.12)`, text `#34D399`.
- **En proceso**: Background `rgba(251, 146, 60, 0.12)`, text `#FB923C`.
- **Nuevo**: Background `rgba(161, 161, 170, 0.12)`, text `#A1A1AA`.

### Status Toggle Group
- Horizontal group of segmented buttons. Idle buttons feature transparent backgrounds with 1px border `#26262A` and muted text.
- Active button assumes the specific state accent (e.g., active "En proceso" button applies border `#FB923C` and text `#FB923C`).

### Data Tables
- Header row with bottom border 1px solid `#26262A`, cells styled via `table-header` in uppercase `#9A9AA2`.
- Body rows with subtle dividers (`#26262A`), hover state tinting background to `#1B1B1E`.
- Numeric columns (Total, Time, Grams) right-aligned with bold text `#F5F5F5`.

### Cards & Summary Panels
- Background `#161618`, border 1px solid `#26262A`, padding 24px, corner radius 12px.
- Summary cost lines formatted with primary labels on the left (`#9A9AA2`) and computed amounts on the right (`#F5F5F5`). Final price uses `metric-display` in `#F5F5F5`.
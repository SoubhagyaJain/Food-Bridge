---
name: Humanitarian Heritage
colors:
  surface: '#fff8f7'
  surface-dim: '#e4d7d7'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fef1f0'
  surface-container: '#f8ebea'
  surface-container-high: '#f2e5e5'
  surface-container-highest: '#ede0df'
  on-surface: '#201a1a'
  on-surface-variant: '#544341'
  inverse-surface: '#362f2f'
  inverse-on-surface: '#fbeeed'
  outline: '#877270'
  outline-variant: '#dac1bf'
  surface-tint: '#954742'
  primary: '#2a0002'
  on-primary: '#ffffff'
  primary-container: '#4a0e0e'
  on-primary-container: '#cc726d'
  inverse-primary: '#ffb3ad'
  secondary: '#605e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2dc'
  on-secondary-container: '#666460'
  tertiary: '#1a0b02'
  on-tertiary: '#ffffff'
  tertiary-container: '#332012'
  on-tertiary-container: '#a28672'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#3d0506'
  on-primary-fixed-variant: '#77302d'
  secondary-fixed: '#e6e2dc'
  secondary-fixed-dim: '#c9c6c1'
  on-secondary-fixed: '#1c1c18'
  on-secondary-fixed-variant: '#484743'
  tertiary-fixed: '#fedcc5'
  tertiary-fixed-dim: '#e1c0aa'
  on-tertiary-fixed: '#29180a'
  on-tertiary-fixed-variant: '#594231'
  background: '#fff8f7'
  on-background: '#201a1a'
  surface-variant: '#ede0df'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

This design system establishes a premium, editorial-grade aesthetic for high-end humanitarian initiatives. The visual narrative shifts away from utilitarian charity tropes toward a sophisticated, "Global Citizen" feel that blends **Minimalism** with **Modern Editorial** sensibilities.

The brand personality is authoritative yet deeply empathetic. It evokes a sense of timelessness and urgent dignity. By using a warm, high-contrast palette and expansive whitespace, the UI creates a respectful stage for human-centric storytelling. The emotional response should be one of profound trust, quiet confidence, and an invitation to participate in a movement of significant impact.

## Colors

The palette is anchored in heritage and warmth.

- **Primary (Claret):** A deep, sophisticated burgundy used for high-impact surfaces, primary actions, and hero backgrounds. It represents the gravity of the mission.
- **Secondary (Claret Cream):** An elegant off-white used as the primary canvas. It reduces optical fatigue compared to pure white and provides a vintage, editorial quality.
- **Tertiary (Earthy Umber):** A muted accent color for secondary elements, borders, and decorative icons, grounding the design in natural, human tones.
- **Neutral (Obsidian):** Used strictly for high-contrast typography to ensure absolute legibility.

Use the `accent_rose` sparingly for subtle highlights or tag backgrounds to provide tonal variety within the warm spectrum.

## Typography

Typography in this design system leverages **Montserrat** with an editorial twist. To achieve a premium feel, we utilize extreme weight contrasts and intentional tracking.

- **Headlines:** Large scale, heavy weights (700-800), and tight letter spacing create a "masthead" effect. Use uppercase for primary headings to signal authority.
- **Body Text:** Standard weight (400) with generous line heights (1.6) ensures a comfortable, long-form reading experience.
- **Labels & UI Navigation:** Medium to semi-bold weights with increased letter spacing (0.08em) and uppercase transformation to differentiate functional UI from narrative content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy to maintain editorial control over line lengths and image composition.

- **Desktop:** A 12-column grid with a 1280px max-width. Margins are intentionally wide (64px) to create a "frame" around the content, heightening the premium feel.
- **Rhythm:** We use a generous vertical rhythm. Sections should be separated by a minimum of 120px on desktop to allow the "breath" necessary for high-end branding.
- **Mobile:** Content reflows to a single column with 16px side margins. Large display type scales down significantly to ensure it remains within the viewport without awkward wrapping.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Subtle Shadows** rather than aggressive skeuomorphism.

- **The Base:** The secondary cream color acts as the foundation.
- **Surface Elevation:** Elevated cards or floating modules (like donation prompts) use extremely soft, diffused shadows with a slight primary-color tint (`rgba(74, 14, 14, 0.08)`).
- **Subtle Borders:** 1px solid borders using the tertiary color or a low-opacity primary color are used to define boundaries without adding visual bulk.
- **Intentional Overlaps:** To add a modern editorial touch, allow images to slightly overlap background color blocks, creating a sense of physical layers.

## Shapes

The design system utilizes **Rounded** geometry (8px / 0.5rem) to soften the impact of the high-contrast color palette.

- **Standard Radius:** 8px for buttons, input fields, and small cards.
- **Container Radius:** 16px (rounded-lg) for larger hero sections and primary content blocks to create a distinctive "frame" look.
- **Interactive Elements:** Maintain consistent corner radii across all interactive components to ensure a cohesive, curated feel.

## Components

### Buttons
- **Primary:** Solid Claret background with Cream text. 8px border radius. No shadows.
- **Secondary:** Transparent background with 1px Claret border. Uppercase label with 0.05em letter spacing.
- **Donation Toggles:** Use the Earthy Umber for inactive states and Claret for active states to emphasize choice.

### Cards
- **Campaign Cards:** High-contrast photography should bleed to the top/sides with an 8px radius. Content sits on a Cream background with minimal padding.
- **Impact Modules:** Use subtle 1px borders and muted tertiary backgrounds to separate data-driven sections from narrative sections.

### Input Fields & Controls
- **Style:** Underlined or subtly bordered (1px Earthy Umber).
- **Typography:** Labels use `label-lg` (uppercase, tracked out) for a structured, professional appearance.

### Imagery Style
- **Direction:** Human-centric, candid photography.
- **Post-Processing:** High contrast with warm color grading. Avoid "poverty-porn" tropes; instead, focus on dignity, resilience, and the "warmth of help."
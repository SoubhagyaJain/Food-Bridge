/** Prompts for Stitch screen generation — aligned with Foodbridge design system. */

export const FOODBRIDGE_DESIGN_SYSTEM_PROMPT = `
Foodbridge design system:
- Brand pillars: Trust, Vitality, Community. Modern corporate + minimalist.
- Primary (leaf green): #0d631b — primary actions, success, brand.
- Secondary (harvest orange): #fea619 — urgent CTAs and impact metrics (use sparingly).
- Tertiary blue: #005b84.
- Background/surface: #f8f9ff, white cards (#ffffff).
- Text: #121c2a on light surfaces.
- Typography: Montserrat for headlines, Inter for body and labels.
- Layout: 8px baseline grid, generous whitespace, 12-col desktop grid.
- Shapes: rounded corners (8px buttons/inputs, 16px cards/images).
- Elevation: soft shadows, no harsh borders.
- Photography: authentic food and volunteer imagery as hero elements.
`.trim();

export const LANDING_HERO_PROMPT = `
Design a desktop marketing hero section for "foodbridge" — a surplus food logistics platform connecting restaurants, volunteers, and NGOs.

${FOODBRIDGE_DESIGN_SYSTEM_PROMPT}

Hero content:
- Headline: "Turn Surplus Food Into Real Impact"
- Subhead: connecting restaurants, caterers, and NGOs to reduce waste
- Primary CTA: "Get Started Free" (harvest orange pill button)
- Secondary CTA: "See How It Works" (green outline)
- Top navigation: HOME, HOW IT WORKS, IMPACT, BLOG, BROWSE PICKUPS + "List Surplus Food" CTA
- Use a full-width food/community photo background with dark overlay for text legibility
`.trim();
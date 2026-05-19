---
name: wisetransact-design
description: Use this skill to generate well-branded interfaces and assets for WiseTransact, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick orientation:
- `colors_and_type.css` — all tokens. Always import and use semantic vars, never hex.
- `assets/` — logo SVGs and ICONOGRAPHY.md (Lucide line icons via CDN).
- `preview/` — design-system specimen cards.
- `ui_kits/mobile_app/` — full interactive 13-screen click-thru. Components are simple JSX in `components/` and `screens/`. Mirror these when building new screens.

Brand personality (PRD §11.1): quiet, professional, restrained — Linear / Things 3 / Apple Stocks. Not playful, not flashy. Emerald is the only hero color; rose / sky / amber are reserved for transaction state and warnings only.

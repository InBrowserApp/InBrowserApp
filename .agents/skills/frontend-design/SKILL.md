---
name: frontend-design
description: Design or refine a frontend's visual hierarchy, layout, typography, color, and interaction details. Use when visual design would improve the requested experience, adapting the direction to the users, tool, and existing design system.
license: Complete terms in LICENSE.txt
---

# Frontend design

Build a working interface whose visual choices help people accomplish the task.
Start with the repository's `AGENTS.md` and existing UI. Treat aesthetic patterns
as options, with a level of exploration appropriate to the request.

## Find the right direction

Consider the audience, primary action, information density, brand, device sizes,
and accessibility needs. A familiar utility may benefit from a quiet, consistent
layout; a showcase or playful tool may benefit from a distinctive treatment.
Use the user's stated direction when available and make routine design choices
from the surrounding context. Explain consequential tradeoffs, not every detail.

## Design choices to consider

- **Typography:** favor readability, hierarchy, language coverage, and load cost.
  Existing fonts, system fonts, or a distinctive typeface can each be appropriate.
  A new font should contribute enough to justify its integration and payload.
- **Color:** start with semantic tokens and check contrast across relevant themes.
  Product branding, charts, or color tools may need their own palette; keep the
  meaning clear and include non-color cues for important states.
- **Layout:** put the main task within easy reach. Choose density, whitespace,
  columns, cards, or direct page composition according to the content. Existing
  patterns support consistency; a different pattern can solve a different task.
- **Motion:** use it when it communicates state, continuity, or useful feedback.
  A static interface can be the right choice. Consider reduced-motion preferences,
  performance, and whether animation delays the user's action.
- **Detail:** refine alignment, spacing, focus, empty states, long content, and
  error recovery. Decorative backgrounds, illustrations, or effects are options
  when they support the intended experience.

## Implement and assess

Reuse `packages/ui` components where they fit and adapt or extend them when a
specific need warrants it. Choose the implementation complexity that serves the
result. Check realistic content, narrow layouts, keyboard access, and affected
locales at the scope of the change. `tool-ux-review` offers task-oriented review
prompts; use it when helpful.

Judge the result by clarity, usability, coherence, and the intended visual
character. Font bans, mandatory animation, and novelty across every page are
not useful proxies for those outcomes.

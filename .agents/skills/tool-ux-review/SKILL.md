---
name: tool-ux-review
description: Review an InBrowser.App tool from a user's first input through a usable result and retry. Use for UI/UX audits, confusing descriptions or icons, accessibility, mobile layout, i18n usability, and excessive warnings or confirmation steps.
---

# Tool UX review

Read `docs/product-quality.md` for the review criteria. Start with the requested
tool or changed paths and expand scope if the findings justify it. Select the
scenarios that matter to this tool; the steps below are review prompts, not a
requirement to exercise every possible state. Use `tool-content` when the main
opportunity is clearer explanations, examples, FAQ, or SEO content.

1. State the user intent and one realistic input. Identify the expected output
   and how the user will use it. Read metadata and implementation together.
2. Walk the primary flow in the browser when available. Check whether the first
   action is obvious, defaults work, and the result is directly usable.
3. Make a plausible correction: incomplete input, an invalid file, or a failed
   operation. Check that work survives and the next action is clear. Distinguish
   helpful boundary validation from unnecessary warnings or confirmation steps.
4. Inspect narrow layout and keyboard interaction. For affected localized UI,
   sample a long translation and RTL, including filenames and technical content.
5. Check visible purpose, mapped icons, accessible names, and contextual help.
   Use `pnpm quality:check` for structural issues; passing it is not a UX verdict.
6. Report actionable findings as: user action → observed obstacle → consequence
   → smallest useful fix, with a file reference or browser evidence. Prioritize
   blocked completion, lost/misleading output, and unnecessary work before polish.

Base findings on user impact, allowing different tools to use different layouts.
Suggest removal when a control or safeguard creates no user value.
Distinguish source inspection from browser-observed behavior; if a browser is
unavailable, report what source inspection established and what remains untested.

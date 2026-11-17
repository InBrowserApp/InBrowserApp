---
name: tool-content
description: Write or improve the helpful content below an InBrowser.App tool, including explanations, worked examples, result interpretation, FAQs, related workflows, and search-oriented metadata. Use for tool descriptions, tool-page SEO, FAQ, 使用说明, or 工具下方介绍. Adapt the content to the actual tool and user intent.
---

# Tool content

Help someone understand, use, and get more value from this particular tool.
Search visibility follows from answering the relevant questions clearly and
making those answers discoverable. Treat this skill as a decision framework,
not a required article template or a fixed sequence of sections.

All repository paths below are relative to the repository root. Start with
`AGENTS.md` and `docs/product-quality.md`. Read
[content patterns and examples](references/content-patterns.md) when useful
for planning, examples, or editorial review.

## Understand the tool and its readers

Inspect its `manifest.ts`, `meta/en.json`, `index.astro`, relevant UI/core code,
tests, and existing articles. Follow a representative input through to the
result. For claims beyond the implementation, consult an appropriate primary
source such as a format specification when it would improve accuracy.

Consider what someone wants before, during, and after using the tool:

- What task brought them here, and what might they search for?
- What input do they already have? What part of the result might confuse them?
- What choice, example, or explanation would help them take the next step?
- What distinguishes this tool from a neighboring tool or a familiar alternative?

Use supplied analytics, support questions, or research when available. Otherwise,
derive likely questions from the task and code, treating them as hypotheses
rather than observed search demand. A short working outline is usually enough;
research depth should match the task rather than delay ordinary content work.

## Choose content that earns its space

Select, combine, reorder, or omit these approaches according to the tool:

| Reader need | Possible content |
| --- | --- |
| Recognize the right tool | A direct explanation of purpose and a concrete use case |
| Get started | A short walkthrough using the controls that actually exist |
| Understand a transformation | A small input/output example with an explanation of what changed |
| Interpret an answer | Meaning of output fields, units, status, or validation results |
| Make a choice | A useful comparison, setting tradeoff, or related workflow |
| Resolve a common question | An inline answer or a focused FAQ |
| Recover from a plausible problem | The symptom, cause, and a practical next step |

A simple utility may need just an example and a short explanation. A parser or
converter with nuanced output may benefit from a substantial article. A viewer
may need navigation and export guidance rather than synthetic input/output.
Let the substance determine length and structure. Add headings, tables, FAQs,
and links when they improve understanding, not to complete a standard layout.

## Write useful, specific answers

Lead with what the reader can accomplish. Explain through realistic, compact
examples and use the interface's actual labels. Verify worked examples against
the implementation where practical; preserve meaningful details such as units,
encoding, timezone, precision, and filenames.

For FAQ, choose questions that change understanding or action: “Why did this
value change?”, “Which format should I choose?”, or “How do I use this output?”
Give the answer promptly, then enough explanation to make it usable. Whether
these belong in FAQ or the main explanation is an editorial choice.

Discuss privacy, compatibility, or limitations when the topic matters for this
task. For a cryptographic tool, a security distinction may be essential; for a
text sorter, it may add little. Explain the concrete consequence and useful
next step. Keep the article's emphasis on helping the reader succeed rather
than on generic disclaimers or the implementation's internal concerns.

Match claims to evidence. Distinguish local processing, remote lookups, resource
downloads, and persistence when making privacy claims. A relevant unresolved
fact can be checked, qualified precisely, or left out until established.

## Consider SEO as part of the page

- **Intent and terminology:** identify the main task and natural terms people
  use for it. Reflect these in the name, opening, and relevant headings where
  they read naturally. Adjacent questions can broaden usefulness without
  turning the article into repeated keyword variations.
- **Metadata and body:** `meta/<lang>.json` supplies the name and description
  used by discovery, the visible heading, and the app's SEO. Write a concise,
  distinctive promise that matches the tool. The article expands on it.
  Review snippet clarity rather than enforcing a character quota or promising
  a particular search-engine snippet or ranking.
- **Headings:** the shell supplies the page H1. Articles normally use H2 for
  topics and H3 for subtopics/questions. Choose descriptive headings that help
  scanning. The outline can differ between tools.
- **Discoverable content:** the existing Astro Markdown + `ToolArticle` pattern
  renders content below the working UI. Check the rendered HTML when changing
  integration. Expanders or another presentation can be appropriate if content
  remains accessible and available without completing the tool's task first.
- **Useful links:** connect a next step, reverse conversion, relevant comparison,
  or authoritative explanation when it serves the reader. Verify the destination
  and use meaningful anchor text. For internal links, check the locale-specific
  route and any translated heading anchor.
- **Page ownership:** the app owns canonical URLs, alternate-language links,
  and page metadata through `createPageSeo` and its layout. Reuse that mechanism
  when this task needs SEO changes. Existing URLs are usually worth preserving;
  a justified URL change also needs a redirect/link migration plan.
- **Structured data:** consider it when the visible content and page type warrant
  it. Check current schema/search-engine requirements before implementation.
  FAQ prose does not automatically require `FAQPage` markup; supported markup
  should describe the visible content, with no promise of enhanced search display.

## Integrate and localize at the appropriate scope

Existing articles usually live in `tools/<slug>/sections/intro/<lang>.md`, loaded
with `resolveLocale` in `index.astro` and rendered with `ToolArticle`. Inspect
the actual entrypoint: writing a Markdown file alone does not make it visible.
Use this pattern as the default, adapting composition when the content benefits.
Changes to shared UI or app SEO should respect their existing ownership boundaries.

When publishing repository content, complete the affected locale families using
`.claude/agents/i18n-translator.md`. Provide the tool context and verified examples.
Keep names and technical meaning consistent while making prose natural locally.
Current CI requires matching Markdown heading levels/order and JSON structure
and tokens across locales; these are repository contracts, not a universal
editorial model. Localized internal routes can differ while preserving the same
destination tool. If the request is only for an outline or draft, deliver that
scope rather than treating it as a request to publish every locale.

## Review what changed

Select verification by the actual edit:

- Read the result as someone trying to accomplish the task. Check whether each
  substantial passage answers a useful question and whether any important
  example, interpretation, or next step is missing.
- Verify examples, capabilities, and links. For a rendered-page change, inspect
  placement, heading hierarchy, code/table overflow, and relevant locale cases.
- For catalog/article edits, run `pnpm quality:check`. Regenerate the registry
  when metadata changes. For entrypoint or SEO integration changes, include
  the relevant type/build checks and inspect generated HTML and link behavior.

Use `tool-ux-review` when the work also changes or exposes an interaction issue.
Finish with what reader needs the content addresses, the files changed, and the
checks actually performed. Word counts and automated scores can be observations;
useful, accurate answers are the basis for the editorial judgment.

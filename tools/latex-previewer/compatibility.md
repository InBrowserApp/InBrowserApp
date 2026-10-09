# LaTeX preview compatibility

The initial reader is a self-contained HTML/MathML preview, not a TeX build or
PDF replacement. It never loads packages, project files, external figures,
bibliography databases, executable commands, or document-provided network
resources. Source inspection is read-only and document contents are not saved.

## Engine and provenance

- `faster-latex` 0.1.0, pinned through the workspace catalog and npm lockfile.
  Public `faster-latex/web` exports provide initialization, rendering, and the
  matching article stylesheet. Its WASM is emitted as a local Vite asset.
- The published WASM is 366,278 bytes, SHA-256
  `2576eb9dd2d515b684ba9305faed67bf56522ae94a8b413483580c7756346b5c`.
- The published package README and actual runtime were used to establish
  compatibility. The repository URL advertised by the package returned 404
  during implementation; no claim of reviewing unavailable Rust source is made.
- `pulldown-latex` 0.8.0 math layout CSS comes from the official published crate,
  with downloadable font declarations removed. See `vendor/README.md` for
  provenance and the original stylesheet hash. Browser math fonts are used.
- The renderer, math layout code, and embedded bump allocator notices are served
  at `/licenses/latex-previewer.txt`. The published binary includes version
  strings for `pulldown-latex` 0.8.0 and `bumpalo` 3.20.3.

## Representative documents

- Owned `fixtures/mathematical-note.tex`: article title/author/date, abstract,
  contents, nested section headings, local macros, inline and display formulas,
  fractions, roots, sums, integrals, matrices, negation, lists, a simple table,
  Unicode text, internal references, inline bibliography, and literal source.
  The engine reports no warnings for this sample.
- Independent LaTeX Project `sample2e.tex`, downloaded from
  `https://raw.githubusercontent.com/latex3/latex2e/develop/base/sample2e.tex` and
  tested without modifying its source. This established sample displays its
  title, sections, nested lists, and mathematics. The engine reports two honest
  fallbacks: environment `em` and command `\mbox`. The downloaded sample is not
  redistributed in this repository.
- Owned `fixtures/unsupported.tex`: package declarations, included files,
  external/local figures, bibliography databases, unknown commands, diagrams,
  an unsupported mathematics command, and an unmatched group. The preview
  remains visibly limited and offers source-line notes and original source.
- Generated local stress samples: 1,001 navigable headings; an actual source
  larger than 51 MiB with a long valid TeX comment; long formulas and wide tables;
  UTF-16 source; recursive macros; HTML/script-like text and remote resource
  probes. Stress files are not committed.

## Observed boundaries

The renderer supports a subset of LaTeX document commands. Custom classes,
package-dependent commands, complex tables, advanced math macros, TikZ,
pagination, print layout, and bibliography toolchains are not implemented.
Unsupported commands receive engine fallbacks and diagnostics; these may contain
technical command names and engine wording in English.

The upstream engine accepts some malformed groups or environments without
warning. This tool adds conservative, nonblocking checks for literal unmatched
groups, environments, and math delimiters, while skipping comments, escaped
characters, and verbatim input. These checks do not execute macros or validate a
complete TeX program; possible issues are labeled accordingly.

Native MathML structure is preserved during sanitization. Horizontal scrolling
belongs to outer wrappers, so mathematical children keep their native layout.
The iframe blocks document scripts, navigation, and network resources. External
figures become named placeholders rather than silently disappearing.

There is no application file-size, heading-count, or page-count cap. The
renderer’s default AST quota is raised to its native u32 capacity; recursive
macro safety checks remain and produce visible warnings. Actual browser or
engine resource exhaustion may still prevent a preview. The worker is terminated
on result, error, failed message transfer, replacement, cancellation, or close.
Decoded source is retained on engine failure and is not mounted into a textarea
while a successful preview is still loading. Source inspection renders navigable
sections rather than placing the entire text into one textarea. Every character
remains available, including Unicode pairs that cross a section boundary.

# AsciiDoc HTML export

Local `.adoc` and `.asciidoc` sources use the existing disposable AsciiDoc worker
in secure mode. UTF-8 and BOM-marked UTF-16 input are decoded strictly. Parsing
warnings and unavailable include links prevent export. Literal include examples
in code remain ordinary content. No source includes or remote resources are read.

## Portable static output

The common HTML exporter sanitizes both preview and download, validates embedded
HTML/CSS raster images, writes an explicit UTF-8 declaration and places a CSP
before all content. Supported styles and embedded images remain self-contained.
Direct fragment, HTTP(S) and mailto links come from validated hrefs; untrusted
link metadata is never promoted. External links require an explicit activation.

The existing AsciiDoc reading theme is shared with the viewer. Headings, lists,
tables, code, notes, quotations, footnotes and supported images stay readable.
Wide blocks scroll, and text remains selectable. The preview offers zoom, focus,
reading position and managed link navigation. Preview zoom does not alter output.

Custom macros, diagrams, extensions and embedded fonts are not promised. Unknown
syntax may remain ordinary text. Scripts, forms, embedded apps, SVG and MathML
are omitted; layouts and fonts can differ from other AsciiDoc renderers. Actual
missing resources, corrupt images, invalid encoding and browser allocation
failures are reported without enabling a partial download.

## Lifecycle and verification

Cancel, close and replace abort the worker and image decoding, withdraw stale
output and revoke download URLs. No arbitrary size or page quotas are imposed.

The original field manual fixture covers Unicode, tables, code, notes, links,
footnotes, task states and an embedded four-color PNG. Its provenance is recorded
in `fixtures/README.md`. An independent pinned Git manual and targeted source
fixtures are used for browser and offline checks; results are recorded in the PR.

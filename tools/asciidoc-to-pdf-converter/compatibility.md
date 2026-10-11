# AsciiDoc PDF export

Accepts local `.adoc` and `.asciidoc` source in UTF-8 or BOM-marked UTF-16.
Supported semantic document content is reflowed onto A4 portrait pages with
18 mm margins and captured at 150 DPI. The result is a generated PDF with one
raster image per page; preview and download use the same bytes. There is no
print-dialog dependency, selectable text, added OCR or interactive PDF links.

## Parser and print scope

The existing Asciidoctor browser parser and disposable worker are shared with
the viewer. Secure mode, disabled stylesheet/fonts/icons/highlighting, no custom
extensions and the existing unbounded attribute-value setting are retained.
Secure mode disables includes and resource reads, but does not sanitize
passthrough HTML. The shared web-document sanitizer and PDF renderer perform
that separate step before any content is displayed.

Export rejects parser warnings and unresolved include references rather than
printing an apparently complete document. Ordinary literal include examples in
code blocks remain printable. Missing image/style resources and corrupt images
also stop conversion without a partial PDF. The viewer keeps its existing
recovery and warning behavior.

The fixed print theme covers titles, headings, lists, tables, code, admonitions,
callouts, quotations, footnotes, explicit page breaks and embedded raster
images. Wide tables and code reflow. Project-specific macros, diagrams,
extensions, themes and embedded fonts are not supported; unknown notation may
remain as text. Scripts, forms, embedded apps, SVG and MathML are omitted.
Available fonts, spacing and pagination can differ from other AsciiDoc tools.

## Completeness, privacy and lifecycle

The shared renderer checks normalized text and image counts after pagination,
validates image decoding and page bounds, and captures one page at a time.
These checks catch known content loss, duplication and clipping; they do not
prove arbitrary passthrough CSS fidelity. Inspect the output before relying on
it. User content and original document URLs are never fetched or uploaded.

Closing, replacing or canceling terminates the parser worker, removes rendering
frames and prevents stale results from becoming downloadable. No arbitrary
input-size or page-count quotas are imposed. Genuine browser allocation errors
are surfaced when possible.

## References and verification

- Repository-owned fixture: `fixtures/README.md`.
- [Asciidoctor safe modes](https://docs.asciidoctor.org/asciidoctor/latest/safe-modes/)
  documents the processor restrictions and the need for separate sanitization.
- [Pinned Git command-line manual](https://github.com/git/git/blob/6de20f6092dcf9bdb1c8efe03db4b70c82b423dd/Documentation/gitcli.adoc)
  is an independent input used outside the repository. Git-specific macros need
  its own documentation build and may remain literal text. GPL-2.0 source is not
  redistributed here.
- Production browser, output and CI verification is recorded in the pull request.

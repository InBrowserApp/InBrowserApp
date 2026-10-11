# Markdown PDF export

Accepts local `.md`, `.markdown`, `.mdown` and `.txt` source in UTF-8 or
BOM-marked UTF-16. Semantic content is reflowed onto A4 portrait pages with
18 mm margins and captured at 150 DPI. Preview and download use the same PDF
bytes. Each page is a raster image; selectable text, OCR and interactive links
are not added. No print dialog is needed.

## Shared parsing and print scope

The parser and semantic HTML sanitizer are promoted from the existing Markdown
Previewer to `@workspace/markdown`. The previewer retains its existing worker,
editor, heading IDs, themes, export actions and resource policy. PDF parsing
also runs in a disposable worker. Both use the same GFM and line-break options.

Headings, paragraphs, lists, task lists, strikethrough, tables, fenced code and
embedded raster images are included. PDF preparation turns task checkboxes into
static `[x]` or `[ ]` text before the print sanitizer removes form controls.
Closed details are expanded to include their content. Wide code and tables
reflow to the page width. Fonts and pagination can differ between browsers.

Missing local/remote images and unreadable embedded images stop conversion
without a partial download. The fixed theme discards source CSS. Scripts,
forms, embedded apps, SVG and MathML are omitted. Syntax highlighting, math,
diagrams, footnotes and dialect extensions are not rendered; unsupported
notation may remain literal text. This shares the previewer's syntax scope.

## Privacy, completeness and lifecycle

Inert parsing and sanitization precede live rendering. The document cannot fetch
remote or companion files or upload source content. Only embedded raster data
is used. The shared renderer validates image decoding, normalized text and image
counts across pagination and page bounds. These checks catch known content loss
and clipping; they do not guarantee every possible document layout. Review the
output before relying on it.

Canceling, closing and replacing the file terminate the parser worker, remove
render frames and discard stale results. No arbitrary size or page quotas are
imposed. Genuine resource allocation failures are surfaced when detectable.

## References and verification

- [Marked options and extensions](https://marked.js.org/using_advanced) describe
  GFM parsing and separate sanitization, highlighting and extension support.
- [Node.js v24.13.0 Punycode documentation](https://github.com/nodejs/node/blob/v24.13.0/doc/api/punycode.md)
  is an independent Markdown input used outside the repository.
- Original fixtures and provenance are described in `fixtures/README.md`.
- Browser, output and CI verification is recorded in the pull request.

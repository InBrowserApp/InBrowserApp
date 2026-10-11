# HTML PDF export

Accepts readable HTML/HTM and well-formed XHTML documents. Byte decoding is shared
with the HTML viewer: BOMs, supported declared encodings and an undeclared
UTF-8/Windows-1252 fallback. Binary controls and empty static content are rejected.

The output is reflowed A4 portrait, 18 mm margins, at 150 DPI, with one raster
image per PDF page. It is generated directly, not through a print dialog. Text
is not selectable; no OCR, live links, signatures or original website session
state are added. The PDF preview opens the same bytes offered for download.

## Preparation and pagination

The shared web-document sanitizer parses in an inert document, removes active
content, and restricts embedded resources. Print preparation omits reader-only
styles, scroll wrappers and outline anchors. Missing or remote image/style
resources fail before rendering; sibling resource directories are not imported.
Scripts, forms, embedded apps, SVG and MathML are omitted as disclosed in the UI.

Source styles are parsed and scoped to the content root. Unconditional print/all
media rules are used; screen/responsive rules and original page-size rules do
not control export. Other at-rules, including embedded fonts and unsupported
conditional CSS, are rejected. Basic styles, semantic lists/code, legacy font
markup and supported embedded raster images are retained. Tables and code reflow
to page width, and table header groups are not repeated. Keep-with-next/avoid
constraints are relaxed to avoid repeated partial tables during pagination;
explicit page breaks remain. Complex web layouts can differ or fail.

The shared HTML PDF renderer owns Paged.js, html2canvas and pdf-lib in a disposable
iframe. Trusted bootstrap code receives the sanitized document as a separate
message. CSP blocks document network resources, and source styles cannot address
outer pagination scaffolds. Each page is captured separately; its canvas is
released after embedding. Closing/replacing/canceling removes the rendering
context and stale downloads.

Before capture, the page count must agree with the pagination result. Concatenated
non-whitespace text and image counts must match the sanitized source; images must
decode; text/image bounds must fit the page. A failed check provides no partial
download. These checks detect known loss, duplication and clipping, but do not
prove every CSS detail. Fonts and pagination may vary across browsers. Users
should inspect all pages before relying on the result. There is no arbitrary
input-size or page-count quota; browser resource failures are surfaced when possible.

## References and verification

- Original fixtures and genuine producer exports: `fixtures/README.md`.
- [Paged.js](https://github.com/pagedjs/pagedjs): browser pagination.
- [html2canvas documentation](https://html2canvas.hertzen.com/documentation):
  DOM-based image rendering and CSS limitations.
- Final production, browser and CI evidence is recorded in the pull request.

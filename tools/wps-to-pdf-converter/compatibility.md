# Legacy DOC / WPS PDF export

This converter accepts supported Word 97–2003 binary documents in CFB version
3, including compatible WPS documents and WPT templates. It exports a reflowed
body on A4 portrait pages with 18 mm margins, as 150 DPI raster images in a PDF.
It does not reproduce original Office pages or add selectable text or OCR.
Saved field text and final revision content are used.

The existing DOC viewer's container/FIB inspection is promoted to
`@workspace/legacy-doc`. Its ordinary reading behavior is preserved; the
converter opts into stricter checks. Detected header/footer, note, comment,
macro or text-box stories and floating drawing anchors stop conversion. Parser
warnings, automatic lists, positioned paragraphs, nested tables, attachments,
linked/non-raster/unsupported images also stop conversion. HTML-in-OLE, older
proprietary WPS/Works, CFB v4, and encrypted documents are rejected. Templates
with supported saved body content use the same conversion path.

The public `@file-viewer/doc` parser runs in a disposable Worker. The shared
`@workspace/html-pdf` renderer sanitizes generated markup in an inert fragment
and uses Paged.js and html2canvas inside a disposable iframe. Document content
is sent separately from its trusted bootstrap. CSP and sanitization block
active content and document-triggered external resources. Inline styles become
scoped CSS rules so Paged.js recognizes explicit breaks. Reflow removes source
keep-with-next/keep-together constraints: retaining them can restart and
duplicate a table in Firefox. An offscreen timer scheduler avoids WebKit's
suspended animation frames without changing the application's scheduling.

Before rasterization, concatenated non-whitespace text and embedded-image count
must match the sanitized source. Images must decode successfully, and text/image
bounds must fit the captured page. A failed check provides no download. These
checks detect known loss, duplication and clipping; they are not a guarantee of
Office layout fidelity. The UI asks users to inspect the exact exported PDF.

Only one page is cloned and rasterized at a time; its PNG is immediately embedded
and its canvas released. The remaining document host is excluded from canvas
cloning. Closing, replacing or canceling removes the entire rendering context
and terminates parsing. There is no file-size or page-count product quota.

## Representative evidence

- `fixtures/report.doc`: original document saved by LibreOffice 25.2.3.2 from
  the included DOCX source. Multilingual text, manually numbered paragraphs,
  an embedded three-color PNG, a hard page break, an 80-row table, and eight
  final paragraphs. Expected pagination varies by browser fonts/layout.
- Genuine native `annual-inspection.wps`: [government attachment notice](https://www.lg.gov.cn/xxgk/zwgk/tzgg/content/post_12613085.html),
  23,552 bytes; SHA-256
  `0d4e72e3a4792ba6013d396a57bf664f16e90a9da4b55bc6dd0918645bfdb994`.
  The final article remains in the reflowed output. This third-party file is
  checked locally, not committed.
- Native WPT templates from the [official WPS Linux distribution](https://linux.wps.cn)
  establish both supported body-only templates and rejection of omitted
  header/text-box content; see the existing DOC viewer compatibility notes.
- Owned stress inputs include a 56,094,720-byte DOC with an unused CFB stream
  and a real binary DOC containing 1,001 explicit pages. Negative cases cover
  encryption, unsupported stories/drawings, malformed input, blank documents,
  active markup, external resources, and cancellation/replacement races.

Primary library references:
[DOC parser](https://github.com/flyfish-dev/file-viewer/tree/5ebaaa3803eecc584178644feb1be3450d46cefd/packages/renderers/doc),
[Paged.js](https://pagedjs.org/devdocs/Previewer.html),
[html2canvas limitations](https://html2canvas.hertzen.com/faq.html).

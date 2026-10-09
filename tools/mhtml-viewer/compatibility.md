# MHTML compatibility

The reader uses mhtml-to-html 2.1.0's public parse5-backed entry in a disposable
browser worker. Its Node-named wrapper imports no Node builtins; native
DOMParser is never involved in archive parsing or conversion. Conversion is
followed by the shared web-document sanitizer, a sandboxed reader frame, and a
first-head restrictive Content Security Policy. The converter is configured
with `fetchMissingResources: false` and a fetch implementation that rejects.

## Representative files

- Genuine Chromium 154 CDP snapshot of a project-owned report with a separate
  stylesheet and PNG: title, original location, multilingual text, headings,
  lists, table, named internal links, embedded raster image, and CSS background.
- Independent html-docx-js 0.3.1 public API output: its DOCX's unmodified MHT
  payload uses quoted-printable HTML, a bundled image, and file Content-Location.
  This validates that producer; it does not establish Word or Internet Explorer
  compatibility. No genuine Word/IE MHT producer was available in this session.
- Targeted MIME cases: Content-ID and relative Content-Location images,
  Windows-1252 quoted-printable text, explicit multipart root selection,
  missing resources, missing closing boundary, unknown charset, additional
  HTML pages, self-referencing frame, nested multipart, email, and blank files.

Fixture provenance is documented in `fixtures/README.md`.

## Browser validation

The production bundle was checked in Chromium, Firefox, and WebKit, with no
outgoing document requests or page errors. Desktop (1440 × 900), 320 px portrait,
844 × 390 landscape, and 375 px RTL-direction screenshots were inspected.
Checks covered selection, keyboard links and Escape, outline navigation,
zoom/width/focus controls, missing resources, replacement, close, a 53,477,821-byte
archive, and 1,001 bundled images. Desktop-to-mobile visible-character drift
was below one CSS pixel in all three engines.

## Deliberate limits

Only an HTML main page inside a multipart/related archive is displayed.
Additional pages and embedded frames/apps are omitted with a notice. Nested
multipart containers, message parts, and unknown transfer encodings are rejected
with an explicit unsupported-structure outcome. An absent closing boundary
produces an incomplete-capture notice while recovered text remains readable.
Unsupported charset declarations produce a text-fidelity notice.

Scripts, forms, redirects, media, SVG/MathML, and interactive site behavior are
disabled. Safe bundled raster images, fonts, linked CSS, and inline CSS survive;
CSS imports and alternate stylesheet sets are omitted by the shared sanitizer
and reported as unavailable resources. Resources absent from the archive are
never fetched. External hyperlinks open only after user activation. The
original location is selectable reference text, not an automatic navigation.

There are no application file-size or resource-count caps. Worker termination
cancels MIME parsing/conversion on close, replacement, or unmount. The shared
sanitizer and final layout run synchronously on the main thread; very large
rendered pages can occupy that thread until the browser finishes the operation.
An actual allocation failure is reported as a browser resource problem.

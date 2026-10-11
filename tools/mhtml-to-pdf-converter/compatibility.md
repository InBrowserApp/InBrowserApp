# MHTML PDF export

Accepts a local MHTML/MHT `multipart/related` web archive containing a supported
HTML main document and its captured resources. The output is A4 portrait with
18 mm margins at 150 DPI, one raster image per PDF page. It is a generated PDF,
not a print dialog. Preview and download use the same bytes. Text is not
selectable; no OCR or interactive links are added.

## Archive scope

The MIME parser and disposable worker are shared with the MHTML viewer. Parsing
uses the library's parse5-backed entry rather than a native document browsing
context. Content-ID, Content-Location, start-part selection, quoted-printable,
base64 and supported declared character encodings use the existing archive
parser. Scripts and resource fetching are disabled. The original capture URL is
metadata; it is never loaded during conversion.

The viewer can show recovered content with warnings. Conversion instead rejects
known truncation, unknown encodings, nested frames/additional HTML pages, email
messages and unsupported multipart structures. Missing image or stylesheet
resources fail before rendering. No partial PDF becomes downloadable.

## Printing and resources

HTML and MHTML share print preparation: inert sanitization, scoped styles, basic
semantic content, explicit page breaks and width reflow for tables/code. Scripts,
forms, embedded apps, SVG and MathML are omitted. Responsive rules, original
paper sizes, embedded fonts and arbitrary complex web layouts are not supported.
Available fonts, spacing and pagination can differ from the captured page.

The shared PDF renderer permits only embedded raster data URLs in CSS resource
values. It collects those URLs and explicitly decodes each image before
pagination, so a corrupt CSS background cannot silently disappear. Network URLs,
SVG/font data, CSS imports, image-set and escaped resource syntax remain rejected.
The disposable render frame also blocks network resources through CSP.

Pagination checks normalized text and img-element counts against the prepared
source; each page's text/image bounds and embedded image decoding are checked
before capture. Background-image decoding supplements those checks. These checks
catch known loss, duplication and clipping, but do not prove arbitrary CSS
fidelity. Users should inspect every page before relying on the export.

Closing, replacing or canceling terminates the archive worker, removes rendering
iframes and suppresses stale downloads. There is no arbitrary input-size or
page-count quota. Real browser memory/resource failures are reported when
possible.

## References and verification

- Repository-owned, real producer archives: `fixtures/README.md`.
- [mhtml-to-html](https://github.com/gildas-lormeau/mhtml-to-html): archive parsing
  and contained-resource conversion, with scripts and resource fetching disabled.
- [Paged.js](https://github.com/pagedjs/pagedjs) and
  [html2canvas](https://html2canvas.hertzen.com/documentation): pagination and
  DOM-based raster rendering.
- Final production, PDF, browser and CI evidence is recorded in the pull request.

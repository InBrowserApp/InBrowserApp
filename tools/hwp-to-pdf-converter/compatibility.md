# HWP / HWPX to PDF compatibility

The converter renders readable HWP 5 and HWPX documents to a raster PDF at
150 DPI, preserving the renderer's physical page dimensions and order. The
exact generated PDF is previewed before download. It contains no selectable
text, search layer, OCR, executable document content, or verified signatures.
It does not promise native Hangul typography or official-form fidelity.

## Engines and fonts

- `@rhwp/core` 0.8.7 supplies print-profile page SVG, not a browser PDF exporter.
  Source reference: [commit 1a76570e833917d15817415a53c09ad61ab3203f](https://github.com/edwardkim/rhwp/tree/1a76570e833917d15817415a53c09ad61ab3203f).
- `@resvg/resvg-wasm` 2.6.2 rasterizes sanitized pages with explicitly supplied
  font bytes. PDF page dimensions come from HWP page information, before the
  raster dimensions are rounded to whole pixels.
- Nanum Gothic and Nanum Myeongjo regular/bold fonts are self-hosted; see
  `fonts/README.md` for pinned provenance, hashes, and accompanying OFL files.
  Source font family names are mapped to these fallbacks. Other scripts and
  uncommon glyphs need checking; substitutions can change appearance and layout.
- Rendering, rasterization, and PDF assembly run in a disposable dedicated
  worker. DOM sanitization and browser image decoding happen on the main thread.
  Closing/replacing/cancelling terminates the worker and revokes image URLs.
  Each completed page is embedded/compressed immediately, releasing its decoded
  image buffers before proceeding. There are no product size/page quotas.

## Detected loss and unsupported input

Opening encryption, DRM, distribution-only HWP, and pre-HWP-5 files are rejected
before rendering, using the same preflight as the viewer. HWPX manifest package
entries/spine references and HWP binary record boundaries are checked. Referenced
embedded assets must exist, and embedded images must decode. Missing assets must
not silently disappear, even when the renderer itself omits them without error.

PNG, JPEG, GIF, BMP, WebP, and sanitized SVG assets are the intended image scope.
Browser-supported raster assets are normalized to PNG before SVG rasterization.
PCX, WMF/EMF, embedded OLE, linked images, and other unsupported resources stop
conversion. A real university form (`samples/복학원서.hwpx`) contains a PCX image;
this converter rejects it explicitly instead of producing a PDF with a missing
logo. The HWP viewer remains more permissive for viewing such documents.

Scripts, remote references, and active SVG content never run. Any detected
sanitization that removes visual content stops conversion. Ordinary links lose
interactivity. Some parser layout differences, unsupported equations, complex
nested tables, text boxes, or fonts cannot be detected reliably; the permanent
UI guidance requires checking every page, especially official forms. No native
Hangul comparison certification is claimed.

## Validation evidence

The owned two-page Korean/English fixture includes a table and embedded PNG.
Browser-module probes in Chromium, Firefox, and WebKit exported both containers
plus pinned upstream `samples/basic/request.hwp` (one A5 page) and
`samples/test-image.hwp` / `.hwpx` (five pages each). Those third-party files are
local test inputs only and are not redistributed.

A 51 MiB HWPX input converted successfully in all three engines. A derived
1,001-page HWPX converted in Chromium; independent PDF inspection found 1,001
unique page images, and OCR sampling verified labels on pages 2, 99, 500, 1,000,
and 1,001. This sampling validates the output; the converter itself adds no OCR.
Owned fixture page image streams were identical across the three browser engines.

Malformed images, absent manifest assets, undeclared image references, unsafe
embedded SVG, opening protection, and distribution restrictions fail without a
partial download. Raster MIME signatures are checked before browser decoding,
and conflicting SVG href/xlink:href values are rejected rather than allowing
browser and rasterizer interpretations to diverge. No external document-resource
requests were observed. Additional final-head deployment acceptance is pending.

# HWP / HWPX to PDF compatibility

The converter exports readable HWP 5 and HWPX documents as PDFs with selectable
text. It uses the HWP renderer's page dimensions and order, with text and
supported vector shapes written as PDF objects and embedded illustrations
included as images. The preview opens the same PDF offered for download.

## Engines and fonts

- `@rhwp/core` supplies print-profile page SVG. SVG-to-PDFKit converts the
  sanitized SVG to PDF drawing and text operators, and PDFKit embeds font
  subsets. Rhwp draws some punctuation as a shape and also emits invisible SVG
  text for selection. The SVG-to-PDFKit patch preserves this text in the PDF.
- Nanum Gothic and Nanum Myeongjo are bundled in regular and bold. The converter
  uses Noto Sans CJK SC for Han and Japanese scripts. The [font notes](fonts/README.md)
  describe provenance and licenses. Substitutions can affect glyphs, spacing,
  and layout.
- Parsing, rendering, and PDF generation run in a disposable dedicated worker.
  DOM sanitization and embedded image decoding happen on the main thread.
  Closing, replacing, or cancelling terminates the worker and revokes image
  URLs. Large documents depend on available browser memory.

## Detected loss and unsupported input

The converter checks opening restrictions and format versions, HWPX manifests
and references, and HWP binary record boundaries. Referenced embedded assets
must exist and images must decode successfully. It supports PNG, JPEG, GIF,
BMP, WebP, and sanitized SVG images, embedding them as PNG. PCX, WMF/EMF,
embedded OLE, and linked images stop conversion. SVG filters are supported
inside embedded illustrations through browser rendering. A filter applied to
a page drawing stops conversion.

Script and external resource references are removed before PDF rendering. Some
parser layout differences, glyph substitutions, unsupported equations, complex
nested tables, or text boxes require checking the preview against the original.
Digital signatures and document authenticity are not verified.

## Validation

The repository fixtures contain two pages of Korean and English text, table
cells, and an embedded PNG. The worker tests read the resulting Unicode text
with PDF.js, verify page dimensions and order, and cover invisible punctuation
and supplemental CJK fonts. The earlier raster converter's browser validation
is recorded in the merge history of #1179.

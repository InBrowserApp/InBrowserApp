# Owned OFD fixtures

Run `python3 tools/ofd-to-pdf-converter/fixtures/generate.py` from the repository root.
All content is synthetic and owned by this project.

- `multiple.ofd`: two documents, three pages. Red A4 portrait, green A4 landscape,
  blue 100 × 150 mm. Each page supplies its own physical size.
- `signed.ofd`: a signatures reference on the second document; the entire conversion
  must fail without offering the first document as a successful export.
- `missing.ofd`: a missing first page; no download.
- `unsupported.ofd`: an unsupported composite object; no download even if the
  renderer resolves its task after painting the other objects.

The existing owned `tools/ofd-viewer/fixtures/reading.ofd` adds an invented Chinese
invoice with a normal stamp image, a landscape report and a scanned image.
That visible stamp is ordinary page content, not a verified digital signature.

Validate downloaded PDFs independently: page count and sizes, red/green/blue order,
image-only pages, invoice text appearance and image placement. Also exercise real
large files and documents longer than 1,000 pages without committing large fixtures.

## Convert saved web archives locally

Open a local `.mhtml` or `.mht` archive, inspect the generated pages, and download the PDF shown in the preview. This generates a PDF file directly; no print dialog is required. The main document uses images and styles included in the archive. For reading without conversion, use the [MHTML Viewer](../mhtml-viewer/). Plain HTML documents need the [HTML to PDF Converter](../html-to-pdf-converter/); saved emails belong in the [Email Viewer](../email-viewer/).

## Print result and supported captures

The archived main document is reflowed onto A4 portrait pages with 18 mm margins, then captured as image pages at 150 DPI. Supported headings, paragraphs, lists, tables, code, explicit page breaks, basic styles and embedded raster images are included. Wide tables and code are reflowed to the page width. Text in the PDF is not selectable, and OCR and interactive links are not added. Fonts, spacing and pagination may differ from the saved page. Check every page before relying on the output.

Incomplete archives, unsupported text encodings, missing resources, unreadable images and unsupported print content stop conversion without a partial download. Archives containing embedded frames or additional pages must be saved as a standalone main document first. Scripts, forms, embedded apps, SVG and MathML are omitted. Complex website layouts and embedded fonts are not supported. Screen-specific responsive styles do not control printed pages, and source paper sizes are replaced by the fixed A4 layout.

## Privacy and browser resources

Your archive stays in this browser. Included resources are read from the file; missing or remote content is never fetched, and the original website is not contacted. File contents are never uploaded. Large archives can take time and memory because each page is rendered as an image. You can cancel, close or replace the archive. There is no fixed file-size or page-count quota; genuine browser resource failures produce an error when they can be detected.

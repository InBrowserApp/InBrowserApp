## Convert saved HTML locally

Open a local `.html`, `.htm`, or well-formed `.xhtml` document, inspect the generated pages, and download the PDF shown in the preview. This generates a PDF file directly; no print dialog is required. For reading without conversion, use the [HTML Viewer](../html-viewer/).

## PDF appearance and compatibility

The document is reflowed onto A4 portrait pages with 18 mm margins, then captured as image pages at 150 DPI. Supported headings, paragraphs, lists, tables, code, explicit page breaks, basic styles and embedded raster images are included. Wide tables and code are reflowed to the page width. Text in the PDF is not selectable, and OCR and interactive links are not added. Fonts, spacing and pagination may differ from the original page. Check every page before relying on the output.

Scripts, forms, embedded apps, SVG and MathML are omitted. Remote resources and sibling resource folders are not fetched. Missing image/style resources, unreadable images and unsupported print content stop conversion without a partial download. Use a self-contained document with embedded images; complex website layouts and embedded fonts are not supported. Screen-specific responsive styles do not control printed pages, and source paper sizes are replaced by the fixed A4 layout.

## Privacy and browser resources

Your document stays in this browser. The renderer loads only after you choose a file, and file contents are never uploaded. Large documents can take time and memory because each page is rendered as an image. You can cancel, close or replace the document. There is no fixed file-size or page-count quota; genuine browser resource failures produce an error when they can be detected.

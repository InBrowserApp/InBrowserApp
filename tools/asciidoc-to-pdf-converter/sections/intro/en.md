## Convert an AsciiDoc document locally

Open a local `.adoc` or `.asciidoc` document, inspect the generated pages, and download the PDF shown in the preview. This generates a PDF file directly; no print dialog is required. UTF-8 and BOM-marked UTF-16 source are supported. For reading without conversion, use the [AsciiDoc Viewer](../asciidoc-viewer/).

## Print result and supported source

The document is rendered with a fixed print theme on A4 portrait pages with 18 mm margins, then captured as image pages at 150 DPI. Supported titles, sections, paragraphs, lists, tables, code, admonitions, callouts, footnotes, explicit page breaks and embedded raster images are included. Wide tables and code are reflowed to the page width. Text in the PDF is not selectable, and OCR and interactive links are not added. Fonts, spacing and pagination may differ from other AsciiDoc tools. Check every page before relying on the output.

Includes, missing image/style resources, unreadable images, parsing warnings and unresolved attributes stop conversion without a partial download. Combine required source content into one self-contained document first. Custom macros, diagrams, extensions, project themes and embedded fonts are not supported; unsupported notation can remain as text. Scripts, forms, embedded apps, SVG and MathML are omitted. Active content in passthrough HTML is removed. Source paper sizes are replaced by the fixed A4 layout.

## Privacy and browser resources

Your document stays in this browser. Source files, images and other assets are never fetched from your computer or the network, and file contents are never uploaded. Embedded raster data is read from the selected document. Large files can take time and memory because each page is rendered as an image. You can cancel, close or replace the document. There is no fixed file-size or page-count quota; genuine browser resource failures produce an error when they can be detected.

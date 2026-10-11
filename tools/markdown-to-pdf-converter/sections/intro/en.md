## Convert a Markdown document locally

Open a local `.md`, `.markdown`, `.mdown` or `.txt` document, inspect the generated pages, and download the PDF shown in the preview. This generates a PDF file directly; no print dialog is required. UTF-8 and BOM-marked UTF-16 source are supported. For reading or editing source, use the [Markdown Previewer](../markdown-previewer/).

## Print result and supported source

Standard Markdown and GitHub-style tables, task lists, strikethrough and fenced code are supported. The document is rendered with a fixed print theme on A4 portrait pages with 18 mm margins, then captured as image pages at 150 DPI. Task states remain visible, and collapsed details are expanded. Wide tables and code are reflowed to the page width. Text in the PDF is not selectable, and OCR and interactive links are not added. Fonts, spacing and pagination may differ from other Markdown tools. Check every page before relying on the output.

Missing image resources and unreadable embedded images stop conversion without a partial download. Use embedded raster images in a self-contained document. Inline HTML is sanitized; scripts, styles, forms, embedded apps, SVG and MathML are omitted. Syntax highlighting, math, diagrams, footnotes and other dialect extensions are not rendered; unsupported notation can remain as text.

## Privacy and browser resources

Your document stays in this browser. Images and other assets are never fetched from your computer or the network, and file contents are never uploaded. Embedded raster data is read from the selected document. Large files can take time and memory because each page is rendered as an image. You can cancel, close or replace the document. There is no fixed file-size or page-count quota; genuine browser resource failures produce an error when they can be detected.

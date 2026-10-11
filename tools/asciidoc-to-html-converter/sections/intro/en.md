## Convert AsciiDoc locally

Open a local `.adoc` or `.asciidoc` file, inspect the rendered document, and download a standalone UTF-8 HTML file. The file opens offline and keeps selectable text. For reviewing source warnings or unavailable includes before conversion, use the [AsciiDoc Viewer](../asciidoc-viewer/).

## Output and compatibility

Headings, lists, tables, code blocks, notes, quotations, footnotes, links and supported embedded raster images are preserved with a fixed reading theme. Internal bookmarks and footnotes stay in the document; external links open only when selected. Wide code and tables scroll horizontally. Preview zoom does not change the download. Fonts and spacing may differ from other AsciiDoc tools.

Use self-contained UTF-8 or BOM-marked UTF-16 source. Included files and external image or style resources are not loaded. Unavailable includes, parsing warnings, unresolved attributes and missing or unreadable resources stop export without a partial download. Embedded images, including CSS background images, must decode successfully. Custom macros, diagrams, extensions and embedded fonts are not supported. Scripts, forms, embedded apps, SVG and MathML are omitted. Unsupported source syntax may remain as ordinary text.

## Privacy and browser resources

Files stay in this browser. Missing assets are never fetched from your computer or a website, and file contents are never uploaded. Generated HTML blocks scripts and automatic external resource loading. Following an external link is a separate action that may contact that site. You can cancel, close or replace the source document. There is no fixed file-size or page-count quota; large documents depend on available browser memory, and resource failures are reported when detectable.

## Convert rich text locally

Open a local `.rtf` document, convert it to PDF, inspect the resulting pages, and download the same PDF shown in the preview. For reading without conversion, use the [RTF Viewer](../rtf-viewer/).

## PDF appearance and compatibility

The conversion engine renders page sizes, orientation, headers, footers, page breaks, tables, and supported embedded PNG/JPEG pictures. Supported text remains selectable. Original RTF character encodings and Unicode escapes are passed to the engine; OCR is not added to scanned text. Missing fonts are substituted with bundled fonts, so line breaks, spacing, and pagination can change. Complex layouts may differ from the original application. Check every page before relying on the PDF.

The PDF is a static export. Form controls use their printed appearance. Comments, macros, and digital signatures are not preserved or verified. Embedded objects, external document resources, unsupported picture formats, and unsupported field instructions are rejected. Damaged or unreadable files produce an error without an incomplete download. A renamed extension does not change the underlying format.

## Privacy and browser resources

Conversion runs on your device. The first conversion downloads about 90 MB of engine and font files, which your browser may cache; the document itself is never uploaded. The engine loads only after you choose a file. Current browsers with WebAssembly and shared-memory support are required. Large or complex documents can take time and memory. You can cancel, close, or replace the file. There is no fixed file-size or page-count quota.

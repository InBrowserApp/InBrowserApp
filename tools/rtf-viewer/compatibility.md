# RTF preview compatibility

This is a local, read-only RTF preview. It uses `rtf-viewer` 1.3.1 and the
pinned parser artifact documented in `vendor/README.md`. The model keeps
paragraphs, direct formatting, list markers, tables and embedded pictures;
this integration displays one generated page at a time with selectable text,
search, direct page navigation, fit controls, and focus reading.

## Representative files

The original sources and redistributable files are under `fixtures/`:

| File                      | Producer and coverage                                                                                                                                                | Boundary                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `river-survey.rtf`        | LibreOffice export of the original Markdown/Pandoc DOCX; headings, emphasis, simple table, numbered list, 20 observations, mixed-language text                       | Stylesheet inheritance, footnotes, and bidirectional runs are diagnosed or omitted. This is not a Word-fidelity claim. |
| `river-survey-pandoc.rtf` | Independent standalone Pandoc RTF export of the same original report                                                                                                 | Different producers and local fonts can produce different page breaks.                                                 |
| `reading.rtf`             | Original focused RTF: two explicit pages, Unicode surrogate pairs, Windows-1252 hex escapes, literal braces/backslash, emphasis, color, simple table, asymmetric PNG | Tests the stated subset, not every possible table or image variant.                                                    |
| `windows-1251.rtf`        | Original file containing actual Windows-1251 Cyrillic bytes                                                                                                          | Does not establish all historical codepages.                                                                           |
| `adversarial.rtf`         | Original remote image/link fields, embedded object, header/footer and shape destinations                                                                             | Field instructions do not execute or navigate; unsupported content is disclosed.                                       |

The vendored parser's 64 native tests pass, including regressions for input
and content counts that exceeded the published package's quotas. A second
clean WASM build produced the identical SHA-256. The application tests run the
actual shipped WASM against independent exports, Unicode, codepages, images,
malformed input and 2,001 page boundaries. Chromium, Firefox and WebKit production acceptance also open a
51 MiB file and navigate to page 2,001. Each reaches the final report content,
selects and copies text with line breaks, finds text on another page, checks
embedded PNG pixels and Windows-1251 text, cancels/replaces an opening file,
and exercises 320px focus reading and landscape. All three end with zero
owned workers, image bitmaps or object URLs, zero external requests and zero
page errors. The Pandoc report has four generated pages in Chromium/WebKit
and five in Firefox: font metrics differ, so these are preview pages.

## Layout and content limits

Paper geometry is retained when supported, but font availability and browser
metrics can change line wrapping and page breaks. The output is not an exact
facsimile of the originating word processor. Headers, footers, footnotes,
stylesheet inheritance, section-specific settings, complex/merged/nested
cells, repeated table headers, equations, shapes and text boxes have partial
or missing support. Complex scripts and bidirectional text are not faithfully
laid out by this engine. Preview limitations remains visible, with a warning
indicator when the parser reports known unsupported features.

PNG and JPEG pictures work when the browser can decode them. WMF/EMF images
may expose an embedded bitmap, while vector-only images retain a placeholder.
Unsupported images and approximations are disclosed. Remote resources are not
requested and embedded applications are not executed. Ordinary field result
text may remain readable; their field instructions are inert.

Selection and search operate on the preview's text fragments. A page's lines
remain separated when copied. This does not recover text that the parser
omitted, nor does it perform OCR on pictures.

## Capacity, cancellation and cleanup

There is no product file-size or page-count limit. The package patch removes
the JavaScript input quota, default parser time cutoff and default page cap.
The reproducible parser patch uses representable storage instead of arbitrary
content-count quotas. RTF's nine-level list format bound is retained. Bounded
diagnostic aggregation does not stop document parsing.

Decoded image and canvas allocation guards remain. The browser can still run
out of memory. Individual canvas failures keep page and zoom controls
available; document allocation failures are explained separately from
malformed input. Opening is cancellable by closing or replacing the file;
the owned module worker terminates, image bitmaps are closed, rendering is
aborted, and detached canvases have their backing stores released.

## Primary references

- [Engine support matrix](https://github.com/rwv/rtf-viewer/blob/d077653c92d4420126c145fcbf8332bbe1106ada/docs/support-matrix.md)
- [Engine API](https://github.com/rwv/rtf-viewer/blob/d077653c92d4420126c145fcbf8332bbe1106ada/docs/api.md)
- [Engine producer compatibility](https://github.com/rwv/rtf-viewer/blob/d077653c92d4420126c145fcbf8332bbe1106ada/docs/compatibility.md)

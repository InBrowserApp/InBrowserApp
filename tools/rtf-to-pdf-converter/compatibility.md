# RTF PDF export

Accepts readable Rich Text Format documents with the RTF 1 header. Original
bytes, character-set declarations and Unicode escapes are passed to the
shared native Writer import filter. Renaming another format does not convert
it into RTF. Encrypted containers and malformed streams cannot be opened.
Editing restrictions on a readable document are not treated as encryption.

The shared LibreOffice WebAssembly runtime exports static PDF with supported
selectable text, page sizes/orientation, headers/footers, page breaks, tables
and embedded PNG/JPEG pictures. Missing fonts use bundled substitutes, so
wrapping, pagination and complex layouts may differ from the original app.
The PDF preview opens exactly the bytes offered for download; no OCR is added.

## Integrity and supported content

Preflight scans the original bytes and checks complete group structure,
control parameters, hexadecimal escapes and binary spans. Escaped braces and
binary contents do not change group balance. PNG/JPEG picture payloads are
collected outside nested metadata, signature-checked and browser-decoded
before loading the engine. Unsupported picture formats (including WMF/EMF,
DIB and Macintosh pictures), embedded/linked objects and embedded font files
are rejected, not silently discarded.

Supported field instructions are PAGE, NUMPAGES, REF, PAGEREF, TOC, FORMTEXT,
FORMCHECKBOX, FORMDROPDOWN and ordinary HTTP(S)/email/bookmark HYPERLINKs.
Field text is checked after Unicode/hex escapes and nested formatting are
interpreted; INCLUDEPICTURE, INCLUDETEXT, DDE and other field instructions
are unsupported. Comments are excluded; form controls use their printed
appearance. Macros do not execute, and signatures are not preserved or
verified. External document resources are never requested.

Native Writer page rectangles supply expected page order and dimensions.
The exported PDF must have the same page count and positive finite sizes,
with reported dimensions matching within 0.1 pt. Automatically inserted
blank pages retain their position; their size is taken from the PDF. These
checks detect known incomplete exports, but cannot prove every layout detail.
Users should inspect every page before relying on the result.

## Runtime and limits

This shares the native office engine and fonts with ODT/PPT conversion. Its
roughly 90 MB initial asset download is self-hosted and may be browser-cached.
The document stays in the browser. Conversion runs in disposable workers,
including guarded native pthreads, with document networking blocked. Close,
replace and cancel terminate owned workers and clear stale downloads.
Cross-origin isolation and full document navigation are required. There is
no product file-size, page-count or content-count quota; genuine browser
memory failures are reported when they can be surfaced.

## Provenance and verification

- Shared runtime and font licenses: `../../packages/lib/libreoffice/src/NOTICE.md`
  and `../../packages/lib/libreoffice/fonts/README.md`.
- [LibreOffice import/export filters](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html).
- [Microsoft RTF specification](<https://learn.microsoft.com/en-us/previous-versions/office/developer/office2000/aa140277(v=office.10)>).
- [Native RTF tokenizer](https://github.com/LibreOffice/core/blob/master/sw/source/writerfilter/rtftok/rtftokenizer.cxx).

Four original producer fixtures passed native-runtime feasibility exports in
Chromium, Firefox and WebKit. Independent PDF inspection found consistent
page counts and text, including Cyrillic and embedded images. Final application
acceptance and required CI are recorded in the pull request before merge.

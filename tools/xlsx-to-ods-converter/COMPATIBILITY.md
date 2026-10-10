# XLSX to ODS compatibility

## Supported data

This is a browser-only saved-value converter for ordinary UTF-8 XLSX packages.
The input parser validates relevant XML without resolving entities or fetching
links. Encrypted compound Office containers are rejected. Renamed XLS, XLSB,
XLSM, archives with VBA, unsupported sheet types, malformed XML and UTF-16 XML
parts produce an error rather than a partial download. CDATA values, ISO-string
date cells (as opposed to ordinary Excel numeric date serials), and cells without
explicit addresses are also rejected because the input engine does not handle
these variants reliably.

The ODF 1.3 package preserves worksheet names/order, empty sheets, cell positions,
text (including whitespace, literal formula-like text and leading zeroes), finite
numbers, booleans, and stored formula results. Hidden and very hidden sheets are
both exported as ordinary hidden sheets. A workbook with no visible sheet is
rejected. Missing formula results stay blank and trigger a visible warning.
Error results become their displayed error text. Formula expressions, links,
comments, scripts and external data connections are never included as active
content or recalculated.

Dates use the workbook's 1900/1904 epoch and retain wall-clock components, rounded
to milliseconds. Basic date/time and boolean formats make values readable in
spreadsheet applications. Time-only and elapsed formats become ODF durations.
The fictitious 1900-02-29, invalid date values, unsupported era/calendar or
multi-section date formats and durations outside millisecond integer precision
are rejected. Ordinary percentages and currency remain numbers without their
original display format or currency label.

Original styles, merged-cell layout, row/column dimensions, charts, images and
workbook settings are not reproduced. Stored cells inside merged areas retain
their original positions. The preview describes imported source cells; the
compatibility notes describe the exported representation.

## Resource behavior

Conversion and preview run in a cancellable worker. There are no fixed file-size
or sheet-count quotas. Sparse export visits stored cells and uses ODF row/column
repetition for gaps; A1 plus XFD1048576 does not trigger a rectangular traversal.
Actual browser allocation failures are reported. Replacing, closing or canceling
terminates workers and removes obsolete download URLs.

## Validation references

- [ODF 1.3 schema](https://docs.oasis-open.org/office/OpenDocument/v1.3/os/schemas/OpenDocument-v1.3-schema.rng)
- [ODF 1.3 package schema](https://docs.oasis-open.org/office/OpenDocument/v1.3/os/schemas/OpenDocument-v1.3-manifest-schema.rng)
- [SheetJS dates and date systems](https://docs.sheetjs.com/docs/csf/features/dates/)

Owned openpyxl fixtures cover typed values, formula caches, missing caches,
whitespace, hidden sheets, both epochs and the last Excel cell. Exported XML is
checked with the official ODF schemas; values are independently checked against
openpyxl input and by opening the output in LibreOffice. Browser checks also
exercise downloads, cancellation, stale results, keyboard access, narrow screens
and localized terminology. An input/output round trip through the same library
alone is not considered interoperability evidence.

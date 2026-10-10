# ODS to XLSX compatibility

This converter imports the saved cell data in an OpenDocument spreadsheet
archive. It does not reproduce a complete Calc document or translate formula
expressions into Excel's formula language.

## Included data

- Worksheet order, Excel-compatible names, empty worksheets and hidden sheets.
- Text, including leading zeros, Unicode, rich-text content flattened to plain
  text, explicit spaces, tabs and line breaks. Links remain plain text.
- Finite numeric values, booleans, repeated rows/cells, gaps and merged cells.
- Explicit ODF dates converted to Excel's 1900 date system with a standard
  date/time format. Zone-free values keep their wall time; explicit time zones
  are normalized to UTC. Dates outside Excel's supported 1900–9999 range are
  rejected. Numeric values are not reinterpreted from arbitrary source styles.
- Durations represented as numeric days and percentages with a basic format.
  Currency amounts keep their number, without a currency label or style.
- Saved formula results. Missing caches remain blank with a visible warning.
  Explicit error cells become `#VALUE!`. No formula expression, external data
  connection, script, macro or active hyperlink is carried into the result.

## Excluded or rejected features

Styles, fonts, row heights, column widths, drawings, charts, notes, validation,
print configuration, protection settings, names and other workbook settings
are not reproduced. Drawing-local and embedded chart tables are not imported
as worksheets. The preview is a window into imported cell data, not a claim
of visual or full-workbook fidelity.

Only `.ods` ZIP archives with the spreadsheet media type and a readable
spreadsheet content document are accepted. Encryption metadata is rejected
before reading encrypted content. Flat ODF and other renamed archive formats
are rejected. XML namespace aliases and UTF-8/UTF-16 documents are supported;
custom entity declarations are not accepted and no resources are fetched.

Excel's actual row, column, string and worksheet-name restrictions apply.
Names that cannot be kept unchanged and case-insensitive duplicates and Excel’s reserved `History` name are
rejected. Repeated merged anchors, stored data in covered cells, and all-hidden
workbooks are rejected
rather than producing ambiguous or unusable XLSX output. There is no fixed
file-size or worksheet-count cap; memory still limits large inputs.

## Validation and implementation notes

The owned fixtures exercise typed values, rich text, dates/time zones,
durations, caches, empty/hidden sheets, repetition, merges and omitted
embedded content. A two-cell sparse fixture reaches XFD1048576. The shared
XLSX writer uses sparse numeric rows, and the targeted SheetJS patch bounds
column iteration by each actual row's length. Empty rows with metadata still
serialize. Existing XLS and Numbers converters share this output path and
are included in regression checks.

Related format references:

- [ODF 1.3 schema specification](https://docs.oasis-open.org/office/OpenDocument/v1.3/os/part3-schema/OpenDocument-v1.3-os-part3-schema.html)
- [Excel worksheet-name restrictions](https://support.microsoft.com/en-gb/excel/rename-a-worksheet)
- [Microsoft's ODS/XLSX format comparison](https://support.microsoft.com/en-us/excel/differences-between-the-opendocument-spreadsheet-ods-format-and-the-excel-for-windows-xlsx-format)

These references describe the formats; the narrower behavior above defines
this converter's supported scope.

# Numbers to XLSX compatibility

The tool reads local Numbers 3+ ZIP/IWA archives in a worker and writes an XLSX
workbook. It exports worksheet data, not a reproduction of a Numbers document.

## Data and mapping

Each Numbers table becomes a separate Excel worksheet. Original sheet and table
names are retained for the visible mapping. Export names are unique without
regard to letter case, omit Excel-invalid characters, and fit Excel's 31 UTF-16
unit limit without splitting a surrogate pair. Worksheet and table order follows
the document archive, not the visual positions of tables on a Numbers canvas.

Text, leading-zero identifiers, Unicode, numeric values, booleans, empty cells,
dates/times, durations and supported merges are retained. Numbers dates use the
1904 date system. The converter distinguishes dates from durations before applying
formats: dates display date and time; durations remain numeric days. Empty text
is serialized as an empty string cell; readers may expose its value as null.

Formulas become their saved values. Expressions are not exported, missing saved
values remain blank, and errors use the generic `#VALUE!` error. There is no
calculation or external refresh. Comments and hyperlink metadata are omitted.
Charts, pictures, text boxes, controls, visual table placement and styling are
not preserved. Supported numeric formatting can differ from the source.

No product file-size or table-count quota is imposed. Actual XLSX format bounds
(rows, columns, and cell-string length) are validated to avoid truncation.
Encrypted, pre-3 XML, damaged and unsupported archives fail without a download.

## Parser changes and simplification

The existing SheetJS patch adds an opt-in `numbersNames` read option to expose
source names and Numbers cell types, using temporary internal names to avoid
premature Excel-name validation. Default viewer naming stays unchanged. Both
CommonJS and ESM entries receive identical changes. Strict reads fail on broken
IWA streams and incomplete or repeated tile indices instead of silently dropping
content. An empty merge list is accepted.

The converter and XLS converter share the XLSX writer, preview data, error
classification and navigation in the framework-free spreadsheet-conversion
package. The reusable worksheet UI stays in packages/ui and accepts typed data
and callbacks; it does not parse files. File replacement, cancellation and close
terminate workers and release download URLs. Client imports of navigation use a
separate entry to avoid loading the workbook parser on the main UI thread.

## Validation

Owned fixtures cover typed values, Unicode, dates, durations, merges, empty
and multiple tables, long/invalid names, encryption and 300 rows across tile
boundaries. A deliberately incomplete tile index is rejected. The XLS regression
suite also covers sparse sheets, both date systems, grouping, formula caches and
large BIFF continuation strings after shared-code promotion.

Independent source reading uses numbers-parser 4.20.0; output reading uses
openpyxl. Public formula, date and duration examples cover 7,874 nonempty cells
across 30 tables including the owned typed fixture. Output mapping, typed values
and absence of formula expressions are checked independently. Upstream examples
remain in temporary validation files rather than the repository.

References:

- [SheetJS supported formats](https://docs.sheetjs.com/docs/miscellany/formats/)
- [SheetJS parse options](https://docs.sheetjs.com/docs/api/parse-options/)
- [Numbers parser documentation](https://github.com/masaccio/numbers-parser)
- [Public source fixtures](https://github.com/masaccio/numbers-parser/tree/main/tests/data)

Browser validation uses Chromium, Firefox and WebKit, with actual downloads
checked in openpyxl. A valid 55,758,547-byte Numbers archive contains 1,700
32700-character strings; all are exported and compared to source values.
Canceling or replacing that file terminates its worker, and closing results
revokes their Blob URLs. A 1,001-table workbook exercises the output path in
unit tests; it is not presented as a native Numbers input fixture. All 23
locales receive 320 px keyboard, table-selection, mapping and focus-mode checks.

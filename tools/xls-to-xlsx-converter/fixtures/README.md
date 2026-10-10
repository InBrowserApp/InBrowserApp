# Owned legacy Excel fixtures

These synthetic files contain no third-party or user documents.

- `legacy.xls`: created from an owned workbook with LibreOffice. Sheets Report,
  Empty, Hidden, Sparse contain Unicode, dates, currency, merged cells, and two
  `SUM(B2:B3)` formulas with the saved result 37.75. Uses the 1900 date system.
- `typed-1904.xls`: created with Python xlwt. Contains Unicode sheet names, text
  `00123`, numeric 123, a boolean, 2026-10-10 12:30 with a date format, literal
  `=literal` and `<script>safe</script>` strings, a merge, row/column dimensions
  and groups, and empty, hidden, and very-hidden sheets. Uses the 1904 date system.
- `sparse.xls`: created with Python xlwt. Only A1 (`start`) and IV65536 (`end`)
  contain values, covering the BIFF8 worksheet boundary without a dense dataset.

Conversion is also checked manually using xlrd for the original XLS values and
openpyxl/LibreOffice for exported XLSX files, independently of the converter.

- `continuations.xls`: created with xlwt. Eight distinct long strings combine ASCII, Chinese, and emoji across BIFF SST continuation records.

# Owned delimited-text fixtures

Run `python3 tools/csv-to-xlsx-converter/fixtures/generate.py` from the repository root.
All content is synthetic and owned by this project.

- `typed.csv`: UTF-8 BOM; duplicate/blank headings, leading zeros, long identifiers,
  literal formulas and markup, XML escape-looking text, Unicode, quoted separators,
  embedded CR/LF/tab, empty fields, an empty record, and an uneven record.
- `tabs.tsv`: UTF-16 LE BOM with quoted tabs.
- `legacy.csv`: Windows-1252 semicolon-delimited text.
- `directive.csv`: a UTF-8 `sep=;` directive.

CSV stores text, not spreadsheet types. Expected output is one Sheet1 worksheet
with string cells and no formulas or hyperlinks. Header mode adds an AutoFilter
without changing cell values. Verify actual downloads independently with Python's
`csv` reader and `openpyxl`, including the original CR/LF sequences.

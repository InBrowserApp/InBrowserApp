Owned spreadsheet fixture authored with openpyxl 3.1.5 for this repository. No external document content.

`structured.xlsx` contains original Unicode sheet names, duplicate/empty headers, literal leading zeros, numeric formats, a date, a cached formula result (injected into the XLSX XML), a formula without a cached result, a spreadsheet error, a false boolean, quoted and multiline text, literal HTML/Markdown, hidden rows/columns, a merged cell, a hidden sheet, an empty sheet, and a saved value on row 1,001.

The XLSX parser normalizes CRLF within cell text to LF. Both retain the cell line break. Delimited-format tests separately check that the serializer preserves CRLF values supplied in its cell model.

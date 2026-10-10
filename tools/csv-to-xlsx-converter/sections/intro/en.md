## Convert delimited text to Excel

Open or drop a local CSV or TSV file, inspect the cells, and download an XLSX workbook with one worksheet named Sheet1. Choose the delimiter and text encoding if automatic detection does not match the file. TSV files use tabs by default. The preview window does not limit the exported data.

## Keep identifiers and original text

CSV and TSV do not store spreadsheet cell types. This converter keeps every field as text, including leading zeros, long identifiers, decimal-looking numbers, dates, and text beginning with an equals sign. It does not infer numbers or dates or execute formulas. Quoted separators, escaped quotes, Unicode, line breaks inside fields, empty fields, and blank records are preserved. Shorter rows leave blank cells. A final line ending terminates the last record rather than adding another row.

The first-row setting offers ordinary data or a header with Excel filters. Both keep the row exactly as written, including duplicate or empty headings. Automatic encoding supports UTF-8 and byte-order-marked UTF-16. Other encodings can be selected manually. A leading sep= directive is omitted only when automatic delimiter detection is selected or its separator matches the selected delimiter.

Malformed quoted fields, invalid text encoding, and data beyond Excel’s row, column, or cell-text limits produce an error instead of a truncated workbook. Inspect important values in a spreadsheet application after downloading.

## Local processing

Conversion runs in this browser without uploading the file. Changing import settings, replacing or closing the file discards the previous result. Canceling stops the worker. There is no fixed file-size limit; available browser memory determines which files can be processed.

To browse spreadsheet files, open the [Spreadsheet Viewer](../xlsx-viewer/).

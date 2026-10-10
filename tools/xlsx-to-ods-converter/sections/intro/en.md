## Convert Excel workbooks to OpenDocument

Open or drop a local XLSX file, inspect its cells, and download an ODS workbook. Worksheet names and order, empty and hidden worksheets, cell positions, text, numbers, booleans, dates, and saved formula results are included. The preview window does not limit the exported data. Very hidden worksheets become ordinary hidden worksheets.

## Saved values and compatibility

Formulas become their saved values. Missing results remain blank and are reported; the browser does not recalculate formulas or refresh external data. Spreadsheet error results become plain text. Leading-zero identifiers, non-Latin characters, and literal text beginning with an equals sign remain text.

Dates respect the workbook’s 1900 or 1904 date system and use a standard date/time format. Time-only values and durations use a basic duration format. Percentages and currency retain their number without the original formatting or currency label. The fictitious Excel date February 29, 1900 and unsupported custom date formats produce an error instead of a shifted date.

Styles, row and column dimensions, merged-cell layout, charts, images, comments, links, macros, and workbook settings are not reproduced. Stored values in merged areas remain at their original cell positions. This converter accepts XLSX, not XLS, XLSB, or XLSM. Encrypted files, invalid archives, unsupported sheet types, and data that cannot be represented in ODS produce a clear error. Check important results in your spreadsheet application after downloading.

## Local processing

Conversion runs in this browser without uploading the document. Replacing or closing the file discards the previous download; canceling stops the worker. There is no fixed file-size or worksheet-count cap. Available browser memory still determines which workbooks can be processed.

To browse Excel and other spreadsheet formats, open the [Spreadsheet Viewer](../xlsx-viewer/).

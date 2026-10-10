## Convert OpenDocument spreadsheets to Excel

Open or drop a local ODS file, inspect its cells, and download an XLSX workbook. Worksheet names, order, hidden worksheets, text, numbers, booleans, dates, saved formula results, and merged cells are included. Empty worksheets and gaps between cells are retained. The preview window does not limit the exported data.

## Saved values and compatibility

Formulas become their saved values, not Excel formulas. Missing saved results remain blank and are reported. The browser does not recalculate formulas or refresh external data. Error results become generic spreadsheet errors. Literal text, including leading-zero identifiers, non-Latin characters, and text beginning with an equals sign, remains text.

Dates use a standard date/time format; explicit time zones are normalized to UTC. Durations remain numbers of days and percentages use a basic percentage format. Currency values retain their number without the currency label or original formatting. Styles, row and column dimensions, charts, images, comments, links, macros, and workbook settings are not reproduced.

Encrypted files, invalid archives, unsupported data, and values or worksheet names outside Excel’s supported limits produce a clear error. Flat OpenDocument (.fods) files are not accepted by this converter. Check important results in your spreadsheet application after downloading.

## Local processing

Conversion runs in this browser without uploading the document. Replacing or closing the file discards the previous download; canceling stops the worker. There is no fixed file-size or worksheet-count cap. Available browser memory still determines which workbooks can be processed.

To browse ODS and other spreadsheet formats, open the [Spreadsheet Viewer](../xlsx-viewer/).

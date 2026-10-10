## Convert Numbers tables to Excel worksheets

Open or drop a local Numbers file, inspect the imported cells, and download an XLSX workbook. Each table becomes a separate Excel worksheet in source order. The mapping lists the original Numbers sheet and table names beside the output name. Names are adjusted for Excel’s length and character rules and kept unique.

Text, including leading-zero identifiers and non-Latin characters, numbers, booleans, dates and times, empty cells, saved formula results, and supported merged cells are included. Durations are stored as numbers of days. Use the worksheet selector and cell navigation to inspect the data; the preview window does not limit the export.

## Saved values and compatibility

Formulas are exported as their saved values, not as formulas. The browser does not calculate missing results or refresh external data. Cells without a stored value remain blank. Numbers errors become generic spreadsheet errors, so the original error reason may not survive.

This tool supports Numbers 3 and later archives that the parser can read. Older XML documents, password-encrypted files, damaged archives, and unsupported features produce an error. Charts, images, text boxes, table placement, interactive controls, and styling are not reproduced. Number formats may differ. Verify important workbooks in your spreadsheet application after downloading.

## Local processing

Conversion runs in this browser without uploading your document. Replacing or closing the file discards the previous download, and canceling stops the worker. No fixed file-size or worksheet-count limit is imposed; large documents still depend on available browser memory.

To browse Numbers and other spreadsheet formats, open the [Spreadsheet Viewer](../xlsx-viewer/).

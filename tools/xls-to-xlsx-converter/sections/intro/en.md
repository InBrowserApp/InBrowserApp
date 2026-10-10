## Convert legacy Excel workbooks in your browser

Open or drop a local XLS file. Choose a worksheet, inspect its cell data, and download an XLSX workbook. You can move through the preview or enter a top-left cell address to jump to another area. The preview window does not limit the export: all worksheets and their imported cells are included.

Worksheet names and order, empty sheets, hidden sheet states, text, numbers, booleans, spreadsheet errors, supported number formats, merged cells, row heights, column widths, and hidden rows and columns are retained where the source parser supports them. Text identifiers keep their leading zeros. Dates retain Excel serial values and the workbook’s date system.

## Formulas and compatibility

Supported formula expressions and their saved results are preserved. The browser does not recalculate formulas or refresh external data. A formula without a saved result appears with a notice in the preview; its expression remains in the output for a spreadsheet application to calculate. Unsupported formula expressions or external references may not survive the conversion correctly.

This is a data conversion, not a faithful reproduction of every workbook feature. Charts, images, macros, pivot features, and advanced styling are not preserved. The preview does not reproduce merged-cell layout or formatting. Check the downloaded workbook in your spreadsheet application, especially when formulas or layout matter. Macro sheets, chart sheets, encrypted files, damaged files, and files merely renamed to .xls are unsupported.

## Local processing

Your workbook is processed in this browser without uploading its contents. Macros are not executed and linked resources are not fetched. Replacing or closing the workbook discards the result; canceling stops conversion. There is no fixed file-size or worksheet-count limit, although large workbooks still depend on available browser memory.

To browse other spreadsheet formats, open the [Spreadsheet Viewer](../xlsx-viewer/).

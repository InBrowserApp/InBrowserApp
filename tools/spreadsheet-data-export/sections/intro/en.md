## Export a worksheet to a portable format

Open a local .xlsx, .xlsm, .xltx, or .xltm file or drop it into the exporter. Choose a worksheet by its original name, including hidden worksheets, and select CSV, TSV, JSON, or Markdown. Preview the output, copy it, or download a UTF-8 file named after the workbook and worksheet. Replacing or closing the file cancels unfinished work and removes previous downloads. The XLSX Viewer also offers an Export worksheet action for the current sheet.

The default cell range is the smallest rectangle containing saved values or formulas. Blank cells and rows inside that rectangle remain in the output. You can enter another range, such as A1:D20, and choose Apply range. An empty sheet produces an empty text file or an empty JSON array unless you choose a range explicitly.

## Choose how values and headers are represented

Formatted text follows supported number formats, keeping displayed dates and leading-zero number formats where available. Locale-dependent formats may differ from Excel. Stored values retain numbers and booleans; dates remain Excel serial numbers rather than acquiring a timezone. Text cells keep their text in either mode. Formulas use their saved results without recalculation. A missing saved result becomes a blank cell, with a notice in the interface. Spreadsheet errors remain readable strings such as #DIV/0!.

CSV and TSV quote fields containing separators, quotation marks, or line breaks. JSON is an array of row arrays: the first row stays in the data, duplicate or empty headers do not become object keys, and blank cells use null. Markdown can treat the first row as a header or add an empty header above all data rows. Markdown punctuation, HTML, pipes, and cell line breaks are escaped or represented safely. Downloads use UTF-8 without a byte-order mark; choose UTF-8 when importing into another application.

## Local processing and compatibility

Your workbook stays in this browser and is not uploaded or saved by the tool. Macros, scripts, and external data connections are not executed or refreshed. Hidden rows and columns are included in the selected range. Merged cells are not expanded into repeated values. Charts, images, comments, and workbook styling are not part of these text formats.

Encrypted, damaged, and unsupported workbooks have a clear error. There are no fixed file-size, worksheet, row, or column quotas, but a large export can exceed the browser’s memory. This exports saved data; it does not edit the workbook or promise that another spreadsheet application will interpret plain-text fields in the same way.

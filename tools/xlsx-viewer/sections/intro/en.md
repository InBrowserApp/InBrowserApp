## Browse spreadsheets and tables in your browser

Open a local file or drop it into the viewer. Switch worksheets, scroll through cells, adjust zoom, and inspect cell contents. Excel workbooks retain their existing reading experience. CSV and TSV files appear as a single worksheet; use Separator and Text encoding to correct detection. Text columns keep leading zeros, long identifiers, and date-like strings unchanged. Use Export worksheet to download the current sheet as CSV, TSV, JSON, or Markdown. Choose formatted text or stored values before preparing the export.

Supported formats include Excel XLSX, XLSM, XLTX, XLTM, XLS and XLSB; CSV and TSV; ODS and FODS; Numbers 3.0 and newer; compatible WPS ET/ETT and UOS spreadsheets; DIF, SLK, PRN and DBF; Lotus WK1/WK3/WK4/WKS/123; Quattro Pro WQ1/WQ2/WB1/WB2/WB3/QPW; Works XLR; and EtherCalc ETH. Compatibility depends on the version and features used in each file. Legacy formats focus on cell data rather than reproducing every visual detail.

## Privacy and compatibility

Files are processed locally and are not uploaded or saved by this tool. Fonts come from your device; no online fonts are requested. Formula cells show saved results when available. Formulas are not recalculated, macros never run, external data connections are not refreshed, and document links do not load automatically.

Numbers tables appear as separate worksheet tabs, with original sheet/table names where available. Older Numbers documents from before Numbers 3 are unsupported. DBF companion memo files are not loaded. PRN uses the fixed-width Lotus/Excel layout; arbitrary print files are unsupported. Charts, drawings, pivot features, fonts, and some styling may be missing in imported formats. A compatibility note appears alongside the document when these limitations apply.

There is no fixed file-size or sheet-count cap. Actual browser memory and archive-expansion safeguards still apply to complex files. Encrypted or damaged workbooks cannot be opened. This viewer does not edit or print spreadsheets.

Worksheet export includes hidden rows and columns and uses saved formula results. Missing saved results become blanks, spreadsheet errors stay visible, and merged cells are not expanded. JSON keeps the first row as data and uses row arrays with null for blank cells. Markdown can use the first row as a header. Formatted text follows supported number formats; stored dates remain Excel serial numbers. Charts, images, comments, and styling are not exported. For imported formats, the export reflects the worksheet data available in this viewer and its compatibility notes.
For a legacy XLS workbook, use the [XLS to XLSX Converter](../xls-to-xlsx-converter/) to inspect its imported data and download a modern Excel copy. Conversion has its own compatibility notes; open the file again in the converter.

To export local Numbers tables as Excel worksheets, use the [Numbers to XLSX Converter](../numbers-to-xlsx-converter/).

To export OpenDocument spreadsheet data as an Excel workbook, use the [ODS to XLSX Converter](../ods-to-xlsx-converter/).

To export Excel XLSX data as an OpenDocument spreadsheet, use the [XLSX to ODS Converter](../xlsx-to-ods-converter/).

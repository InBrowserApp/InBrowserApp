# CSV / TSV → XLSX data contract

CSV and TSV carry text fields, without spreadsheet types. Every imported field
is written as an XLSX string with text number format. No values are inferred as
numbers, booleans, dates, hyperlinks, or formulas. This preserves leading zeros,
large identifiers, exact decimal spellings and formula-like text.

- One `Sheet1` worksheet, in original record and field order.
- Delimiters: automatic (comma, tab, semicolon, pipe), or explicit choice. TSV uses
  tab by default. A leading `sep=` directive for these delimiters is omitted only
  in auto mode or when it agrees with the explicit separator.
- Encoding: strict UTF-8 by default, BOM-detected UTF-16 LE/BE; legacy encodings
  are explicit choices. Invalid byte sequences and binary/XML-forbidden controls
  fail rather than being replaced.
- Quoted delimiters, escaped quotes, Unicode and embedded line endings survive.
  Empty fields and blank records stay present; shorter rows leave absent cells.
  One final line ending terminates the last record without inventing another.
- Optional header mode adds an XLSX AutoFilter over the used range. It does not
  drop, rename, deduplicate or infer headings. Ordinary-data mode is the default.
- Preview windows do not constrain export. XLSX's actual 1,048,576-row,
  16,384-column and 32,767-UTF-16-code-unit cell limits are checked before writing.
  There is no file-size quota; browser resource failures remain possible.

The tool uses Papa Parse's local string parser, not URL/file-download parsing.
Worker termination cancels conversion. Changing options remounts conversion
state, terminates the old worker, and revokes the previous object URL.

References: [Papa Parse configuration](https://www.papaparse.com/docs),
[Excel specifications and limits](https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3).

The existing SheetJS patch also writes carriage returns in cell values as XML
character references. This keeps CR and CRLF intact in independent readers while
leaving literal `_x000d_` text unchanged. Both library entry points are patched;
no archive postprocessing or second XLSX writer is needed.

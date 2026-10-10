# Owned XLSX fixtures

Run `python3 generate.py` with openpyxl installed. These documents are generated
from values in this repository, with no external or private documents.

- `typed.xlsx`: Unicode/whitespace/leading-zero/literal-formula strings, numeric
  and boolean values, dates, times, elapsed and negative durations, cached and
  uncached formulas, an error, a merged anchor, a hyperlink, and empty/hidden/
  very hidden worksheets. Cached results are inserted directly into OOXML.
- `epoch-1904.xlsx`: dates using Excel's alternate epoch, time zero and 49 hours.
- `sparse.xlsx`: A1 and XFD1048576, exercising sparse row/column repetition.

Tests mutate these owned archives for malformed/unsupported cases. Output
interoperability is checked independently of the converter's XLSX parser.

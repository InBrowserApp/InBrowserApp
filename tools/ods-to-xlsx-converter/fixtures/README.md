# ODS conversion fixtures

All fixture text and workbook content is synthetic and repository-owned.
Regenerate the archives with Python 3 and its standard library:
`python3 tools/ods-to-xlsx-converter/fixtures/generate.py`.

- `typed.ods`: Unicode and leading-zero text, typed values, dates/time zones,
  durations, repeated rows/cells, merged cells, cached formulas of several
  types, a missing cache, a generic error, an empty worksheet, an inherited
  hidden-sheet style, and annotation/drawing/link content that must not leak
  into cell data or trigger requests.
- `sparse.ods`: two stored cells, at A1 and Excel's last cell XFD1048576.
- `protected.ods`: synthetic encryption metadata used to verify early
  rejection. It is not a claim of decrypting or producing encrypted ODS data.

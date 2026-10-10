# Owned Numbers fixtures

`typed.numbers` is generated from owned test data with numbers-parser 4.20.0.
It contains four tables across three sheets: Unicode, text `00123`, a number,
a boolean, a date/time, a 26.5-hour duration, literal formula-like text, a merged
cell, an empty table, names with Excel-invalid characters, and a long sheet name.

`protected.numbers` contains the same data, encrypted with the non-secret test
password `owned-password`. The application rejects password protection.

`generate.py` reproduces both archives using Python and numbers-parser. Newly
added one-tile tables need their row-tile tree initialized explicitly because
numbers-parser writes the cells but leaves that tree empty. The tree points to
the existing tile; it does not change the table data. Both source files are
independently reopened and checked with numbers-parser during verification.

Public upstream formula/date/duration samples are used only for manual
cross-validation and are not bundled with this tool.

`multi-tile.numbers` has 300 rows, each containing a row index and Unicode text.
`partial-tile.numbers` contains the same table data but an incomplete row-tile
index. The converter must reject that archive rather than silently exporting
only the first 256 rows. Tests verify values on both sides of the tile boundary.

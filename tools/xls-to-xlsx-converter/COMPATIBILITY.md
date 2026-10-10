# XLS to XLSX compatibility

The tool accepts genuine legacy BIFF XLS data, either in a compound file with a
Workbook/Book stream or as raw BIFF. Renamed CSV, HTML, OOXML, and unrelated
compound files are rejected. Encrypted workbooks and unsupported macro/chart
sheets fail explicitly. File bytes are read and written in a disposable worker;
replacement, cancellation, close, and unmount terminate it and revoke downloads.

## Data and formulas

The converter uses the existing cataloged SheetJS CE version with legacy
codepages enabled. It requests formulas, number formats, cell text, row/column
metadata, and blank stubs. Dates stay numeric, preserving the workbook's date
system. The full workbook is written to XLSX, including hidden and empty sheets;
the 20-row by 8-column preview is only a navigation window.

Supported formula expressions and saved results are retained. There is no
formula evaluation or external-data refresh. A missing/NaN formula cache is
written without a numeric value and clearly identified in the preview. An
independent spreadsheet application may calculate it when opening the output.
Unsupported formula expressions and external references may not survive intact.
Charts, images, macros, pivot features, and advanced styling are not preserved.
This is data interchange, not a full-fidelity workbook round trip.

See the primary documentation for [parsing options](https://docs.sheetjs.com/docs/api/parse-options/),
[writing options](https://docs.sheetjs.com/docs/api/write-options/),
[formulas](https://docs.sheetjs.com/docs/csf/features/formulae/), and
[dates](https://docs.sheetjs.com/docs/csf/features/dates/).

## Writer compatibility

A temporary numeric-row representation shares empty row arrays and keeps
references to stored cells. This avoids expensive string-key lookups across the
entire rectangular XLS range while retaining the normal writer's handling of
formulas, formats, merges, metadata, and relationships. The source worksheet
objects used for preview do not gain a duplicate dense representation.

SheetJS 0.20.3 emits both `level` and `outlineLevel` on grouped columns. OOXML
allows `outlineLevel`; the extra `level` attribute causes openpyxl to reject the
workbook. The tracked dependency patch omits that extra attribute at its source, preserving
widths, hidden states, and grouping. This avoids unpacking and rewriting output
archives in the converter.

The same patch caches BIFF continuation boundaries in a set. The parser previously
searched an array for every character in a continued string, causing quadratic
work on large shared-string tables. The cache preserves boundary handling while
using constant-time membership checks. Both ESM and CommonJS source entries are
patched; mixed ASCII/Unicode continuation fixtures and existing viewer tests
cover the shared parser path.

## Verification

Owned BIFF fixtures cover both date systems, Unicode, numeric/text distinctions,
booleans, empty and hidden/very-hidden sheets, merges, dimensions, groups,
formulas and cached results, and A1/IV65536 sparse boundary cells. Synthetic
variants cover missing formula caches, macro/chart sheets, and an excluded VBA
storage stream. See `fixtures/README.md` for provenance.

Browser-produced files are independently checked using xlrd for original XLS
values and openpyxl for downloaded XLSX values, formulas, names, date systems,
merges, and row/column metadata. Browser checks also cover keyboard navigation,
focused mode, cancellation, replacement, and stale-download cleanup. A 56 MB
owned file and a workbook with 1,001 sheets exercise the absence of arbitrary
input quotas; actual capacity still depends on the browser's available memory.

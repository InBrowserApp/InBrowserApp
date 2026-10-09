# Spreadsheet import compatibility

The viewer keeps the original OOXML reading path for XLSX, XLSM, XLTX, and XLTM.
Other formats are read in a local worker and represented as worksheet data.
There is no server conversion, formula evaluation, macro execution, or refresh
of external links. A format's advertised file extension does not guarantee that
every version or feature of that format can be read.

## Validation matrix

| Family                            | Evidence                                                                                                                                  | Boundaries                                                                                                                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| XLSX / XLSM / XLTX / XLTM         | Existing OOXML reader tests; native workbook content with saved and missing formula results                                               | Macros are ignored; template content is read without creating a new document                                                                                                                                    |
| XLS / XLSB                        | Serialized BIFF8 and XLSB tests; LibreOffice XLS export; public Calamine `any_sheets.xlsb`                                                | Data and supported number formats; legacy drawings and charts are not imported                                                                                                                                  |
| CSV / TSV                         | Owned UTF-8, UTF-16, Windows-1252, quoting, embedded newline, leading-zero, long-identifier, empty-field, and uneven-row cases            | All fields remain text; separator and encoding can be corrected                                                                                                                                                 |
| ODS / FODS                        | Serialized tests and LibreOffice exports with dates, currency, formulas, merges, hidden sheets, an embedded chart, and a sparse last cell | Chart-local tables are excluded; saved numeric display text is retained where the format parser differs                                                                                                         |
| Numbers                           | Serialized current archive; public SheetJS example; public numbers-parser fixture containing three tables across two sheets               | Numbers 3+ archive layout; tables become separate tabs using the parent sheet name and a suffix for additional tables; original table titles are unavailable; pre-3 XML and encrypted documents are unsupported |
| ET / ETT                          | Native ET/ETT templates extracted from the official WPS Linux 11.1.0.11723 package; ET cell data independently compared with LibreOffice  | The native ETT fixture contains three empty sheets; populated ET chart-data templates also read correctly; incompatible proprietary variants are not supported                                                  |
| UOS                               | Owned LibreOffice UOF spreadsheet export; structured XML cases with explicit coordinates, blank cells, merges, and saved formulas         | UOF 1 XML and ZIP `content.xml` layout tested; other generations need independent fixtures                                                                                                                      |
| DIF / SLK / PRN / DBF             | Real files serialized by the format library and checked after import                                                                      | PRN follows Lotus/Excel fixed-width layout; DBF companion memo files are not loaded                                                                                                                             |
| WK1 / WK3 / WK4 / WKS / 123       | Serialized WK1/WK3; public corpus WK4/WKS; LibreOffice `universal-content.123`                                                            | Saved values take priority; some legacy formula expressions and visual features are unavailable                                                                                                                 |
| WQ1 / WQ2 / WB1 / WB2 / WB3 / QPW | Public format-corpus examples, including two WQ2 workbooks; WB3 independently compared with LibreOffice                                   | Non-finite numeric results become spreadsheet errors; legacy formula expressions and layout may be incomplete                                                                                                   |
| XLR                               | Genuine Microsoft Works template from LibreOffice bug 45922; all 43 populated cells independently compared with LibreOffice               | Native Works streams verified; the template has no numeric/formula cells, and exact Works version and chart fidelity are not established                                                                        |
| ETH                               | Serialized EtherCalc/SocialCalc data tested                                                                                               | Worksheet cell data; no collaborative editing, recalculation, or remote connections                                                                                                                             |

All of the matrix's serialized tests use real format encodings, not an XLSX file
with a different extension. The test suite also checks rejection of damaged
inputs, worker cancellation, sparse output, and missing formula caches.

The browser acceptance run covers Chromium, Firefox, and WebKit: desktop and
mobile layouts, focus-mode import controls, encoding correction, worksheet
switching, hidden and empty sheets, merged cells, saved dates and formula values,
and navigation to `XFD1048576` in a two-cell worksheet. The three-table Numbers fixture is also compared cell by cell against
numbers-parser output, including empty cells and the mapping from original
sheet/table names to viewer tabs. Closing a file releases all document workers.
The acceptance run rejects any non-origin HTTP(S) request and includes actual
external image and workbook references; none are requested.

No fixed input byte, worksheet, row, or column cap is added. A worker can be
terminated when a file is replaced or closed. Existing document archive
expansion safeguards and actual browser memory still apply.

## Reproducible references

- [SheetJS CE supported formats](https://docs.sheetjs.com/docs/miscellany/formats/)
- [SheetJS read options](https://docs.sheetjs.com/docs/api/parse-options/)
- [SheetJS license](https://docs.sheetjs.com/docs/miscellany/license/)
- [Microsoft Works XLR test attachment](https://bugs.documentfoundation.org/attachment.cgi?id=69144)
- [Calamine test files](https://github.com/tafia/calamine/tree/master/tests)
- [Numbers parser test files](https://github.com/masaccio/numbers-parser/tree/main/tests/data)
- [SheetJS Numbers example](https://github.com/SheetJS/sheetjs/blob/master/modules/test.numbers)
- [Open Preservation format corpus](https://github.com/openpreserve/format-corpus/tree/master/office/spreadsheet)
- [Official WPS Linux package used for native ET/ETT validation](https://wdl1.pcfg.cache.wpscdn.com/wpsdl/wpsoffice/download/linux/11723/wps-office_11.1.0.11723.XA_amd64.deb)
- [LibreOffice Lotus test files](https://github.com/LibreOffice/core/tree/master/sc/qa/unit/data/123)

Third-party sample files were used for manual validation and are not bundled
with the viewer. Automated fixtures are generated from owned test data.
SheetJS CE 0.20.3 is obtained from its official distribution and distributed
with its Apache-2.0 license at `/licenses/sheetjs.txt`.

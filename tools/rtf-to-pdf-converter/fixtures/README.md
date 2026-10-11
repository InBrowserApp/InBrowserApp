# Original RTF fixtures

`reading.rtf`, `river-survey.rtf`, `river-survey-pandoc.rtf` and
`windows-1251.rtf` are original fixtures copied from the RTF viewer. See
`../../rtf-viewer/fixtures/README.md` for their authorship and reproduction.
They cover two-page formatting and an embedded PNG, independent LibreOffice
and Pandoc reports, Unicode escapes and actual Windows-1251 Cyrillic bytes.

`page-styles.rtf` was exported with LibreOffice 25.2.3.2 from the original
`../../odt-to-pdf-converter/fixtures/page-styles.odt` using the Rich Text Format
filter. It covers mixed A4 portrait/A5 landscape pages, page headers/footers,
columns, tables, multilingual text and an embedded PNG. All fixture content
is original and redistributable under the repository license.

Tests create small malformed/control-word variants in memory. Large files
and long documents are generated locally for acceptance without committing
large padding files. These samples do not establish universal RTF fidelity.

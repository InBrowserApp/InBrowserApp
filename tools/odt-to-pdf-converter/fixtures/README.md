# Converter fixtures

`river-survey.odt` and `river-survey.ott` are the original fictional fixtures
from the ODT viewer, saved with LibreOffice 25.2.3.2. The source prose is in
`../odt-viewer/fixtures/source.md` relative to the tool directory. They cover
headings, a list, a table, a footnote, a reference, multilingual text and four
rendered pages.

`page-styles.fodt` is original flat OpenDocument XML. LibreOffice saved it as
`page-styles.odt` with `--convert-to odt:writer8`. It covers A4 portrait and A5
landscape pages, page-style changes, headers, footers, two columns, a table,
multilingual text and the project's original four-color PNG from the HWP
fixture. It renders as three pages. All content uses the repository license.

`blank-pages.odt` derives from `page-styles.odt` with the landscape page layout
restricted to right pages. Writer inserts an automatic blank page before it,
resulting in four pages; the native page-rectangle API reports that blank as
zero-sized, while the PDF retains A5 landscape paper.

Small derived packages in tests deliberately change encryption markers,
resource references or XML for isolated validation cases. Third-party
content is not redistributed.

# Original compatibility fixtures

All content in this directory was authored for InBrowser.App testing and may be
used under the repository license.

- `reading.docx` and `reading.doc`: `create-fixture.py` creates an original source
  with English, Chinese, Russian, Arabic and Hebrew text, two list styles, a
  table, an original three-color PNG, a page break, running header/footer and
  tracked insertion/deletion. Convert with LibreOffice 25.2:
  `libreoffice --headless --convert-to 'doc:MS Word 97' reading.docx`.
  The DOC preview must retain the main text/table/image, show the insertion and
  omit the deletion. Running header/footer omission must be disclosed.
- `river-survey.md` and `river-survey.doc`: original Markdown converted using
  Pandoc to DOCX and LibreOffice to Word 97 DOC. Contains a footnote, internal
  reference, multilingual text, a table and twenty observation headings.
  The footnote body is a documented limitation of the DOC reader; the omitted
  story must trigger the partial-preview indicator.

The `.wps` and `.wpt` compatibility samples are genuine public documents and
native WPS templates kept outside the repository. See `../compatibility.md`
for provenance. Renaming a DOC file is not used as evidence of WPS compatibility.

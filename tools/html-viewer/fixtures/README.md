# HTML viewer fixtures

All text and assets in this directory are original project fixtures, covered by
the repository license. No third-party articles or reports are redistributed.

- `river-report.html`: an authored standalone article/report with multilingual
  prose, embedded PNG, internal/external links, a wide table, a wide code block,
  and a long heading outline.
- `standalone.xhtml`: a well-formed XHTML document with an embedded PNG, mixed
  scripts, an internal reference, and an empty XML element.
- `active-content.html`: an intentionally hostile document with tracking
  resources, a script, form, redirect, iframe, object, event attributes, unsafe
  protocols, and forged viewer attributes. All domains are reserved examples.
- `active-content.xhtml`: an external DTD reference, script CDATA, and CSS CDATA
  containing a closing style tag and active markup. This exercises XML-to-HTML
  serialization without resource requests or markup reactivation.
- `pandoc-report.html`: genuine Pandoc HTML output from `river-report.html`,
  using `pandoc --standalone --embed-resources --metadata title='Pandoc river
report'`. It exercises producer CSS and header anchors.
- `libreoffice-report.html`: genuine LibreOffice 25.2.3.2 HTML output from the
  project-owned `tools/odt-viewer/fixtures/river-survey.odt`, exported with the
  `HTML (StarWriter)` filter. It exercises producer styles, named anchors,
  tables, footnotes, and formatting.

Browser checks additionally generate temporary UTF-16 XHTML, Windows-1252 HTM,
1,001 headings, and an HTML file larger than 50 MiB. Large generated files are
not committed.

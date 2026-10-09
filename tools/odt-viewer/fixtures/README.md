# Viewer fixtures

`river-survey.odt` and `river-survey.ott` contain original, fictional text
created for this project, then saved with LibreOffice 25.2.3.2 as genuine
OpenDocument text and template packages. They are licensed under the repository
license. Their source contains headings, a list, table, a footnote, an internal
reference, Unicode text, and several pages of observations. Explicit page breaks are
covered by focused XML fixtures, not by these LibreOffice samples.

The original prose is in `source.md`. Pandoc converted it to DOCX, then
LibreOffice saved ODT with `writer8` and OTT with `writer8_template`.

Tests construct additional small ODF packages from original XML for isolated
format/security cases. Those are format fixtures, not evidence of compatibility
with every office suite. No third-party document content is redistributed.

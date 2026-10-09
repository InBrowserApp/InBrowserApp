# MHTML fixtures

All report text and the small raster illustration are project-owned. No external
website content or personal messages are included.

- `report-source.html`: the standalone project-owned river survey report used
  as the producer input, also used by the HTML reader's fixture set.
- `chromium-report.mhtml`: genuine Chromium 154.0.8037.92 CDP
  `Page.captureSnapshot({ format: "mhtml" })` output. The producer input was
  served at `http://127.0.0.1:4461/report.html`; its CSS and PNG were served as
  `report.css` and `marker.png` instead of inline data, with a `.banner` CSS
  background using that same PNG. The resulting file contains the captured
  HTML, stylesheet, and image. The local producer server is unnecessary for
  reading the archive and must never be contacted by the viewer.
- `html-docx-report.mht`: the unmodified `word/afchunk.mht` payload from
  html-docx-js 0.3.1's public `asBlob(reportSource)` DOCX API. This is an
  independent producer's quoted-printable MHT container with bundled PNG and
  file-scheme Content-Location. It is **not** claimed to be a Microsoft Word or
  Internet Explorer capture. The MIT producer was downloaded from the official
  npm registry solely to create this fixture; it is not a runtime dependency.

Unit tests create small targeted MIME examples separately. Browser acceptance
also generates temporary malicious/incomplete/empty archives, Content-ID and
Windows-1252 quoted-printable input, a 1,001-image archive, and a 51 MiB archive.
Those synthetic cases are stress and edge-case checks, not genuine captures.

# ODT / OTT PDF export

Accepts readable OpenDocument text documents (`.odt`) and templates (`.ott`).
The package and its text body must be valid; a renamed extension does not change
its format. Password-protected packages are rejected before loading the engine.

The converter uses the shared, self-hosted LibreOffice WebAssembly runtime in
library mode. It exports static PDF pages with supported selectable text,
page styles, paper dimensions, orientation, headers, footers, columns, tables,
and embedded images. Fonts are substituted with bundled fonts when unavailable;
spacing, wrapping and pagination can differ from the source application. No
pixel-identical or native office fidelity guarantee is made. The preview opens
the exact bytes offered for download, and scanned text receives no OCR.

## Integrity and resources

Preflight validates the package MIME, manifest entries and text XML, rejecting
ambiguous duplicate entries and unsafe package paths. Namespace aliases and
UTF-16 XML are accepted. Referenced package resources must exist. Raster images
(PNG, JPEG, GIF, BMP, WebP) are identified from their bytes and must decode before
the engine starts. Self-contained SVG shapes are accepted; active SVG, remote
references and unsupported image encodings fail instead of silently disappearing.

Embedded objects (including charts/formulas stored as separate objects), OLE,
plugins, media, floating frames and linked sections are outside this converter's
scope. Comments are excluded, form controls are exported as their fixed printed
appearance, and macros are disabled. Digital signatures are not verified or
preserved. Ordinary hyperlinks are not fetched during conversion.

The native Writer page-rectangle API supplies physical page sizes in twips.
The PDF page count and each reported positive page extent must match (within
0.1 pt). Writer reports automatically inserted blank pages with zero extents;
they retain their position, and their PDF paper dimensions must be positive
and finite. These blank pages are retained rather than rejected or skipped. `getParts`
is not used for Writer pagination: its public contract is for sheets/slides.
These checks detect known loss; they cannot prove every layout feature renders
correctly. Every page should be checked in the preview.

Engine assets load separately from document processing. Conversion and its
native pthreads run in disposable workers with document networking blocked.
Cancel, close and replace terminate work and clear any previous download. There
are no product file-size or page-count quotas. Browser resource failures are
reported when the browser can surface them. Initial engine/font download is
about 90 MB and shares the same fingerprinted assets as the legacy PPT converter.
Both routes require cross-origin isolation and full document navigation.

## Sources and evidence

- Shared engine and font provenance: `../../packages/lib/libreoffice/src/NOTICE.md`
  and `../../packages/lib/libreoffice/fonts/README.md`; deployed notices are in
  `/licenses/libreoffice-converter.txt`.
- Writer page API: [LibreOfficeKit.hxx](https://github.com/LibreOffice/core/blob/master/include/LibreOfficeKit/LibreOfficeKit.hxx).
- Blank-page and form export options: [LibreOffice PDF parameters](https://help.libreoffice.org/latest/en-US/text/shared/guide/pdf_params.html).
- Package manifest, encryption and IRIs: [OpenDocument 1.3 packages](https://docs.oasis-open.org/office/OpenDocument/v1.3/os/part2-packages/OpenDocument-v1.3-os-part2-packages.html).

The original ODT/OTT viewer fixtures exported as four Letter pages with selectable
text in Chromium, Firefox and WebKit native-runtime prototypes. The original
`page-styles.odt` fixture exported as three mixed A4 portrait / A5 landscape
pages, retaining headers, footers, columns and the embedded PNG; its page sizes
were compared with a desktop LibreOffice export. Final application-bundle
acceptance is recorded in the pull request before merge.

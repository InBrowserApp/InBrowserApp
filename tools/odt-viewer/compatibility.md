# ODT and OTT compatibility

The viewer reads OpenDocument text packages locally with `odf-kit` 0.14.4.
It is a continuous, read-only reading preview, not an office editor or print
renderer. The MIME type and document body determine the format; renaming an ODS
spreadsheet to `.odt` does not make it a supported text document.

## Reading behavior

- Paragraphs, headings, lists, tables, and supported embedded raster images are
  rendered as selectable HTML. Headings populate a document outline.
- Zoom scales both relative and absolute source font sizes while retaining the
  visible reading position. Focus mode provides a larger reading area.
- Bookmarks and footnote citations become inert, keyboard-accessible reader
  commands. A missing target produces feedback. External links are disabled.
- Tracked changes use the final-text policy: inserted content is retained and
  deleted content is hidden, without modifying the source file.
- Explicit paragraph `fo:break-before="page"` and `fo:break-after="page"`, including
  inherited paragraph styles, produce separators. Soft pagination markers are
  not treated as authoritative page counts. Table/section page breaks and exact
  page dimensions are not reproduced.
- Default and first-page headers and footers exposed by the parser are available
  in a separate expandable section. They do not repeat on virtual pages. Other
  master-page variants and dynamic page fields may differ or be unavailable.
- Footnotes/endnotes appear next to their reference, not at printed-page bottoms.
- Template content opens directly as a read-only document.

## Known boundaries

Missing fonts change wrapping. Complex columns, anchored positioning, charts,
vector images, embedded objects, and comments are not faithfully reproduced.
Text boxes may be flattened into reading order. The viewer flags unavailable
images and unsupported drawings/objects/comments, but successful opening does
not establish complete format fidelity. Saved field values are not recalculated.
Digital signatures are not verified. Encrypted ODF content must be saved as an
unencrypted copy in an office application before reading.

Only document metadata and referenced embedded images are extracted from ZIP
packages. No arbitrary file, page, heading, or archive-entry cap is applied.
Actual allocation failures produce resource feedback. Parsing uses a disposable
worker; replacing or closing a file cancels that worker. No document data is
persisted or uploaded.

HTML is sanitized before insertion into an isolated iframe. A first-in-head CSP
blocks scripts, network resources, frames, forms, and remote fonts. Resource-bearing
CSS, active elements, native navigation, and non-raster image URLs are removed.
User IDs are namespaced to prevent DOM named-property collisions. Only sanitized
fragment references become parent-owned navigation commands.

## Verification material

The committed fixtures are original, fictional survey notes saved by
LibreOffice 25.2.3.2 as genuine ODT and OTT packages. They exercise heading/list/
table/footnote/Unicode reading and template identity. Focused XML fixtures cover
final tracked text, page breaks, headers/footers, encryption metadata, namespace
aliases and spoofing, UTF-16 XML, missing images, unsupported objects, malformed
packages, and more than 1,000 headings and 10,000 archive entries.

These tests characterize specific outcomes. They do not claim that every file
from LibreOffice, OpenOffice, or another producer renders identically.

## Primary references

- [OpenDocument 1.3 package specification](https://docs.oasis-open.org/office/OpenDocument/v1.3/os/part2-packages/OpenDocument-v1.3-os-part2-packages.html)
- [odf-kit source and reader documentation](https://github.com/GitHubNewbie0/odf-kit)
- [DOMPurify security guidance](https://github.com/cure53/DOMPurify)

New dependency license notices are distributed at `/licenses/odt-viewer.txt`.

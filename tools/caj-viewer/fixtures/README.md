# CAJ viewer fixtures

`field-notes.caj` and `field-notes.kdh` contain original, invented three-page
field notes with text, a colored diagram, simple table rules, and two CAJ
bookmarks. No academic document was copied. Their container layouts follow
the documented CAJ and KDH formats and were independently opened with the
published `caj2pdf-rust` 0.6.1 package.

`image-pages.nh`, `image-c8.caj`, and `native-text.nh` are original synthetic
controls from the MIT-licensed upstream `js/test/hnc8-fixtures.mjs` at
https://github.com/rwv/caj2pdf-rust . The first two contain tiny bilevel
patterns, not a legibility benchmark. The last requires native-text support
and is expected to receive a clear unsupported-variant explanation. See the
upstream notice in `apps/web/public/licenses/caj2pdf-rust.txt`.

`asymmetric-jpeg.nh` contains an owned 32 × 32 JPEG with red/green top
quadrants and blue/yellow bottom quadrants. Its HN-A container uses the same
upstream MIT fixture layout, with one type-1 image filling an 80 × 80 source
rectangle. The original image bytes are retained in the NH file at offset
`0x19c`. It detects vertical reflection, rotation and altered image placement;
tests also move its image into a larger page without changing the JPEG.

Genuine public CAJ, KDH and NH papers were checked separately from an external
local cache; their redistribution rights are not established, so their bytes
are not committed. See `../compatibility.md` for the exact provenance and
observed results.

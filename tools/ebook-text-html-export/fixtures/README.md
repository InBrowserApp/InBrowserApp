# Ebook export fixture

`reading.epub` is a small synthetic EPUB 3 created for this repository. It
contains two reading chapters, a navigation document in the spine, a repeated
spine entry, and a footnote document outside the spine. It covers Unicode, Arabic
language/direction, duplicate publisher IDs, cross-chapter links and backlinks,
lists, tables, preformatted text, embedded raster/SVG images, and inert active
content. The external example/invalid URLs are intentional privacy probes; they
must never be fetched while opening or exporting the fixture.

Expected export: two main chapters followed by one supporting section, each
reading paragraph once, usable local references, and embedded static images.
The existing MOBI/AZW3 and FB2 reader fixtures supply independent format and
encoding coverage. No copyrighted third-party book content is included.

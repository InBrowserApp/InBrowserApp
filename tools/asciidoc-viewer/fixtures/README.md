# AsciiDoc reading fixtures

`field-manual.adoc` is an original, self-contained test manual created for this
repository. It exercises document and nested section titles, internal references,
footnotes, an explicit external link, tables, nested and ordered lists,
admonitions, a wide code block with a callout, a description list, a quotation,
non-Latin text, and a tiny embedded raster image.

`unavailable-resources.adoc` is an original negative fixture. It contains local
and remote includes, local and remote images, diagram source, an unresolved
project attribute, passthrough script and event handlers, a frame, form, refresh,
and CSS resource requests. No document-originated request should occur when it
is opened. Include references remain visible but are not navigable.

The independent Git `gitcli.adoc` manual is downloaded only for compatibility
checks, not bundled in this repository. Its source and revision are recorded in
`../compatibility.md`.

# AsciiDoc viewer compatibility

The viewer uses the public browser entry of `@asciidoctor/core` 4.1.1 in a
single-use module worker. Parsing explicitly uses secure mode, no custom
extensions, no source highlighter, no external stylesheet, and no generated
footer timestamp. The parent sanitizes the resulting HTML using
`@workspace/web-document` and displays it behind a restrictive CSP. Secure mode
alone does not sanitize AsciiDoc passthrough HTML.

The viewer accepts `.adoc` and `.asciidoc`, UTF-8 and BOM-marked UTF-16. It renders
self-contained titles, sections, prose, ordinary formatting, lists, tables,
admonitions, code, callouts, footnotes, and internal references. Tables and code
have their own horizontal scroll areas. Text remains selectable. Contents,
zoom, reading width, focus mode, and reading progress use the shared reader UI.

Includes are disabled and their resulting references remain visible and inert.
Images, fonts, styles, and other assets outside the selected document are not
loaded. The reading notes identify detected local/remote resources, include
references, and parser warnings. Custom macros, diagrams, project attributes,
and other build-system extensions are not executed; source text can remain in
the preview. Embedded raster images are supported; SVG and active content are
removed. External links open separately only on deliberate activation.

The conversion worker terminates on success, failure, close, replacement, or
unmount. A stale result cannot replace the new document. No file-size or heading
count cap is applied. The processor’s default 4 KiB attribute-value truncation
is disabled to preserve document text and embedded-resource attributes. Genuine allocation failures receive a resource-error
message. There is no editing, export, account, or automatic document storage.

## Representative inputs

- `fixtures/field-manual.adoc`: original structured multilingual technical manual.
- `fixtures/unavailable-resources.adoc`: original missing-dependency and active
  content fixture.
- [Git command-line conventions manual](https://github.com/git/git/blob/6de20f6092dcf9bdb1c8efe03db4b70c82b423dd/Documentation/gitcli.adoc):
  independently authored real documentation, retrieved from the public Git
  repository at revision `6de20f6092dcf9bdb1c8efe03db4b70c82b423dd`.
  The GPL-2.0-licensed source is not redistributed here. Git-specific `linkgit`
  macros require its documentation build and may remain as text.
- Generated 1,001-section document and valid source exceeding 50 MiB, with
  end-of-document markers checked to detect truncation.

## Upstream references

- [Asciidoctor.js browser installation](https://docs.asciidoctor.org/asciidoctor.js/latest/setup/install/)
- [Asciidoctor safe modes and passthrough limitation](https://docs.asciidoctor.org/asciidoctor/latest/safe-modes/)

## Observed checks

The production build was checked in Chromium, Firefox, and WebKit on
2026-10-09. The controlled manual and independent Git manual rendered, internal
and outline navigation worked (including after zoom), and 1,001 numbered
sections remained accessible. Width, focus, Escape, close, malformed/empty
input, embedded-image rendering, and missing-resource notes were checked.
Desktop and 320-pixel screenshots were visually reviewed; mobile admonition
labels remain whole words.

All three browsers preserved an attribute longer than 4 KiB, emitted no
external document-resource requests, and reported no page errors. Worker
instrumentation confirmed release after conversion. Chromium also opened a
53,477,469-byte valid document through its final heading, then cancelled an
active worker and opened a replacement without stale content.

The pre-translation screenshots include an RTL direction stress check with
English labels. Actual translated routes must be checked after the locale
catalogs are integrated. The independent manual includes Git-specific macros
that remain literal text, as expected without its documentation build context.

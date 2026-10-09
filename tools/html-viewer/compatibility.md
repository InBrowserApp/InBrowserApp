# HTML document compatibility

Verified on production output with Chromium, Firefox, and WebKit. The local
reader uses the browser's HTML/XML parsers, DOMPurify, a sandboxed iframe, and
a first-head restrictive Content Security Policy. It does not fetch documents
or their remote resources.

## Representative checks

- Original standalone HTML article/report: title, headings, mixed-language
  text, embedded PNG, styles, internal links, text selection, wide table, and
  code block.
- Genuine Pandoc HTML export and LibreOffice 25.2.3.2 HTML export of
  project-owned documents: producer styles, headings, lists, table, footnotes,
  named anchors, and text.
- Strict XHTML with XML empty elements, namespace, embedded image, and CSS
  CDATA; UTF-16 XHTML and Windows-1252 HTM.
- Malicious HTML and XHTML: scripts, event attributes, redirects, forms,
  iframes, objects, unsafe links, forged viewer attributes, CSS resource URLs,
  external DTD references, and active markup inside CSS CDATA. No outgoing
  document requests or page errors occurred. External links only reached the
  parent open handler after user activation, with `noopener,noreferrer`.
- A document over 51 MiB and an outline with 1,001 headings opened without an
  application size/count limit.
- Desktop, 320 px portrait, and 844 × 390 landscape: focus mode, Escape,
  zoom, outline navigation, selectable text, independently scrolling wide
  blocks, and replacing/closing documents. The visible-character drift after
  desktop-to-mobile resize was under one CSS pixel in all three engines.

## Deliberate limits

This is a document reader. Scripts, form controls, embedded frames, media,
SVG/MathML, and app-dependent content are omitted. External resources and
separate sibling resource folders are not imported. Safe embedded raster
images, font data, and CSS are retained; unsupported resource values are
removed while other declarations survive. Complex site layouts can differ
from the original. XHTML must be well formed. There is no source editor,
URL-fetching workflow, website session restoration, or document export.

Fixture provenance and regeneration details are in `fixtures/README.md`.
Additional temporary stress and encoding files are generated during browser
checks rather than committed.

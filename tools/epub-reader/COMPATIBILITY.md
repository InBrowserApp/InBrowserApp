# EPUB Reader compatibility

The reader targets unencrypted, reflowable EPUB 2 and EPUB 3 publications.
Accepting `.epub` does not imply support for every EPUB feature.

## Reading behavior

- Package reading order drives previous/next navigation. Nonlinear sections
  remain accessible through contents and internal links.
- Nested contents, chapter anchors, footnotes, headings, lists, tables, local
  illustrations, and selectable text are preserved where present.
- Text size scales publisher fonts, including absolute pixel/point sizes.
  Size and width changes preserve the visible text position when available.
- Title/author/cover metadata is optional. Missing or damaged cover resources
  do not prevent reading available chapters; a missing title uses the filename.
- Only the active chapter's reading resources are retained. Closing or
  replacing the book releases its document resources; the ZIP library may
  retain its reusable worker-script URL, which contains no book data.
- There is no fixed input-size or chapter-count cap. Allocation failures
  receive resource feedback; actual limits depend on the browser and device.

## Limitations

- Fixed-layout and mixed fixed/reflowable publications are rejected with a
  specific explanation. Vertical writing and unusual publisher styles have
  not been established as reliably compatible.
- Password-protected archives and unsupported content encryption are rejected.
  Standard EPUB font-obfuscation declarations are allowed; available fonts may
  still be substituted by the browser.
- Missing chapters remain visible as failures instead of silently shortening
  the book. Other missing manifest resources trigger an incomplete-content
  notice. Optional remote content is not retrieved.
- Audio, video, forms, scripts, embedded browsing contexts, and SVG animations
  are removed. This is a text-and-illustration reader, without media overlays,
  editing, export, synchronization, or persisted reading history.

## Content isolation

Chapter HTML passes through DOMPurify and receives a first-head CSP that
forbids scripts, network resources, forms, and base URLs. Only local blob/data
images, fonts, and styles are permitted. Links become inert reader commands;
native navigation attributes and input-supplied commands are removed. Ordinary
web links open only after deliberate activation, with opener isolation.

WebKit requires script permission on the frame for parent-owned event
listeners. The `allow-same-origin allow-scripts` sandbox combination is **not**
the isolation boundary: sanitization, script-forbidding CSP, and removal of
native navigation must remain mandatory. Never put raw book HTML in the frame.
Middle-click and native link context-menu navigation are consequently absent.

## Acceptance coverage

Owned EPUB fixtures cover reflowable EPUB 2/3, nested contents and nonlinear
footnotes, Unicode anchors, text selection, local images/tables, RTL paragraphs,
metadata fallbacks, corrupt covers, missing chapters/manifest items, empty
spines, malformed ZIPs, protected content, and fixed/mixed layouts. A 1,001
chapter fixture checks navigation beyond common arbitrary count limits.

Review regressions cover long-paragraph position retention, publisher fonts,
mobile contents behavior, script/event payloads, inert HTML/SVG/MathML links,
forged reader commands, SVG animation, and remote CSS/image references. Browser
checks use Chromium, Firefox, and WebKit; screenshots include desktop, narrow
mobile, contents, and focus-reading layouts.

References: [EPUB 3.3](https://www.w3.org/TR/epub-33/),
[Readium font scaling](https://readium.org/css/docs/CSS28-migration_guide.html),
[WebKit parent-listener behavior](https://bugs.webkit.org/show_bug.cgi?id=218086),
and the [HTML sandbox model](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox).

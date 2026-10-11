# Email content export compatibility

The tool reads EML, EMLX and MSG locally through the shared email parser and an
owned worker. It offers standalone UTF-8 HTML and TXT downloads, an HTML preview,
and a read-only text view with copying. No external dependency is added.

## Included information

Saved subject, sender, To/Cc/Bcc recipients and date remain literal text. The
saved timezone is retained; missing/malformed dates and Outlook UTC fallbacks
are disclosed. Attachment names, MIME types, available sizes and roles precede
the body. Attached files and attached emails are not embedded in either export.

HTML uses the readable HTML body when available, otherwise literal saved text.
TXT prefers the saved plain-text alternative and preserves its whitespace;
otherwise it extracts paragraphs, line breaks, lists, quoted replies, table cells,
image alternative text and safe link destinations from the sanitized HTML body.
TXT contains no image bytes. It is a reading copy, not a MIME round-trip format.

## Layout and isolation

HTML has selectable text, a simple reading theme and supported local raster
images. CID references must resolve unambiguously to actual embedded bytes.
Every retained image must decode before either export becomes available. Remote
images are omitted and disclosed; there are no automatic remote requests. Safe
HTTP(S), mail and internal links remain usable when selected. DOM-clobbering IDs
may be removed by the sanitizer. Original sender styles, active content, forms,
embedded apps, SVG and MathML are omitted. The standalone file contains a CSP;
the preview uses managed links in a sandboxed frame.

Incomplete messages, detached EMLX resources, protected messages, calendar/contact
MSG items, compressed-RTF-only bodies, missing/ambiguous images and image decoding
failures stop export. MIME recovery is tolerant rather than an exhaustive damage
check. Sender identity, delivery and digital signatures are not verified.
Cancellation, replacement and close abort owned work and withdraw old results.
There is no fixed file-size, attachment-count or page-count quota.

## Verification sources

Original fictional fixtures are reused from
[`../email-viewer/fixtures/README.md`](../email-viewer/fixtures/README.md), including
encoded headers, multipart alternatives, 24 quoted replies, a colored inline
chart, ordinary and nested attachments, legacy encodings, unsafe content and
constructed MAPI/CFB messages. Constructed fixtures are not described as actual
Outlook or Apple Mail exports.

Independent producer samples were checked locally, without redistribution:

- Apple Mail `plaintext.emlx` and `richtext.emlx` from
  [mikez/emlx](https://github.com/mikez/emlx/tree/19d16716bc15e9157a9accea11e08554c944031c/tests).
- Outlook `newOutlook Microsoft Outlook test.msg`, `Hello +CJK.msg`, `Subject.msg`
  and `msgInMsg.msg` from
  [MSGReader](https://github.com/HiraokaHyperTools/msgreader/tree/3a5a9359a0fca87d2ece0d3e44317c876bfdf327/test).

Chromium, Firefox and WebKit exported 14 samples each; every downloaded HTML was
reopened with network access blocked and every saved plain-text alternative was
compared against its TXT suffix. HTML-only links, paragraphs, quotes and tables
were also checked. Inline-chart dimensions and pixels were checked.
Chromium additionally exported a 51 MiB email and a 1,001-reply thread and checked
missing/corrupt resources, incomplete messages and invalid input. Protected,
calendar and RTF-only MSG inputs were rejected in all three engines.

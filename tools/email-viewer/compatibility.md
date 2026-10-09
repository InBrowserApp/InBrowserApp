# Email Viewer compatibility

The viewer parses files locally in a disposable Web Worker. It uses
[PostalMime 4.0.5](https://github.com/postalsys/postal-mime) for MIME email and
[MSGReader 1.28.0](https://github.com/HiraokaHyperTools/msgreader) for Outlook
Compound File Binary messages. EMLX removes the byte-counted wrapper before MIME
parsing. The worker is terminated on completion, replacement, close, or failure.

## Supported reading paths

| Format | Verified behavior                                                                                                                                                                                      | Boundaries                                                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EML    | Encoded subjects and address groups; UTF-8 and ISO-8859-1 text; quoted-printable/base64; HTML/plain alternatives; MIME attachments and nested attached email; raster CID images; long quoted threads   | MIME recovery is tolerant. Missing multipart terminators produce a partial-message notice; this is not exhaustive validation of every damaged MIME tree.                               |
| EMLX   | Decimal byte-count extraction, LF/CRLF, UTF-8 content, trailing plist exclusion, genuine Apple Mail plain/HTML samples                                                                                 | Apple metadata is ignored. Detached `X-Apple-Content-Length` parts cannot be recovered without other local files; the message is marked partial.                                       |
| MSG    | Binary property streams, Unicode/CJK text, Windows-1251 ANSI subjects, HTML body code pages, sender/To/Cc/Bcc, original transport dates and UTC timestamp fallback, ordinary/nested/inline attachments | Compressed RTF is not decoded. Readable plain text is retained; a rich-text-only body gets an explicit notice. Calendar/contact items are rejected. Complex Outlook layout may differ. |

An attachment with a content ID is distinguished as an inline image only when
its MIME disposition/related context or a body reference supports that role.
Ordinary attachments and attached emails are listed but never opened. MSG
attachment sizes are taken from available properties; embedded-message storage
may have no independent byte size, which is explicitly shown as unavailable.

Dates use saved transport-header text, preserving the supplied offset and any
zone text. No automatic local-time conversion is performed. If MSG has only a
MAPI timestamp, the stored UTC value is shown with a notice. Missing/malformed
dates are not guessed.

Encrypted/protected messages cannot be decrypted. Signed-only messages remain
readable when they contain a readable body. Opaque MIME `signed-data` is listed
as an attachment with a signature notice and no readable-body claim. Neither
sender identity nor signatures are verified.

## HTML isolation

DOMPurify removes active elements, event handlers, URL-bearing navigation
attributes, forms, frames, SVG and MathML. Only included raster content-ID images
and raster data images may become image sources. Unowned blob URLs and external
or relative image URLs are removed. Resource-bearing CSS is stripped before
frame parsing, including escaped tokens and image-set sources. A resource-bearing
style block or attribute is removed in full; comments and escapes also trigger
this conservative fallback. The compatibility notice covers that loss of
formatting. A first-in-head CSP disables scripts, remote resources, fonts, form
actions and base URLs; inline styling remains available.
The frame cannot navigate through saved links or refresh metadata. Its
`allow-same-origin allow-scripts` sandbox permits the parent-owned Escape handler
in WebKit, while the inserted CSP prohibits email scripts from running.

This produces a safe reading view, not an exact mail-client rendering. Omitted
content is disclosed under a visible compatibility summary. Wide content stays
inside the message frame. Plain text is inserted as literal text into the same
isolated reader, wraps, and preserves quoted replies. Both alternatives retain
the visible passage when the text size changes.

## Representative fixtures

Committed fixtures are original content, with provenance in
[`fixtures/README.md`](./fixtures/README.md). Binary MSG fixtures are constructed
MAPI/CFB files, not renamed MIME messages. Python's independent MIME serializer
produced the multipart EML fixture; its EMLX wrapper counts encoded bytes.

The following genuine producer files were checked locally and are not
redistributed:

- [mikez/emlx test fixtures](https://github.com/mikez/emlx/tree/master/tests):
  `plaintext.emlx` and `richtext.emlx`, containing Apple Mail-style byte prefixes,
  folded mail headers and trailing plist metadata. Checked at commit `19d16716bc15e9157a9accea11e08554c944031c`.
  Both retained their saved
  `+0200` dates and readable reply text.
- [MSGReader Outlook fixtures](https://github.com/HiraokaHyperTools/msgreader/tree/master/test):
  checked at commit `3a5a9359a0fca87d2ece0d3e44317c876bfdf327`.
  `newOutlook Microsoft Outlook test.msg` retained its Japanese HTML body;
  `Hello +CJK.msg` retained Chinese, Japanese and Korean plain text.
  `Subject.msg` exposed separate To/Cc/Bcc recipients; `msgInMsg.msg` identified an
  attached Outlook email without expanding it. `attachAndInline.msg` demonstrates
  the compressed-RTF limitation while still exposing attachment information.

## Validation

Parser, adapter, HTML-isolation, worker-lifecycle, and React tests cover ordinary
reading, replacement/cancellation, Unicode and legacy encodings, signed versus
protected messages, missing dates, empty/damaged files, real resource errors,
attachment roles, alternatives, and preview URL cleanup. No fixed file-size or
attachment-count rejection is introduced. Attachment rows use browser content
visibility to avoid laying out every off-screen row.

Browser checks use production output in Chromium, Firefox and WebKit, including
local image decoding, frame CSP, blocked remote resource requests and navigation,
focus-mode Escape, responsive layout and RTL. Screenshots and the reproducible
acceptance runner are retained as local review artifacts rather than committed
build output.

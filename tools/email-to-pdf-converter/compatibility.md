# Email to PDF compatibility

The tool reads EML, EMLX and MSG locally through the shared email parser and a
short-lived worker. It builds a canonical reading copy, paginates it with the
shared HTML renderer, and previews the exact PDF offered for download.

## Included information

Saved subject, sender, To/Cc/Bcc recipients and date are retained as literal text.
The saved timezone is not changed. A missing date is labelled; an Outlook UTC
fallback is disclosed. HTML is preferred when readable, otherwise saved plain
text is used. An email without a readable body says so explicitly. Signed-only
mail is readable when its body is available; signatures, identity and delivery
are not verified.

Attachment names, MIME types, available sizes and inline/ordinary/attached-email
roles are listed before the body. This is a list, not a PDF attachment container;
attached files and nested messages are not opened or embedded. Raster CID images
used by the body are embedded from their actual local bytes. Ambiguous IDs,
missing embedded images and decoding failures stop conversion.

## Layout and isolation

A4 portrait pages have 18 mm margins and are rasterized at 150 DPI. Text is not
selectable; no OCR or clickable links are added. Browser fonts and pagination may
differ. Source styles and presentation attributes are removed so sender content
cannot hide the saved headers or conversion notes. Tables and preformatted text
reflow; wide/unrenderable content fails rather than silently clipping.

Remote images are omitted, with a note in the PDF and expandable conversion
notes. No remote content is requested. The existing HTML sanitizer removes active
content, forms, embedded apps, SVG and MathML. Only self-contained raster data
reaches the isolated print frame. A corrupt image prevents download. Cancellation,
replacement and close terminate owned work and withdraw old output.

Incomplete MIME/EMLX messages, detached Apple Mail resources, protected messages,
calendar/contact MSG items, and MSG bodies available only as compressed RTF are
rejected. MIME recovery remains tolerant rather than an exhaustive damage check.
There is no fixed file-size, attachment-count or page-count quota.

## Verification sources

Original fictional fixtures are reused from
[`../email-viewer/fixtures/README.md`](../email-viewer/fixtures/README.md), including
multipart alternatives, 24 quoted replies, a colored inline chart, an ordinary
CSV attachment, a nested email, legacy encodings, unsafe content and constructed
MAPI/CFB messages. These are not presented as actual Outlook or Apple Mail exports.

Independent producer samples were checked locally, without redistribution:

- Apple Mail `plaintext.emlx` and `richtext.emlx` from
  [mikez/emlx](https://github.com/mikez/emlx/tree/19d16716bc15e9157a9accea11e08554c944031c/tests).
- Outlook `newOutlook Microsoft Outlook test.msg`, `Hello +CJK.msg`, `Subject.msg`
  and `msgInMsg.msg` from
  [MSGReader](https://github.com/HiraokaHyperTools/msgreader/tree/3a5a9359a0fca87d2ece0d3e44317c876bfdf327/test).

Chromium, Firefox and WebKit produced PDFs for both original and independent
samples. MuPDF checked actual A4/image-page output; OCR checked headers, saved
zone, attachment exclusions and the last quoted reply. Embedded-chart pixel
colors were checked in the PDF page images. Additional local checks cover a
51 MiB email, a 1,001-reply thread, corrupt/missing images, incomplete messages,
resource cleanup, mobile/RTL UI and the existing viewer.

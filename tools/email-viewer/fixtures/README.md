# Saved-email fixtures

These files contain original, fictional test content written for InBrowser.App.
Addresses use reserved example domains. No mailbox export or third-party email
is redistributed here.

- `field-notes.eml`: serialized by Python 3's standard `email.message.EmailMessage`
  using `policy.SMTP`, with encoded international headers, plain/HTML alternatives,
  24 quoted replies, an inline PNG, a CSV attachment, and an attached RFC 822 email.
- `field-notes.emlx`: the exact EML bytes wrapped with their decimal byte length,
  a newline, and an original XML plist. This is a constructed EMLX fixture, not an
  Apple Mail export.
- `unsafe-content.eml`: original adversarial HTML containing scripts, refresh
  metadata, navigation, remote images/styles and CSS resources for browser checks.
- `latin1.eml`: original quoted-printable ISO-8859-1 content and encoded headers,
  with an intentionally malformed date.
- `inline-chart.png`: original 240 × 96 RGB bar-chart pixels encoded using PNG
  IHDR/IDAT/IEND chunks, standard zlib compression, and CRC-32 checksums.
- `outlook-*.msg`: original binary Compound File Binary containers generated with
  the CFB writer included in SheetJS CE 0.20.3. They have MSG property streams,
  a root property table, recipient storage and, where applicable, attachment
  storage. These are constructed MSG fixtures, not Outlook exports. Variants
  exercise HTML/plain text, Windows-1251 ANSI subject properties, signed-only and
  protected message classes, calendar rejection, and a rich-text-only body.
  The rich-text-only fixture carries a deliberately uninterpreted compressed-RTF
  property because this viewer does not decode that property.

Separate browser compatibility checks use genuine published producer samples
from the upstream MSG reader and Apple Mail parser repositories; those files are
kept outside this repository. See `../compatibility.md` for provenance and results.

# HWP / HWPX compatibility

This viewer offers a limited visual preview of HWP 5 binary documents and HWPX
packages. It does not claim official-form fidelity, editing, signature validation,
or document authenticity. Korean and mixed-language text, ordinary forms, embedded
raster images, and sanitized embedded SVG charts are displayed where the engine
can render them. Text selection and search are deliberately unavailable: the
positioned glyph output is not a reliable copyable reading-order text layer.

## Sources and boundaries

- [Hancom HWP 5 format, revision 1.3](https://cdn.hancom.com/link/docs/한글문서파일형식_5.0_revision1.3.pdf),
  section 3.2.1 / table 3: FileHeader bits 1, 4, 8, and 10 identify opening
  encryption, DRM, certificate encryption, and certificate DRM. They receive the
  protected-file message. Bit 2 receives a distribution-only message. Signature
  presence alone (bits 7/9) is not treated as encryption.
- [Hancom developer explanation of HWPX encryption](https://forum.developer.hancom.com/t/hwpx/2307):
  HWPX uses encrypted-entry information in `META-INF/manifest.xml`. The viewer
  detects ODF `encryption-data` by its namespace, including alternate prefixes,
  before attempting to render encrypted XML. Encrypted HWPX is reported as
  protected; its manifest alone does not reliably distinguish the protection's
  intended use. A genuine certificate-managed HWPX sample was not available.
- [`@rhwp/core` 0.8.7 documentation](https://github.com/edwardkim/rhwp/tree/main/npm):
  low-level Rust/WASM parsing and page SVG rendering. Its supported feature list
  is not a blanket guarantee for every file. HWP 3 and earlier variants are
  intentionally outside this viewer's tested scope, even where the engine itself
  has experimental support.

The viewer uses locally available system fonts. It does not fetch remote fonts,
linked images, document references, or document scripts. Missing Hangul fonts can
change glyph appearance, wrapping, spacing, and pagination. Complex nested tables,
equations, headers/footers, text boxes, charts, and embedded objects need individual
checking in Hangul. Embedded OLE content is only its available visual appearance;
no spreadsheet or other embedded program is executed.

A document with edit-password or protected-cell settings can remain readable in
this read-only viewer when opening does not require a password. It is never
converted into an editable form. Password entry/decryption, DRM integration, and
distribution-only decoding are not offered.

## Representative documents

Third-party samples were downloaded only for local testing from the
[upstream corpus at commit `1a76570e833917d15817415a53c09ad61ab3203f`](https://github.com/edwardkim/rhwp/tree/1a76570e833917d15817415a53c09ad61ab3203f/samples).
They are not committed or redistributed. Page counts below are observed renderer
counts, not a certification that they match native Hangul pagination.

| Corpus-relative file                                               | Observed preview                                                                                                                             |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `samples/basic/request.hwp`                                        | 1-page Korean form, table layout and embedded illustration                                                                                   |
| `samples/test-image.hwp` / `samples/test-image.hwpx`               | 5 pages each, tested separately through every page                                                                                           |
| `samples/복학원서.hwpx`                                            | 1-page Korean/English university form; table, logo and watermark retain a readable arrangement; font spacing differs from the stored preview |
| `samples/156636617_240617 2024년 5월 월간 수출입 현황(확정치).hwp` | 19-page illustrated statistical report; first and last pages inspected, Korean headings, table values, logos and embedded vector charts      |
| `samples/footnote-01.hwp`                                          | 6 rendered pages; first-page notes and footer visible; last page contains only the footer, so native pagination is not certified             |
| `samples/equation-lim.hwp`                                         | Limit/fraction expression renders in its 1-page preview                                                                                      |
| `samples/group-box.hwp`                                            | 1-page grouped text-box appearance renders                                                                                                   |
| `samples/basic/issue2007_nested_cell_pagination_42065.hwp`         | 17 rendered pages, nested table content visible; exact split behavior is not certified                                                       |
| `samples/한셀OLE.hwpx`                                             | 1-page embedded spreadsheet appearance is displayed as an image                                                                              |
| `samples/셀보호.hwpx`                                              | Protected cells are visible and remain read-only                                                                                             |
| `tests/fixtures/form-password/edit-password.hwpx`                  | Edit-password document is readable without offering editing                                                                                  |
| `samples/HWP5-password-123456.hwpx`                                | Explicit protected-file explanation                                                                                                          |
| `samples/hwp3-sample16-hwp5-2024-password-123456.hwp`              | Explicit protected-file explanation                                                                                                          |
| `samples/hwp3-sample.hwp`                                          | Explicit older-version explanation                                                                                                           |
| `samples/task1768/distribution_doc.hwpx`                           | Its bytes are actually binary HWP; correctly identified and reported as distribution-only despite the extension                              |

Owned fixtures in `fixtures/` independently cover HWP and HWPX containers,
Korean/Latin text, table values, and an embedded PNG. A derived HWPX exercises
1,001 explicit pages, including the last page. A separate valid document containing
an unused stored ZIP entry exceeds 51 MiB and still opens. Certificate-DRM flag
coverage uses a controlled header mutation, not a claim of testing proprietary
rights-management infrastructure.

## Rendering and resource checks

Parsing and SVG generation run in a per-document worker, using OffscreenCanvas
text measurement registered before WASM initialization. Closing, replacing, or
abandoning an opening document terminates the worker and rejects pending requests.
Only requested pages are rendered. Page object URLs are revoked on navigation and
closure; document contents are not written to persistent storage.

SVG pages are displayed as isolated image resources. SVG charts nested in a page
are sanitized at every level using an iterative work queue, then serialized from
children to parents. Scripts, foreign objects, CSS imports, active links, animation,
and external references are removed; local fragments and embedded raster images
remain available. Corrupt embedded vector images are omitted and automatically
open the existing compatibility guidance. This avoids both active content and a
silent blank chart. There is no imposed recursion-depth or image-count quota.

There is no product file-size or page-count limit. Actual engine/parser allocation,
integer, decompression, and browser resource boundaries still apply; exhaustion
receives a resource message. A browser without worker OffscreenCanvas rendering
receives a capability explanation instead of blocking the main thread.

Browser acceptance covers Chromium, Firefox, and WebKit: real HWP and HWPX input,
page entry/zoom/fit/rotation, 320px focused reading, short landscape, Escape focus
restoration, long documents, replacement during opening, and closure. Requests to
external document resources, uncaught page errors, retained page URLs, and retained
workers are checked separately from whether an image element merely loaded.

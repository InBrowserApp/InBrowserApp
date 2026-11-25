# DOC and compatible WPS reading evidence

The reader targets Word 97–2003 binary documents in CFB version 3, including
compatible WPS Writer documents/templates. It also accepts the engine's
HTML-in-WordDocument OLE variant. It does not infer compatibility from an
extension alone. Older proprietary WPS, Microsoft Works, raw HTML/RTF, OOXML,
and CFB version 4 are not supported by this tool.

## Reading behavior and limits

- Continuous selectable text, recognized headings, tables, supported embedded
  raster images, outline navigation, zoom and reading position. Explicit page
  breaks appear as separators; there is no invented original page count.
- Paragraph outline levels become accessible headings. Available list membership
  is grouped for reading; conventional `List Number` styles receive simple
  numbering and other list styles receive bullets. Original numbering definitions,
  restarts and multilevel numbering are not reproduced. Such lists mark the
  preview as partial.
- Font substitution, columns and floating object layout can differ. Recovered
  text boxes follow the main story. Header/footer, footnote, endnote and comment
  stories are not rendered; story metadata triggers partial-preview feedback.
- Tracked changes use the final view: insertions remain, deletions disappear.
  Templates show saved content. No file is changed.
- Embedded applications/attachments, macros and document scripts never execute.
  External navigation and resource loads are blocked. Internal references work
  only when the destination is present in the preview; the parser does not
  recover every Word bookmark, so missing targets produce feedback.
- Unsupported vector drawings and remote/missing pictures use a local placeholder
  or a partial-preview notice. The preview is not a print-fidelity promise.

## Provenance and representative documents

Third-party documents below are used locally for compatibility checking and are
not committed. They are genuine native documents, not renamed DOC files.

| Document                                                    | Source                                                                                                                                                                                                       | Observed content                                                                                                                                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fixtures/reading.doc`                                      | Original source created with python-docx and saved by LibreOffice 25.2.3.2                                                                                                                                   | 18 headings, both list styles, a table, an embedded three-color PNG, an explicit page break, English/Chinese/Russian/Arabic/Hebrew and tracked insertion/deletion. Header/footer omission is reported. |
| `fixtures/river-survey.doc`                                 | Original Markdown → Pandoc DOCX → LibreOffice DOC                                                                                                                                                            | Main text, table, multilingual text and twenty observations remain readable; footnote body and bookmark target recovery are limited and disclosed.                                                     |
| `annual-inspection.wps`                                     | [Longgang government attachment notice](https://www.lg.gov.cn/xxgk/zwgk/tzgg/content/post_12613085.html), attachment 1; [original WPS download](http://www.lg.gov.cn/attachment/1/1674/1674907/12613085.wps) | Native WPS file with WordDocument and WpsCustomData streams; 23,552 bytes, 65 paragraphs, Chinese body reaches its final article.                                                                      |
| `Standard Business Letter.wpt`                              | [Official WPS Linux 12.1.2.28080 package](https://linux.wps.cn), `office6/mui/en_US/templates/wps/Letters and Faxes/`                                                                                        | Native WPT, 35,840 bytes, FIB version 0xBF; saved field text and text boxes are readable, text boxes are linearized after the main story.                                                              |
| `summary.wpt`                                               | Same official package, `office6/mui/zh_CN/templates/wps/GB9704_electronic_document_templates/`                                                                                                               | Native WPT, 28,160 bytes, FIB version 0xC1; Chinese template text/table remain readable, page composition differs.                                                                                     |
| WPS-saved table and contract DOC, embedded/linked-image DOC | [Public DOC engine fixtures](https://github.com/flyfish-dev/file-viewer/tree/5ebaaa3803eecc584178644feb1be3450d46cefd/packages/renderers/doc/test/fixtures)                                                  | Genuine WPS table/contract structure and embedded image rendering; linked resources remain blocked.                                                                                                    |

WPS SHA-256: `0d4e72e3a4792ba6013d396a57bf664f16e90a9da4b55bc6dd0918645bfdb994`.
English WPT SHA-256: `f13a68eefeef56be058cd24b77eb482b5d8635f0bb213d5ede6639408313883f`.
Chinese WPT SHA-256: `2654416ffa94838f231a16eb0ca00141cbe62d3141b8579a15288f83928b49d4`.

Additional original stress cases contain 1,101 real DOC headings and a DOC larger
than 50 MiB with an unused stream. Synthetic cases cover malformed FIB metadata,
password encryption/XOR flags, encrypted OOXML containers, unrelated formats,
HTML-in-OLE, hostile preview markup, cancellation and replacement races.

## Parser and isolation decisions

Uses the public `@file-viewer/doc` 3.1.2 parse/render API and `cfb` 1.2.2 metadata
inspection, in a disposable Worker. `maxPictureBytes` is tied to the actual input
size. A narrow package patch changes the fixed CFB chain-count cutoff to the
actual FAT/miniFAT length; allocation bounds and cycle detection remain. No
arbitrary file-size, paragraph or page limits are added.

The generated markup is separately sanitized by DOMPurify before insertion into
an iframe. A first-head CSP blocks scripts and all non-data resources. Native
navigation attributes and active elements are removed; internal links use inert
parent-handled destinations. Source IDs are isolated from DOM named properties.
Workers are terminated after parsing and on close/replacement.

Primary references checked:

- [Microsoft Word binary format](https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-doc/ccd7b486-7881-484c-a137-51170af7cc22)
- [FibBase flags](https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-doc/26fb6c06-4e5c-4778-ab4e-edbf26a545bb): fObfuscated is ignored unless fEncrypted is set.
- [Encryption and obfuscation](https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-doc/37639397-6451-427b-9cf2-01d56e927f25)
- [Public DOC parser](https://github.com/flyfish-dev/file-viewer/tree/5ebaaa3803eecc584178644feb1be3450d46cefd/packages/renderers/doc)
- [CFB public API](https://github.com/SheetJS/js-cfb/blob/master/README.md)

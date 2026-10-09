# OFD reading checks

The viewer draws local OFD pages. It does not establish authenticity, verify
signatures, render SES/ASN.1 seal payloads, or provide an accurate text-selection
layer. Packages with multiple DocBody entries show their first document and a
visible explanation. Image-only pages have no search control.

## Files inspected

Browser checks use Chromium, Firefox, and WebKit. Passing a page-render check is
not a claim of pixel-for-pixel equivalence with every desktop OFD reader.

| Sample                                                                                            | Observed behavior                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owned `fixtures/reading.ofd`                                                                      | Three pages: invoice text/table/amounts with Chinese characters and an ordinary PNG stamp, a landscape report, and a PNG scan. Pages preserve their individual dimensions. The PNG stamp is a drawing, not a digital signature.             |
| Owned JPEG scan variant                                                                           | A valid locally embedded JPEG scan renders.                                                                                                                                                                                                 |
| Owned embedded-font and damaged-font variants                                                     | A supported embedded font loads locally; an invalid font produces a substitution notice.                                                                                                                                                    |
| Owned missing-page, missing-image, external-resource, empty, invalid, and multi-document variants | Missing pages retain navigation; omissions and multi-document packages are explained; damaged/empty files produce recoverable errors. HTTP and HTTPS document references do not cause external requests.                                    |
| OFDRW `发票示例.ofd`                                                                              | The invoice's text and table are drawn; its digital-signature marker produces the missing-seal / unverified-signature notice.                                                                                                               |
| OFDRW `Page5.ofd`                                                                                 | All five pages navigate and draw; unsupported features produce a compatibility notice.                                                                                                                                                      |
| OFDRW `发票监制章-数科.ofd`                                                                       | The page is drawn, but its CompositeObject/CompositeGraphicUnit content is unsupported and a partial-preview notice is shown. This does not count as successful rendering of its seal.                                                      |
| OFDRW `containsJPEG.ofd`                                                                          | Both pages remain navigable, with a missing-image notice. The XML references `Doc_0/Res`, while the ZIP entries use `DOC_0/Res`; these resources are not silently treated as present. This sample does not establish JPEG decoding support. |

The owned fixture contains invented content and has no payment or tax validity.
Its ordinary stamp and scan are original generated images. Public OFDRW files
were inspected locally and are not redistributed in this repository.

Sources for independent public samples:

- <https://github.com/ofdrw/ofdrw/tree/master/ofdrw-converter/src/test/resources>
- <https://github.com/ofdrw/ofdrw/tree/master/ofdrw-layout/src/test/resources>

## Boundaries checked

- Opening is canceled and previous fonts, bitmaps, canvases, and document state
  are released when a file is replaced or closed.
- File size and ZIP entry count are not restricted by the engine's default
  64 MiB / 10,000-entry settings. There is no page-count cap. The renderer's
  canvas allocation budget remains active, with a reduce-zoom explanation.
- Embedded fonts and images are read from the archive. No URL-opening API is
  offered, and document actions are not executed.
- Diagnostic categories are localized. Known signature, multi-document, and
  image omissions open the compatibility disclosure automatically.
- Page overview uses a sidebar on desktop and replaces the reading pane on
  narrow screens. Selecting a page there returns focus to the reading pane;
  Escape closes the overview and returns focus to its button.
- Browser checks include mixed page orientation, zoom/fit/rotation, file
  replacement, focus reading, 320/390 px layouts, and Arabic/Hebrew controls.

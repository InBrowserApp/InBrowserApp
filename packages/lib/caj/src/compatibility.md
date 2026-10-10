# CAJ family compatibility

The converter and viewer detect internal bytes using `caj2pdf-rust` 0.6.1 with the
[documented JPEG placement correction](vendor/README.md) and renders the
prepared pages with the same local PDF.js reader as the PDF viewer. The
prepared PDF remains in memory until closed and can be downloaded from either
tool after the preview opens successfully. Downloaded output retains the
conversion's page content; view-only zoom and rotation do not modify it.

## Supported behavior and boundaries

- CAJ containing PDF page objects: preserve readable page content, available
  native text, and supported contents entries.
- KDH containing PDF: display the embedded document and available native text.
- HN-A (including NH extensions) and C8 image pages: experimental complete-page
  conversion; no OCR. Geometry, diagrams, and equations require comparison
  with the source when exact fidelity matters.
- Native HN-B/C8 text requiring separate font resources is unsupported here.
  No fonts or document resources are retrieved from remote locations.
- Unsupported TEB, CAA reference descriptors, encrypted PDF payloads,
  incomplete output, and malformed files receive explicit errors.
- Damaged pages are never deliberately replaced by blank pages. Any reported
  omitted pages or a mismatch with the inspected page count rejects opening.
- Missing or adjusted outlines and substituted glyphs remain visible as
  reading notes. Searchable text and visual fidelity are separate capabilities.

There are no product file-size/page quotas. The conversion engine receives its
maximum representable input/output/page/bookmark limits, while its maximum
single allocation of 256 MiB remains enforced. PDF canvas rendering retains
its actual canvas pixel/dimension safeguards. Browser memory can still be
exhausted by demanding documents.

## Verification corpus

Owned/synthetic fixtures live in `fixtures/`. Genuine files are local-only;
public availability does not establish redistribution permission.

| Source                                                                                                                                                                                                       | Identity                                                                   | Internal variant                 | Expected inspection             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------------------- | ------------------------------- |
| [CAJSamples issue-44](https://github.com/caj2pdf/CAJSamples/tree/7e1c35e7b6de34e21972fcd1752c2a7e99b4ad07/issue-44)                                                                                          | 5,455,734 bytes                                                            | CAJ LDPC thesis                  | 108 pages, 57 contents entries  |
| [CAJSamples issue-20](https://github.com/caj2pdf/CAJSamples/blob/7e1c35e7b6de34e21972fcd1752c2a7e99b4ad07/issue-20/%E6%96%87%E4%BB%B6%E5%90%8D%E6%9C%AA%E7%9F%A5.caj)                                        | 983,523 bytes                                                              | CAJ thesis                       | 63 pages, 93 contents entries   |
| [CAJSamples issue-48](https://github.com/caj2pdf/CAJSamples/blob/7e1c35e7b6de34e21972fcd1752c2a7e99b4ad07/issue-48/ZZXX200402047.caj)                                                                        | SHA-256 `5f6f1af5b148af2b6756ff8878124c09797882505d0aca12ca983d9073d94507` | KDH, hosted with a CAJ extension | 1 page                          |
| [Energy statistics yearbook](https://github.com/DodgeV/energy-blockchain/blob/888c8690c20e7ce9caf0292c658f8362bc768ce4/data/%E4%B8%AD%E5%9B%BD%E8%83%BD%E6%BA%90%E7%BB%9F%E8%AE%A1%E5%B9%B4%E9%89%B41989.nh) | SHA-256 `16b1a3b1cb7177cc3d327f749f7f273d806b153ded5fe11d9261bac030ec66ac` | HN-A, original NH extension      | 433 pages, 365 contents entries |

The published Node/WASM package converted these inputs without reported omitted
pages, substituted glyphs, or outline warnings. Structural counts alone do not
establish visual fidelity.

The original engine vertically reflected JPEG images in the NH yearbook.
The local patch corrects image placement while preserving source rectangles
and JPEG bytes. The corrected 433-page output retains all 365 contents entries
and passes `qpdf --check`. Its cover and sampled decoded scan pages are upright.
The asymmetric JPEG pixel regression covers grayscale and RGB HN-A/C8/HN-B
images, including nonzero origins; decoded bilevel placement is unchanged.
All 1,180 upstream core tests pass with the corresponding JPEG expectations
updated. Genuine image-only NH pages do not gain searchable text or OCR.

Chromium, Firefox and WebKit opened the 108-page LDPC thesis with selectable
text and a readable hardware diagram on page 50. Its intermediate PDF passes
`qpdf --check` without syntax or stream warnings. The genuine KDH sample also
renders with 1,554 extracted characters on its single page in all three.

The separate 63-page issue-20 sample is **not** a full-fidelity success:
`qpdf` and Poppler report malformed operators in page 39's content stream,
although the converter reports complete page counts. Other sampled pages,
including page 25's table, are readable. The viewer cannot prove that every
unreported malformed operator preserves all source content. This remains a
known conversion/fidelity limitation, not an advertised compatibility pass.

All three browser engines also pass the original CAJ/KDH controls, experimental
HN-A/C8 bilevel image controls, native-text rejection, a 1,001-page CAJ, and a
51 MiB CAJ source. Slow NH conversion can be cancelled by replacing or closing
the document. Active PDF actions and CAA descriptors do not execute or retrieve
remote content. Closing releases the owned conversion and PDF workers.

The original PDF viewer was checked in all three browsers after the shared
reader extraction. The mobile overview reveal regression has a focused unit
regression and production browser verification.

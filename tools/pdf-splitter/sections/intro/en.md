## What this tool does

PDF Splitter lets you open a PDF in your browser, choose pages by range or by
page number, and generate a smaller document. You can extract selected pages
into one PDF, split each typed range into a separate PDF, or split every
selected page into its own file and download the results as a ZIP archive.

## Good use cases

- Pulling a few pages from a long contract, report, manual, or scan before
  sharing it with someone else.
- Separating chapters, invoices, forms, or attachment sections into individual
  PDF files.
- Removing pages you do not need before sending a document to a print shop,
  support desk, or approval workflow.
- Creating repeatable splits with range syntax such as `1-3,5,8-10` instead of
  clicking every page manually.

## How page ranges work

Use comma-separated page numbers and inclusive ranges. `1-3,5,8-10` selects
pages 1, 2, 3, 5, 8, 9, and 10. A page can appear only once in the expression,
and descending ranges such as `7-4` are rejected so the output order stays
clear and predictable.

For a single output PDF, the selected pages are copied into one new document in
the order shown by the range expression. For multiple output PDFs, "one file per
range" keeps each typed segment together, while "one file per page" creates a
separate PDF for every selected page.

## Privacy notes

The PDF is processed locally in your browser and is not uploaded by this tool.
Generated download links are temporary object URLs that exist only in the
current tab. Review the resulting files before sharing them, because copied
pages can still contain embedded metadata, annotations, form values, or hidden
content from the original document.

## Limitations

Encrypted, password-protected, or damaged PDFs may not open in the browser-side
PDF library. This splitter copies pages into new PDFs, but it is not a visual
redaction tool and does not guarantee removal of all document metadata. For
legal redaction, accessibility repair, or advanced optimization, use a dedicated
PDF editor after splitting.

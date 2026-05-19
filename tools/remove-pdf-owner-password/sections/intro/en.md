Remove owner-password restrictions from a PDF directly in your browser. The tool creates a new PDF that no longer carries permission flags for editing, printing, copying, or page extraction.

## When to use it

Use it when you already have a PDF that opens normally, but the document blocks normal actions such as printing, copying text, editing pages, or assembling pages in another PDF tool. This is common with forms, exported reports, old invoices, and documents created with restrictive PDF permission settings.

## How it works

Upload one PDF, review the selected file, then run the removal step. The tool runs qpdf in a browser worker with the PDF `--decrypt` operation and returns a fresh PDF file for download. The original file is left unchanged, so you can compare or discard the output if it is not the version you need.

## Privacy and limitations

The PDF stays in this browser session; it is not uploaded to a server. This tool removes owner-password permission restrictions from PDFs that can already be opened. It does not recover a lost user/open password, and it cannot unlock damaged files or encryption modes unsupported by the browser-side qpdf build.

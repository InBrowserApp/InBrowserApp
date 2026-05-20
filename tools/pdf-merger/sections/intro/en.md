# Merge PDF files in your browser

Use this PDF merger when you need one document from several source PDFs, such as combining scanned pages, joining signed forms, or packaging reports for sharing. Add two or more files, review their page counts, then arrange the queue before creating the final PDF.

## How the merge order works

The tool appends every page from the first PDF, then every page from the next PDF, continuing down the queue. You can reorder files with the arrow controls, drag rows on desktop, remove mistakes, and preview each source file before merging.

## Privacy and file handling

All parsing and merging runs locally in your browser with `pdf-lib` and a background worker. Your files are not uploaded to InBrowser.App, and the generated download link only exists in the current browser session.

## Limits to know

Encrypted or damaged PDFs cannot be merged reliably. If a file is protected by an owner password, remove that restriction first and add the unlocked PDF again. Very large files may take longer because the browser has to copy every page into a new document.

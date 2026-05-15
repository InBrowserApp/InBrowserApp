## What this tool does

PDF Info Viewer opens a PDF in your browser and summarizes its basic file
details, PDF header version, page count, first page size, encryption status,
and document metadata such as title, author, subject, keywords, creator,
producer, and dates. It is meant for quick inspection before sharing,
archiving, debugging, or processing a document.

## Good use cases

- Checking whether a PDF has the expected page count and page size before
  sending it to a printer, client, or automated workflow.
- Inspecting title, author, producer, creation date, and modification date
  fields that may affect search, records management, or document audits.
- Detecting encrypted PDFs early, so you know why other tools may not be able
  to extract text, merge pages, or rewrite metadata without a password.
- Exporting a compact JSON summary for support tickets, asset inventories, or
  reproducible bug reports.

## Privacy notes

The PDF is read locally in your browser and is not uploaded by this tool.
Metadata can still expose author names, software, timestamps, internal titles,
or workflow details that were embedded when the document was created. Review
those fields before publishing a PDF externally or attaching it to a public
issue.

## Limitations

Some encrypted or damaged PDFs only expose the file name, size, and header
version. This viewer does not remove metadata, decrypt files, repair broken
documents, or validate visual layout. Use a dedicated PDF editor or sanitizer
when you need to change the document before sharing it.

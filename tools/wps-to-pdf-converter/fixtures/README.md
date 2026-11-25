# Original DOC conversion fixture

`report.docx` was created for this repository with python-docx. `report.doc` was
saved from it using LibreOffice 25.2.3.2's MS Word 97 export filter. It contains
original multilingual body text, a generated red/green/blue PNG, manual list
numbers, a hard page break, an 80-row table, and eight trailing paragraphs.
There are no headers, footers, notes, automatic numbering, or text boxes.

The document exercises content integrity and cross-page table flow. Its original
Office page count is not the expected output count: this converter explicitly
reflows content onto A4 portrait pages using browser fonts.

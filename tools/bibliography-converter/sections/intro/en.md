## When should I use BibTeX, RIS, or CSL JSON?

Choose the format your next application can import.

- **BibTeX (`.bib`)** is a common choice for a LaTeX project in Overleaf or a local editor.
- **RIS (`.ris`)** is useful for moving references from a database or another reference manager into Zotero or EndNote.
- **CSL JSON (`.json`)** contains structured reference data for citation processors and other tools that accept Citation Style Language data.

## How do I convert and check my references?

Paste the references or select **Open file**. Leave **Input format** on **Detect automatically**, or select the format yourself if detection fails. Choose the **Output format**, select **Convert and check**, then copy the result or download the file. Conversion runs in your browser.

For example, open an RIS export from Zotero, choose BibTeX, and download a `.bib` file for your Overleaf project. If all you have is a formatted bibliography copied from Word, first export the reference records from the reference manager that created it. To import the converted file into Zotero, follow [Zotero's import guide](https://www.zotero.org/support/kb/importing_standardized_formats).

## What does a possible duplicate mean?

The report groups entries with the same DOI, including versions written as a `doi.org` link. When a DOI is missing, it can also match entries by title, publication year, and the first author's surname and given-name initial. The entry numbers refer to the order in the input. Select **Load example** to see how two records for the same article appear in the report. Review each group before merging it in your reference manager. The download includes every entry.

## Which fields carry over?

Common fields such as title, authors, publication year, and DOI usually carry across formats. Custom fields may be omitted, and a newly generated BibTeX file may assign different citation keys to avoid conflicts. Keep the original export if you need those details. To check for duplicates while preserving the original fields, choose the same input and output format.

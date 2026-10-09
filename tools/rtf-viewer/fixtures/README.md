# Original RTF fixtures

All files in this directory are original test documents created for this repository and may be redistributed under its license. `reading.rtf` isolates formatting, Unicode surrogate pairs, escaped punctuation, an asymmetric PNG picture, simple table cells, and explicit page breaks. `color-target.png` is the original embedded image. `adversarial.rtf` contains inert remote fields, an object and unsupported layout destinations. `windows-1251.rtf` contains actual Windows-1251 bytes.

`river-survey.md` is the original source. Producers used here are LibreOffice
25.2.3.2 and Pandoc 3.1.11.1. `river-survey.rtf` was exported by LibreOffice from a Pandoc-generated DOCX. `river-survey-pandoc.rtf` is an independent direct Pandoc RTF export of the same source. Browser acceptance compares visible text, table/list structure, and end-of-document content. Their page breaks may differ.

Reproduce:

```sh
pandoc river-survey.md -o river-survey.docx
libreoffice --headless --convert-to rtf --outdir output river-survey.docx
pandoc -s river-survey.md -o river-survey-pandoc.rtf
```

Large acceptance inputs are generated locally rather than checked in: a 51 MiB ignorable destination followed by visible text, and 2,001 explicitly separated pages with distinct final-page text. They demonstrate removed size/page quotas without implying unlimited browser memory.

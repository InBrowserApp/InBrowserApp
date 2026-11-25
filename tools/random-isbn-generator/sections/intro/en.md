## Generate random ISBN-10 or ISBN-13 numbers

Choose `ISBN-13` for current book catalog and retail forms or `ISBN-10` for older records. Set a quantity from `1` to `1000`, choose whether to include hyphens, and select **Generate**. Copy the batch or download a TXT file with one ISBN per line.

## Read the format and check digit

An International Standard Book Number (ISBN) identifies a book edition and format. The generated `ISBN-13` values use the `978` prefix and end in a numeric check digit. An `ISBN-10` may end in `X`, which represents ten in its checksum calculation. Take `978-0-306-40615-7` and `0-8044-2957-X` as two examples. Hyphens make the groups easier to read and leave the check digit unchanged.

## Use the results in test data

Use these sample identifiers to test catalog forms, imports, and ISBN validation. To exercise a checksum error, change only the last character to a different digit and try your import again. In a spreadsheet or database, store ISBNs as text to preserve a leading zero or final `X`. For a published book, take its ISBN from the edition's cover or publisher record.

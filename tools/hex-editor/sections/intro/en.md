## View and edit a binary file online

Open or drop any local file into the Hex Editor, or choose **Try sample** to explore the byte layout. Use it to inspect a file header, check a magic number such as `89 50 4E 47` in a PNG, examine non-printable bytes, or patch a known value at a specific position.

## Read offsets, hexadecimal bytes, and ASCII

The offset at the left is the position of the first byte in that row, counted from zero. The center shows each byte as two hexadecimal digits, from `00` to `FF`. The ASCII column shows printable characters for the same bytes and uses a dot for other values. For example, the bytes `48 65 6C 6C 6F` appear as `Hello`.

Enter a hexadecimal offset such as `1A` or `0x1A` to jump directly to byte 26. Use the page controls to browse nearby bytes. The editor reads one page at a time, so you can inspect a small part of a large file.

## Overwrite bytes and save a copy

Select a hex byte and enter two digits. The editor updates the matching ASCII character and moves to the next byte. Use the arrow keys to move between bytes, and **Undo** or **Redo** to revisit changes. Overwriting keeps the file length and the positions of the other bytes the same.

Choose **Download copy** to save the result. The original file stays as it was, and all reading and editing takes place in your browser.

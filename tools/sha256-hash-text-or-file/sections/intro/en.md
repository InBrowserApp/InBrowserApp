## Calculate a SHA-256 checksum for text or a file

Paste UTF-8 text or choose **Import from file** to hash the file’s original bytes. Copy the hexadecimal result to compare against a published checksum. SHA-256 produces a 256-bit digest, shown as 64 hexadecimal characters.

To check a download, hash the downloaded file and compare the entire hexadecimal value with the one published by the source. For text, spaces, capitalization, and line breaks change the hash. As a quick test, the text `abc` with no final line break produces:

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

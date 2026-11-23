Open a 7z, RAR, ZIP, or TAR archive to browse its folders before extracting anything. Select a file to preview it or download it on its own.

## When to use it

Use it when you receive a compressed package and want a quick look without unpacking the whole archive. It is useful for checking release bundles, downloaded templates, log packages, source snapshots, or a single-file `.gz` attachment.

## Privacy and file handling

Archive contents are read locally in your browser session. The file is not uploaded to InBrowser.App. Large text entries are capped in the preview to keep the page responsive; download the entry when you need to inspect the complete file.

## Supported archive formats

The viewer opens ZIP, 7z, RAR4 and RAR5, TAR, CPIO, AR (including .deb packages), CAB, ISO 9660, and LHA. It also opens standalone files and TAR archives compressed with GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA, or UNIX compress (.Z). For example, open a .tar.zst release bundle to browse its folders, or a .zst log to download the decompressed file.

Use a desktop archive tool for encrypted files, split archives, solid RAR4 archives, or entries over 512 MiB in the newly supported formats. Large solid archives can take longer to open or extract because the decoder may need to process earlier entries.

## Preview behavior

Text-like files such as JSON, Markdown, logs, source code, CSV, XML, YAML, and TOML can be previewed with syntax highlighting when a matching language is available. Common image files can be previewed visually, and PDF documents open in the browser's built-in PDF viewer when available. Other binary files remain downloadable, but the tool will not try to render them.

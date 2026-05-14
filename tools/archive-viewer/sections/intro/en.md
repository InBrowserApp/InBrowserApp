An archive viewer lets you inspect a compressed file before extracting it. This tool opens ZIP, TAR, GZ, TGZ, and TAR.GZ files directly in the browser so you can confirm what is inside, browse folders, preview readable files, and download only the entry you need.

## When to use it

Use it when you receive a compressed package and want a quick look without unpacking the whole archive. It is useful for checking release bundles, downloaded templates, log packages, source snapshots, or a single-file `.gz` attachment.

## Privacy and file handling

Archive contents are read locally in your browser session. The file is not uploaded to InBrowser.App. Large text entries are capped in the preview to keep the page responsive; download the entry when you need to inspect the complete file.

## Supported archive formats

The viewer supports standard ZIP archives, uncompressed TAR files, GZIP-compressed single files, and TAR archives wrapped in GZIP (`.tgz` or `.tar.gz`). Password-protected or encrypted archives are not supported in this first rewrite pass.

## Preview behavior

Text-like files such as JSON, Markdown, logs, source code, CSV, XML, YAML, and TOML can be previewed with syntax highlighting when a matching language is available. Common image files can be previewed visually. Other binary files remain downloadable, but the tool will not try to render them.

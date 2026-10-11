# Email attachment extraction

EML and complete EMLX files use their decoded MIME attachment payloads. MSG files
use their embedded attachment streams. Normal attachments retain their exact
bytes, including zero-byte files. Original display names and safe, unique download
names are shown separately; paths, control characters and reserved device names
cannot become ZIP paths. Inline resources start unselected, but remain available
for individual download or inclusion in the ZIP.

Attached RFC 822 messages are saved as EML. An embedded Outlook message is a
compound-storage subtree, so its standalone MSG container is rebuilt rather than
copied byte-for-byte from the parent. The extracted MSG is reopened during
compatibility verification. No body, attachment, HTML file or executable is run
or previewed. ZIP exports use stored entries, retain original payload bytes and
support ZIP64 when needed.

An unreadable RTF-only body does not prevent attachment extraction. Incomplete
MIME, detached Apple Mail parts, protected messages, unsupported Outlook item
classes and unreadable or externally linked attachments are rejected. This does
not decrypt messages or verify senders, signatures or delivery. Browser resources
and format support determine availability; no file-size or attachment-count
quota is imposed.

## Regression fixtures

`fixtures/generate.py` uses Python's email serializer to construct an original
14-attachment collection and complete EMLX wrapper. `expected.json` records the
SHA-256 digest and size of each original payload. Samples cover duplicate and
case-colliding filenames, an explicit numeric-suffix collision, traversal names,
reserved Windows names, empty and unnamed attachments, Unicode and bidi labels,
inert HTML bytes, an inline PNG and a nested RFC 822 message. The image comes from
the repository's original Email Viewer fixtures.

The shared parser tests check EML/EMLX payload hashes and the original constructed
Outlook fixtures. Browser verification downloads attachments and selected ZIPs;
Python's independent `zipfile` reader checks names, CRCs and payload hashes.

## External compatibility samples

Additional local checks use Apple Mail EMLX examples from
[emlx](https://github.com/mikez/emlx), commit
`19d16716bc15e9157a9accea11e08554c944031c`, and Outlook examples from
[msgreader](https://github.com/HiraokaHyperTools/msgreader), commit
`3a5a9359a0fca87d2ece0d3e44317c876bfdf327`. These samples remain outside this
repository. The constructed EMLX fixture is not presented as an Apple Mail export.

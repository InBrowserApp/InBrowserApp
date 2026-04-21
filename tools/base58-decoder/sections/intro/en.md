## What this tool is for

Use this tool to decode Base58 strings or text files back into their original
bytes directly in your browser. It is useful when you need to inspect payloads
copied from APIs, wallets, logs, QR workflows, or import and export steps
without sending the data to a server.

## When to change the alphabet

Base58 is not one universal alphabet. Bitcoin, Flickr, and Ripple use different
character orders. If a value fails validation or decodes into the wrong result,
switch the alphabet and try again with the format used by the system that
produced it.

## What to watch for

The output panel shows a UTF-8 text preview when the decoded bytes can be read
as text. Binary data and non-text payloads are safer to review by downloading
the .bin file. Pasted whitespace is ignored, so wrapped values from emails,
docs, and terminals can still be decoded.

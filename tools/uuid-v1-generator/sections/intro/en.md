Generate UUID v1 identifiers locally in your browser when you need values that include creation time and a node identifier. This tool is useful for legacy integrations, database imports, ordered fixtures, and systems that still expect RFC 4122 version 1 UUIDs.

## When UUID v1 Helps

UUID v1 stores a timestamp, a clock sequence, and a 48-bit node value in a standard 36-character UUID string. That makes generated IDs roughly sortable by creation time while still fitting systems that accept ordinary UUID columns, URLs, logs, and API payloads.

## Privacy And Node Identifiers

Classic UUID v1 generation used a real network card MAC address, which can expose hardware information. This tool starts with a locally administered random MAC address instead. You can enter a specific node value when matching a legacy system, but avoid using real hardware addresses in public samples or shared data.

## Clock Sequence And Batch Generation

The clock sequence is a 14-bit value that helps avoid collisions when the same node generates IDs around the same time. Batch generation keeps all IDs in the same millisecond and increments the 100-nanosecond tick for each row, so every value in the result remains distinct.

# What is a UUID decoder?

A UUID decoder explains the structure inside a Universally Unique Identifier. It normalizes common pasted formats, checks that the value is a 128-bit UUID, and shows the version, variant, raw hexadecimal bytes, and copy-ready numeric representations.

UUIDs are often treated as opaque strings, but the version nibble tells you how the identifier was made. Version 4 UUIDs are random, versions 3 and 5 are name-based hashes, and time-ordered versions such as 1, 6, and 7 can carry timestamp information.

## When to use it

Use this tool when you need to inspect an identifier from logs, databases, APIs, traces, or test fixtures. It is useful for confirming whether a UUID is random or time-based, converting it to decimal or Base64 for another system, and spotting whether a UUID v1 or v6 node field may expose a MAC-style identifier.

The decoder runs in your browser and does not send UUID values to a server. It accepts canonical UUIDs, `urn:uuid:` values, braced UUIDs, uppercase input, and 32-character hexadecimal UUIDs without hyphens.

## What to watch for

UUID version and variant fields describe the bit layout, not whether the identifier is globally unique in practice. A valid-looking UUID can still be duplicated if it was generated poorly or copied by mistake.

For version 1 and version 6 UUIDs, the node field can look like a MAC address. Modern generators may set the multicast bit and use a random node instead, so treat it as a node identifier unless you control the generator.

UUID v1 and UUID v6 contain the same core information: a timestamp, a clock sequence, and a node identifier. UUID v1 stores the timestamp in the historical UUID field order, while UUID v6 reorders those timestamp bits so simple lexicographic sorting follows creation time more naturally.

Use this tool when you need to move identifiers between systems that expect different time-based UUID layouts. Paste a UUID v1 to get its UUID v6 equivalent, or paste a UUID v6 to recover the UUID v1 representation. The conversion is deterministic and keeps the clock sequence and node bytes unchanged.

## When to use it

- Migrating records from legacy UUID v1 storage to UUID v6 while preserving identity metadata.
- Debugging databases, logs, or queues that mix UUID v1 and UUID v6 values.
- Checking whether a UUID v6 value maps back to the UUID v1 value expected by an older integration.

## Input format

The converter accepts canonical UUID strings with hyphens, compact 32-character UUID strings, uppercase UUIDs, `urn:uuid:` values, and UUIDs wrapped in braces. Results are always normalized to lowercase canonical UUID form.

## Privacy and compatibility notes

UUID v1 and UUID v6 can encode creation time and node information. Treat them as operational identifiers, not secrets, and avoid exposing them when timestamp or node metadata could be sensitive. This tool runs locally in your browser and does not upload your UUIDs.

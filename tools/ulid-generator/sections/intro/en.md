Generate ULIDs locally in your browser for records, events, logs, fixtures, and distributed systems that need compact identifiers with time-sortable prefixes. Each value is created on this device and can be copied or downloaded without sending the batch to another service.

## Why Use ULID

ULID stands for Universally Unique Lexicographically Sortable Identifier. It combines a 48-bit Unix millisecond timestamp with 80 bits of randomness, then encodes the result as a 26-character Crockford Base32 string. That shape makes ULIDs URL-safe, database-friendly, and naturally sortable by creation time.

## Current Or Custom Time

Use the current time for normal application records, import keys, and test data that should reflect when it was created. Switch to a custom timestamp when you need deterministic-looking samples, backfilled rows, replayed events, or fixtures that should sort around a specific moment.

## Monotonic Batches

When monotonic batch mode is enabled, IDs generated for the same millisecond increment their random segment so the batch remains lexicographically sorted from top to bottom. Disable it when you want each row to use a fresh random segment instead. Either mode keeps the timestamp visible in the first ten characters.

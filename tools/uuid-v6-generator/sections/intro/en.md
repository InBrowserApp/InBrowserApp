UUID v6 Generator creates time-based UUIDs that keep the familiar UUID shape while putting the timestamp first for natural lexical sorting. It runs entirely in your browser, so generated identifiers and optional node values never leave the page.

## When UUID v6 Helps

Use UUID v6 when you need identifiers that remain broadly compatible with UUID tooling but also sort close to creation order in logs, database indexes, event streams, or migration scripts. UUID v6 is closest to UUID v1 semantically: it uses a Gregorian timestamp, a clock sequence, and a 48-bit node field, but rearranges the timestamp bits so newer IDs sort after older IDs.

## Node IDs and Privacy

Classic UUID v1 generators often use a real MAC address as the node field. This tool defaults to a random, locally administered node ID for each generated UUID so it does not expose a hardware address. Switch to a custom node only when you intentionally need v1-compatible output for test fixtures, interop checks, or controlled systems.

## Clock Sequence and Custom Time

The clock sequence helps avoid collisions when timestamps repeat or clocks move backward. The default random sequence is safest for normal use. Custom timestamps, node IDs, and clock sequences are useful for deterministic examples, but repeated custom values should be used carefully in production data.

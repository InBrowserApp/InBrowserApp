# MAC address registry

Shared, framework-free MAC address lookup logic and an IEEE registry snapshot
used by the MAC lookup, block explorer and vendor search tools.

## Loading

`loadDatabase()` from `@workspace/mac-address/load` returns
`Promise<Database>`, where `Database` contains `records` and an ISO `updatedAt`
timestamp. Each record has `registry`, `assignment`, `organization` and `address`.
Assignments are uppercase hexadecimal prefixes without separators.

Vite emits the snapshot as a separate, hashed JSON asset. The browser fetches it
from the current origin on first use. Concurrent requests share a promise;
failed requests clear the cache so a retry can succeed. No address or search
query is included in the data request.

## Refreshing the snapshot

Normal development and production builds use the committed data and do not
contact IEEE. Refresh all five public registries explicitly from the repo root:

```sh
node packages/lib/mac-address/scripts/update-registry.mjs
```

The updater uses Node's built-in `fetch`. On Node versions that support it, set
`NODE_USE_ENV_PROXY=1` when the network requires an HTTP proxy.

To regenerate from downloaded CSV files, put `oui.csv`, `mam.csv`, `oui36.csv`,
`iab.csv` and `cid.csv` in a directory and run:

```sh
node packages/lib/mac-address/scripts/update-registry.mjs \
  --source-dir /path/to/csv \
  --retrieved-at 2026-11-17T07:25:40.000Z
```

The updater validates the CSV headers, registry identifiers, prefix lengths,
minimum record counts and duplicate complete records before writing. It sorts
records by prefix, registry, organization and address, then deduplicates
organization/address pairs. Distinct assignees sharing a legacy prefix are
preserved, and their prefix count is recorded in the metadata. Repeating
the update with identical bytes and retrieval date produces identical output.
Review count changes and commit both generated JSON files together.

`data/registry.json` is compact generated data. `data/sources.json` records the
source URLs, retrieval timestamp, checksums, counts and, when fetched directly,
the HTTP `Last-Modified` and `ETag` values. See `data/NOTICE.txt` for attribution.

Run updater tests with:

```sh
node --test packages/lib/mac-address/scripts/registry-data.test.mjs
```

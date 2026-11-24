## Compare two IPFS directory CIDs

Paste the original folder in **Earlier folder** and the updated one in **Later folder**, then select **Compare folders**. Each input accepts a CID, an `ipfs://` address, or an HTTP gateway link. Include a path to compare two subfolders. Open a result to see its CIDs, filter the list by path, or download JSON to save the comparison.

## What counts as an added, removed, or changed path?

A path that exists in only one folder is added or removed. An entire added or removed subfolder appears as one path. When both versions contain a subfolder with different CIDs, the tool compares the paths inside it. The changed list includes files or symlinks with different CIDs and paths that switched entry type. Files imported with different chunking or encoding settings can have different CIDs even if their visible contents are the same.

## Comparing IPFS snapshots without downloading every file

The browser reads verified IPFS blocks from public gateways and skips branches whose CIDs already match. That makes it possible to compare versions of a website, published dataset, or backup using their immutable folder addresses. Changed links can be compared without downloading the full files. If a folder entry is unavailable, the result identifies the paths it could not compare.

Read more about [content addressing and dataset versions](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).

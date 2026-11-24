## Calculate a CID for a file or folder

Choose a local file or folder, then select **Calculate CID**. Copy the content identifier (CID) to record it in a manifest or compare it against an earlier IPFS import. The calculation happens in your browser. It leaves your files on your device and does not publish them to IPFS.

## Why can the same file have different IPFS CIDs?

IPFS can split a file into blocks and store links between them using UnixFS. The root CID depends on how those blocks are split, encoded, and arranged. To reproduce a CID, use the same chunk size, raw leaf setting, and directory structure as the original import. A folder CID also includes its entry names. Empty subfolders are omitted by the browser's folder picker.

## Reproduce the CID with Kubo

Open **Import settings** to change the CID version, chunk size, raw leaves, or directory wrapping. CIDv1 is the default. Use CIDv0 when matching an older import that used it. **Wrap in a folder** adds an outer directory so you can address the file by name beneath the root CID.

Copy the displayed `ipfs add --only-hash` command to reproduce the calculation on the same file or folder in Kubo. If you have a CID from an earlier import, paste it into the comparison field. An equivalent CIDv0 and CIDv1 match because they identify the same block. [IPFS documentation on content identifiers](https://docs.ipfs.tech/concepts/content-addressing/)

## Calculate a Piece CID from a CAR archive or file

Choose the exact file you plan to send to a Filecoin storage provider. Select **Calculate Piece CID**, then copy the identifier your workflow expects. The tool also shows the padded piece size in bytes. Your browser reads the file locally and processes it in chunks, so the contents stay on your device.

## Which format should I use?

**Piece CID (v2)** follows [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). It usually starts with `bafkzci` and carries the payload size information needed by newer Filecoin tools. **Legacy CommP (v1)** usually starts with `baga6ea4` and is used in traditional Filecoin storage deals. For a workflow that asks for a legacy Piece CID and padded piece size, copy the legacy commitment and use the size shown alongside it. You can paste either format to verify an existing commitment against your file. A legacy CommP can match files that differ only by trailing zero bytes.

## Why does my IPFS CID look different?

An IPFS root CID identifies a block or the root of a file or directory. A Filecoin Piece CID commits to the exact bytes of the storage payload after Filecoin's padding and hashing rules are applied. If your payload is a CAR archive, compute the commitment from the archive itself. Two CARs can have the same IPFS root CID while storing blocks in a different order, which can change the Piece CID. Reuse the exact file you calculated before submitting a deal.

For the format and padding rules, see the [Filecoin Piece specification](https://spec.filecoin.io/systems/filecoin_files/piece/).

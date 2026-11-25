## Convert a Filecoin f410 address to 0x

Paste an `f410` or `t410` address and select **Convert address**. The converter checks the Filecoin checksum and shows the corresponding Ethereum-style `0x` address with an EIP-55 checksum. Copy the result for a wallet or block explorer that uses Ethereum-style addresses on Filecoin. **Try an example** lets you see a conversion without entering your own address.

## Convert a 0x address to Filecoin

Paste a `0x` address with 40 hexadecimal digits. Choose **Mainnet** for an `f410` address or **Calibration testnet** for a `t410` address. The `0x` form contains no network prefix, so the same bytes can be written with either Filecoin prefix. Select the network used by your wallet, explorer, or exchange. Lowercase and uppercase hexadecimal inputs are accepted. Mixed-case inputs must pass the EIP-55 checksum.

## What do f410 and t410 mean?

These are delegated addresses used by the Filecoin Ethereum Virtual Machine (FEVM). An `f410` or `t410` address and its `0x` form represent the same 20-byte address on the selected Filecoin network. Filecoin's native form uses Base32 and its own checksum. Converting the format keeps those bytes unchanged and does not move FIL between networks.

## Can I convert f0, f1, f2, or f3 addresses?

This tool converts FEVM delegated addresses in namespace `10`, identified by the `f410` or `t410` prefix. Actor ID addresses, their masked `0xff0000…` representations, and other Filecoin address types fall outside that scope. Mapping some native address types to an actor requires chain state. This conversion runs in your browser without an RPC call or a wallet connection.

See [Filecoin's guide to address types and transfers](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) and the [EIP-55 checksum specification](https://eips.ethereum.org/EIPS/eip-55).

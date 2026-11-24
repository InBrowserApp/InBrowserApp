## Look up NFT metadata by contract address and token ID

Paste an Ethereum mainnet **Contract address** and enter the **Token ID**, then select **View metadata**. The token ID can be a decimal number such as `1` or a hexadecimal number such as `0x1`. Select **Try an example** to see a complete lookup. The viewer makes a read-only Ethereum RPC request in your browser, so you can look up a public token without connecting a wallet.

## Find the token URI, image, traits, and JSON

The viewer reads `tokenURI` for ERC-721 or `uri` for ERC-1155. The **Token URI** is the string returned by the contract. The viewer reads the metadata it points to and displays the image, name, and traits when those fields are available. Use **Raw JSON** to inspect or copy the unmodified response. IPFS, HTTP, Arweave, and inline JSON data URIs are supported.

## How ERC-1155 token ID substitution works

An ERC-1155 contract can return a template shared by multiple tokens. The viewer replaces `{id}` with the token ID as 64 lowercase hexadecimal digits, padded on the left and with no `0x` prefix. When the template changes, **Resolved URI** shows the address fetched for that token. The same substitution is used in preview fields such as the image link.

## What if a token URI appears without an image?

A contract can return a URI even when its web host or IPFS gateway is temporarily unavailable. The viewer keeps the URI available to copy when it cannot load the metadata. If the JSON is available, inspect its `image` field and try the source directly. HTTP hosts can also restrict cross-origin requests, which affects what a browser can read.

See the [ERC-721 standard](https://eips.ethereum.org/EIPS/eip-721), the [ERC-1155 metadata specification](https://eips.ethereum.org/EIPS/eip-1155#metadata), and the [OpenSea metadata guide](https://docs.opensea.io/docs/metadata-standards) for the fields commonly used by NFT apps.

## Validate NFT metadata JSON before minting

Choose **Local files** to check individual JSON files or a collection folder on your device. The checker reports invalid JSON and common metadata problems for each item, including empty names, missing images, invalid descriptions, and malformed attributes. Use **Needs review** to find the entries to fix, or download the full report as JSON.

## Check token URIs in bulk

Under **Token URIs**, paste one metadata address per line. For numbered collections, use **URI pattern** with a placeholder such as `https://example.com/metadata/{id}.json`. Set the first and last IDs to check an inclusive range. Decimal format uses the ID as written. **ERC-1155 hex** writes each ID as 64 lowercase hexadecimal characters with leading zeros, as specified for the ERC-1155 `{id}` substitution.

## Check NFT image and animation links

Enable **Check media availability** to check `image` and `animation_url` links. Select the entire local folder to include media referenced by relative paths. The browser can also check HTTP, IPFS, and Arweave resources. A gateway error, timeout, or cross-origin restriction can leave a link unconfirmed. Review those links in the gateway or marketplace you use. Checks on local files run in the browser, and URI checks contact the relevant host or gateway.

For field definitions and token URI substitution, see the [OpenSea metadata guide](https://docs.opensea.io/docs/metadata-standards) and the [ERC-1155 metadata specification](https://eips.ethereum.org/EIPS/eip-1155#metadata).

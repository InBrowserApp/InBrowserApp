## Download an IPFS file by CID or link

Paste a CID, an `ipfs://` URI, or an IPFS gateway URL and select **Open content**. When the address points to a file, choose **Download file** to save it. A link with a path after the CID can open a specific file or subfolder.

## Download an entire IPFS folder as ZIP

Open a directory to browse its entries, then choose **Download ZIP** to save that directory and its subfolders. The ZIP preserves their paths. If some paths fail, the tool lists them. You can retry the ZIP or use **Download available files** to save the part that was retrieved.

## How the browser retrieves IPFS content

The browser asks public IPFS gateways for the blocks it needs and checks them against their CIDs before using them. A CID identifies content. Retrieval also depends on gateways being able to reach peers that provide those blocks. If a folder is too large for your device to package, open a subfolder or download individual files. [IPFS retrieval documentation](https://docs.ipfs.tech/quickstart/retrieve/)

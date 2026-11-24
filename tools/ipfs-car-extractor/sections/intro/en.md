## Open an IPFS or Filecoin CAR file online

Select a `.car` file from your device. The extractor reads the archive locally and displays its root CID. If the archive contains multiple roots, choose the one you want. These archives are Content Addressable aRchives used by IPFS and Filecoin. Apple asset catalogs use a different format with the same extension.

## Extract files or convert a CAR folder to ZIP

Open a folder to see its contents. Select a file, then choose **Download file** to save its original bytes. To export a folder and its subfolders together, choose **Download ZIP**. The ZIP preserves the UnixFS folder structure.

## What does a missing block mean?

A CAR stores content as blocks identified by CIDs. A root can link to blocks stored outside a partial archive. When an entry needs a block that is absent, get a complete export from the source or download an entry whose blocks are available. CAR files can also hold data in other IPLD formats. File and folder extraction here uses UnixFS. [IPLD CAR format](https://ipld.io/specs/transport/car/)

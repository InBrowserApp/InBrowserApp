## Create a CAR file from files or a folder

Choose files or a folder, then select **Create CAR**. Copy the root CID and save the `.car` archive. The browser reads your selection locally and packages it as a CARv1 archive with a UnixFS root. You can keep the archive as a backup or import it into an IPFS node or storage service.

## How the archive preserves your files

A single file becomes the root. Several files share a directory root, and a selected folder keeps its file paths. The browser's folder picker supplies files and their paths. Drag in a folder to include empty subfolders when your browser supports folder drag and drop.

## What the root CID means

The root CID identifies the packaged file or directory. The builder uses the same default CIDv1 settings as the IPFS CID Calculator, so the same input structure gives the same content identifier. To add the archive to Kubo, run `ipfs dag import archive.car` with the downloaded filename. [Kubo command reference](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)

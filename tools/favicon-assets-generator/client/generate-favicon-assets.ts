/* v8 ignore start -- browser-only canvas and zip assembly */
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js"

import {
  createHeadMarkup,
  createManifestText,
  listGeneratedAssetNames,
} from "../core/favicon-assets"
import {
  generateDesktopAssetGroup,
  generateIOSAssetGroup,
  generatePWAAnyAssetGroup,
  generatePWAMaskableAssetGroup,
  resolveDesktopSourceFile,
} from "./platform-asset-builders"

import type {
  GenerateFaviconAssetsInput,
  GeneratedBlobFile,
  GeneratedFaviconBundle,
} from "./types"

async function createZip(files: readonly GeneratedBlobFile[]) {
  const writer = new BlobWriter()
  const zip = new ZipWriter(writer)

  for (const file of files) {
    await zip.add(file.name, new BlobReader(file.blob))
  }

  await zip.close()

  return writer.getData()
}

async function generateFaviconAssets(
  input: GenerateFaviconAssetsInput
): Promise<GeneratedFaviconBundle> {
  const desktopSourceFile = resolveDesktopSourceFile(input)
  const [desktopGroup, iosGroup, pwaAnyGroup, pwaMaskableGroup] =
    await Promise.all([
      generateDesktopAssetGroup(input),
      generateIOSAssetGroup(input),
      generatePWAAnyAssetGroup(input),
      generatePWAMaskableAssetGroup(input),
    ])
  const manifestText = createManifestText(input.site, input.pwa)
  const allFiles = [
    ...desktopGroup.files,
    ...iosGroup.files,
    ...pwaAnyGroup.files,
    ...(pwaMaskableGroup?.files ?? []),
    {
      name: "site.webmanifest",
      blob: new Blob([manifestText], {
        type: "application/manifest+json",
      }),
    },
  ] satisfies GeneratedBlobFile[]

  const zipBlob = await createZip(allFiles)

  return {
    files: listGeneratedAssetNames(
      desktopSourceFile.type,
      input.desktop,
      input.pwa
    ).map((name) => {
      const file = allFiles.find((entry) => entry.name === name)

      if (!file) {
        throw new Error(`MISSING_FILE:${name}`)
      }

      return {
        name: file.name,
        size: file.blob.size,
        type: file.blob.type,
      }
    }),
    headMarkup: createHeadMarkup(
      desktopSourceFile.type,
      input.site,
      input.desktop
    ),
    manifestText,
    zipBlob,
  }
}

export {
  generateDesktopAssetGroup,
  generateFaviconAssets,
  generateIOSAssetGroup,
  generatePWAAnyAssetGroup,
  generatePWAMaskableAssetGroup,
}
/* v8 ignore stop */

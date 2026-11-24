import { importer } from "ipfs-unixfs-importer"
import { fixedSize } from "ipfs-unixfs-importer/chunker"
import { base16 } from "multiformats/bases/base16"
import { base32 } from "multiformats/bases/base32"
import { base36 } from "multiformats/bases/base36"
import { base58btc } from "multiformats/bases/base58"
import { CID } from "multiformats/cid"

export type ImportSettings = {
  version: 0 | 1
  chunkSize: number
  rawLeaves: boolean
  wrap: boolean
}

export type Selection = {
  name: string
  directory: boolean
  files: readonly File[]
}

export const DEFAULT_SETTINGS: ImportSettings = {
  version: 1,
  chunkSize: 262144,
  rawLeaves: true,
  wrap: false,
}

const cidDecoder = base32.decoder
  .or(base58btc.decoder)
  .or(base36.decoder)
  .or(base16.decoder)

async function* readChunks(file: File, size: number, signal: AbortSignal) {
  for (let start = 0; start < file.size; start += size) {
    signal.throwIfAborted()
    yield new Uint8Array(await file.slice(start, start + size).arrayBuffer())
  }
}

export async function calculateCid(
  selection: Selection,
  settings: ImportSettings,
  signal: AbortSignal
) {
  const candidates = selection.files.map((file) => ({
    path: selection.directory ? file.webkitRelativePath : file.name,
    content: readChunks(file, settings.chunkSize, signal),
  }))
  let root: CID | undefined
  for await (const entry of importer(
    candidates,
    {
      async put(cid) {
        return cid
      },
    },
    {
      profile: "unixfs-v0-2015",
      cidVersion: settings.version,
      rawLeaves: settings.rawLeaves,
      chunker: fixedSize({ chunkSize: settings.chunkSize }),
      wrapWithDirectory: settings.wrap,
    }
  )) {
    signal.throwIfAborted()
    root = entry.cid
  }
  if (!root) throw new Error("No UnixFS root")
  return root
}

export function compareCid(expected: string, calculated: CID) {
  try {
    return CID.parse(expected.trim(), cidDecoder)
      .toV1()
      .equals(calculated.toV1())
      ? "match"
      : "different"
  } catch {
    return "invalidCid"
  }
}

export function kuboCommand(selection: Selection, settings: ImportSettings) {
  const args = [
    "ipfs add --only-hash -Q",
    `--cid-version=${settings.version}`,
    `--raw-leaves=${settings.rawLeaves}`,
    `--chunker=size-${settings.chunkSize}`,
  ]
  if (selection.directory) args.push("--recursive", "--hidden", "--empty-dirs=false")
  if (settings.wrap) args.push("--wrap-with-directory")
  return `${args.join(" ")} -- '${selection.name.replaceAll("'", "'\"'\"'")}'`
}

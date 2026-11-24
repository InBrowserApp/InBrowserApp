import { importUnixFs, type ImportSettings } from "@workspace/ipfs-files/import"
import { base16 } from "multiformats/bases/base16"
import { base32 } from "multiformats/bases/base32"
import { base36 } from "multiformats/bases/base36"
import { base58btc } from "multiformats/bases/base58"
import { CID } from "multiformats/cid"

export {
  DEFAULT_SETTINGS,
  type ImportSettings,
} from "@workspace/ipfs-files/import"

export type Selection = {
  name: string
  directory: boolean
  files: readonly File[]
}

const cidDecoder = base32.decoder
  .or(base58btc.decoder)
  .or(base36.decoder)
  .or(base16.decoder)

export function calculateCid(
  selection: Selection,
  settings: ImportSettings,
  signal: AbortSignal
) {
  return importUnixFs(
    selection.files.map((file) => ({
      path: selection.directory ? file.webkitRelativePath : file.name,
      file,
    })),
    settings,
    signal
  )
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
  if (selection.directory)
    args.push("--recursive", "--hidden", "--empty-dirs=false")
  if (settings.wrap) args.push("--wrap-with-directory")
  return `${args.join(" ")} -- '${selection.name.replaceAll("'", "'\"'\"'")}'`
}

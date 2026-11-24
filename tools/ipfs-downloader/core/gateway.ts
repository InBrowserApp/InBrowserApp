import {
  IpfsFileError,
  listIpfsDirectory,
  openIpfsEntry,
  verifyBlock,
  type IpfsReference,
  type ReadableStorage,
} from "@workspace/ipfs-files"
import { base16 } from "multiformats/bases/base16"
import { base32 } from "multiformats/bases/base32"
import { base36 } from "multiformats/bases/base36"
import { base58btc } from "multiformats/bases/base58"
import { CID } from "multiformats/cid"

const gateways = ["https://ipfs.filebase.io", "https://gateway.pinata.cloud"]
const decoder = base32.decoder
  .or(base58btc.decoder)
  .or(base36.decoder)
  .or(base16.decoder)

export const sampleAddress =
  "ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4"

export function parseIpfsAddress(input: string) {
  try {
    const value = input.trim()
    let path = value.split(/[?#]/, 1)[0]!
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value)
      const subdomain = /^([^.]+)\.ipfs\./i.exec(url.hostname)?.[1]
      const gatewayPath = /^\/ipfs\/(.+)$/.exec(url.pathname)?.[1]
      path = subdomain ? subdomain + url.pathname : (gatewayPath ?? "")
    } else {
      path = path.replace(/^(?:ipfs:\/\/|\/ipfs\/)/i, "")
    }
    const [id, ...segments] = path.split("/")
    const cid = CID.parse(id!, decoder)
    const parts = segments
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment))
    if (
      parts.some(
        (part) => part === "." || part === ".." || /[/\\\0]/.test(part)
      )
    )
      return null
    return { cid, parts }
  } catch {
    return null
  }
}

export function gatewayStore(fetcher: typeof fetch = fetch): ReadableStorage {
  return {
    async *get(cid, { signal } = {}) {
      signal?.throwIfAborted()
      if (cid.multihash.code === 0) {
        yield cid.multihash.digest
        return
      }
      let failure = new IpfsFileError("missing")
      for (const gateway of gateways) {
        try {
          const timeout = AbortSignal.timeout(9000)
          const response = await fetcher(
            `${gateway}/ipfs/${cid.toV1()}?format=raw`,
            {
              headers: { Accept: "application/vnd.ipld.raw" },
              signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
            }
          )
          if (!response.ok) continue
          const bytes = new Uint8Array(await response.arrayBuffer())
          await verifyBlock(cid, bytes)
          signal?.throwIfAborted()
          yield bytes
          return
        } catch (error) {
          signal?.throwIfAborted()
          if (error instanceof IpfsFileError) failure = error
        }
      }
      throw failure
    },
  }
}

export class IpfsPathError extends Error {}

export async function entryView(
  path: readonly IpfsReference[],
  store: ReadableStorage,
  signal: AbortSignal
) {
  const entry = await openIpfsEntry(path.at(-1)!.cid, store, signal)
  const children =
    entry.type === "directory" ? await listIpfsDirectory(entry, signal) : []
  return { path, entry, children }
}

export async function addressView(
  address: NonNullable<ReturnType<typeof parseIpfsAddress>>,
  store: ReadableStorage,
  signal: AbortSignal
) {
  const path: IpfsReference[] = [
    { cid: address.cid, name: address.cid.toString() },
  ]
  let view = await entryView([...path], store, signal)
  for (const segment of address.parts) {
    const child = view.children.find(({ name }) => segment === name)
    if (!child) throw new IpfsPathError()
    path.push(child)
    view = await entryView([...path], store, signal)
  }
  return view
}

import { base16 } from "multiformats/bases/base16"
import { base32 } from "multiformats/bases/base32"
import { base36 } from "multiformats/bases/base36"
import { base58btc } from "multiformats/bases/base58"
import { CID } from "multiformats/cid"

import { IpfsFileError, verifyBlock, type ReadableStorage } from "./index"

export interface IpfsAddress {
  cid: CID
  parts: readonly string[]
}

const gateways = ["https://ipfs.filebase.io", "https://gateway.pinata.cloud"]
const decoder = base32.decoder
  .or(base58btc.decoder)
  .or(base36.decoder)
  .or(base16.decoder)

export function parseIpfsAddress(input: string): IpfsAddress | null {
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

import {
  listIpfsDirectory,
  openIpfsEntry,
  resolveIpfsPath,
  type IpfsReference,
  type ReadableStorage,
} from "@workspace/ipfs-files"
import type { IpfsAddress } from "@workspace/ipfs-files/gateway"

export const sampleAddress =
  "ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4"

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
  address: IpfsAddress,
  store: ReadableStorage,
  signal: AbortSignal
) {
  const path = await resolveIpfsPath(address.cid, address.parts, store, signal)
  if (!path) throw new IpfsPathError()
  return entryView(path, store, signal)
}

import {
  cidKey,
  IpfsFileError,
  listIpfsDirectory,
  openIpfsEntry,
  resolveIpfsPath,
  type ReadableStorage,
} from "@workspace/ipfs-files"
import type { IpfsAddress } from "@workspace/ipfs-files/gateway"

const dagPb = 0x70

export type Side = "before" | "after"
export type ChangeKind = "added" | "removed" | "changed"

export class FolderInputError extends Error {
  constructor(
    readonly side: Side,
    readonly messageKey: "notFolder" | "unavailable",
    options?: ErrorOptions
  ) {
    super(messageKey, options)
  }
}

export interface Change {
  kind: ChangeKind
  path: string
  before?: string
  after?: string
}

interface Context {
  store: ReadableStorage
  signal: AbortSignal
  onPath: (path: string) => void
}

export interface FolderDiff {
  before: string
  after: string
  changes: Change[]
  unchecked: string[]
}

async function openFolder(
  address: IpfsAddress,
  side: Side,
  { store, signal }: Context
) {
  let entry
  try {
    let cid = address.cid
    if (address.parts.length > 0) {
      const path = await resolveIpfsPath(cid, address.parts, store, signal)
      if (!path) throw new Error("Missing IPFS path")
      cid = path.at(-1)!.cid
    }
    entry = await openIpfsEntry(cid, store, signal)
  } catch (cause) {
    signal.throwIfAborted()
    throw new FolderInputError(side, "unavailable", { cause })
  }
  if (entry.type !== "directory") throw new FolderInputError(side, "notFolder")
  return entry
}

type Directory = Awaited<ReturnType<typeof openFolder>>

async function directoryLinks(directory: Directory, signal: AbortSignal) {
  const links = new Map<string, Directory["cid"]>()
  for (const { name, cid } of await listIpfsDirectory(directory, signal)) {
    if (!name || name.includes("/") || links.has(name)) {
      throw new IpfsFileError("unsupported")
    }
    links.set(name, cid)
  }
  return links
}

export async function compareFolders(
  before: IpfsAddress,
  after: IpfsAddress,
  context: Context
): Promise<FolderDiff> {
  const { signal, store, onPath } = context
  const [earlier, later] = await Promise.all([
    openFolder(before, "before", context),
    openFolder(after, "after", context),
  ])
  const changes: Change[] = []
  const unchecked: string[] = []

  async function compareDirectory(
    left: Directory,
    right: Directory,
    path: string
  ) {
    signal.throwIfAborted()
    if (cidKey(left.cid) === cidKey(right.cid)) return
    onPath(path)

    const lists = await Promise.all([
      directoryLinks(left, signal),
      directoryLinks(right, signal),
    ]).catch(() => {
      signal.throwIfAborted()
      unchecked.push(path)
      return null
    })
    if (!lists) return

    const [before, after] = lists

    for (const name of new Set([...before.keys(), ...after.keys()])) {
      signal.throwIfAborted()
      const leftCid = before.get(name)
      const rightCid = after.get(name)
      const member = path ? `${path}/${name}` : name
      if (!leftCid) {
        changes.push({ kind: "added", path: member, after: cidKey(rightCid!) })
        continue
      }
      if (!rightCid) {
        changes.push({ kind: "removed", path: member, before: cidKey(leftCid) })
        continue
      }
      const from = cidKey(leftCid)
      const to = cidKey(rightCid)
      if (from === to) continue

      if (leftCid.code === dagPb && rightCid.code === dagPb) {
        // Only DAG-PB pairs can both be UnixFS directories. Raw files can
        // be compared by CID without retrieving their bytes.
        onPath(member)
        try {
          const [leftEntry, rightEntry] = await Promise.all(
            [leftCid, rightCid].map((cid) =>
              openIpfsEntry(cid, store, signal).catch((error: unknown) => {
                if (
                  error instanceof IpfsFileError &&
                  error.code === "unsupported"
                )
                  return null
                throw error
              })
            )
          )
          if (
            leftEntry?.type === "directory" &&
            rightEntry?.type === "directory"
          ) {
            await compareDirectory(leftEntry, rightEntry, member)
            continue
          }
        } catch {
          signal.throwIfAborted()
          unchecked.push(member)
          continue
        }
      }

      changes.push({ kind: "changed", path: member, before: from, after: to })
    }
  }

  await compareDirectory(earlier, later, "")
  return {
    before: cidKey(earlier.cid),
    after: cidKey(later.cid),
    changes: changes.sort((left, right) => left.path.localeCompare(right.path)),
    unchecked,
  }
}

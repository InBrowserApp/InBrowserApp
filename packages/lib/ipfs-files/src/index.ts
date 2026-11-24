import {
  exporter,
  NotFoundError,
  NoResolverError,
  NotUnixFSError,
  walkPath,
  type UnixFSEntry,
  type UnixFSDirectory,
  type ReadableStorage,
} from "ipfs-unixfs-exporter"
import { sha256, sha512 } from "multiformats/hashes/sha2"
import { CID } from "multiformats/cid"

export type { ReadableStorage } from "ipfs-unixfs-exporter"

export class IpfsFileError extends Error {
  constructor(
    readonly code: "missing" | "corrupt" | "unsupported" | "failed",
    readonly path?: string,
    options?: ErrorOptions
  ) {
    super(code, options)
  }
}

export function cidKey(cid: CID) {
  return cid.toV1().toString()
}

export async function verifyBlock(cid: CID, bytes: Uint8Array) {
  const hasher = [sha256, sha512].find(
    ({ code }) => code === cid.multihash.code
  )
  if (!hasher) throw new IpfsFileError("unsupported")
  const digest = await hasher.digest(bytes)
  if (!CID.create(cid.version, cid.code, digest).equals(cid)) {
    throw new IpfsFileError("corrupt")
  }
}

export async function openIpfsEntry(
  cid: CID,
  store: ReadableStorage,
  signal: AbortSignal
) {
  const entry = await exporter(cid, store, { signal }).catch(
    (error: unknown) => {
      if (error instanceof NoResolverError || error instanceof NotUnixFSError) {
        throw new IpfsFileError("unsupported", undefined, { cause: error })
      }
      throw error
    }
  )
  if (
    entry.type === "object" ||
    (entry.type === "file" && entry.unixfs.type === "symlink")
  ) {
    throw new IpfsFileError("unsupported")
  }
  return entry
}

export type IpfsEntry = Exclude<UnixFSEntry, { type: "object" }>
type IpfsFile = Exclude<IpfsEntry, UnixFSDirectory>

export type IpfsReference = { cid: CID; name: string }

export async function resolveIpfsPath(
  cid: CID,
  parts: readonly string[],
  store: ReadableStorage,
  signal: AbortSignal
) {
  const path: IpfsReference[] = []
  try {
    for await (const { cid: resolved, name } of walkPath(
      [cid.toString(), ...parts].join("/"),
      store,
      { signal }
    )) {
      path.push({ cid: resolved, name })
    }
  } catch (error) {
    if (error instanceof NotFoundError) return null
    throw error
  }
  return path.length === parts.length + 1 ? path : null
}

export async function listIpfsDirectory(
  directory: UnixFSDirectory,
  signal: AbortSignal
) {
  const entries: IpfsReference[] = []
  for await (const { cid, name } of directory.entries({ signal })) {
    entries.push({ cid, name })
  }
  return entries.sort((left, right) => left.name.localeCompare(right.name))
}

function fileStream(file: IpfsFile, signal: AbortSignal) {
  const iterator = file.content({ signal, blockReadConcurrency: 4 })
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const chunk = await iterator.next()
      if (chunk.done) controller.close()
      else controller.enqueue(chunk.value)
    },
    async cancel() {
      await iterator.return()
    },
  })
}

export function readIpfsFile(file: IpfsFile, signal: AbortSignal) {
  return new Response(fileStream(file, signal)).blob()
}

function zipPath(parent: string, name: string) {
  if (
    !name ||
    name === "." ||
    name === ".." ||
    /[/\\\0]/.test(name) ||
    /^[a-z]:/i.test(name)
  ) {
    throw new IpfsFileError("unsupported")
  }
  return parent + name
}

export async function zipIpfsDirectory(
  directory: UnixFSDirectory,
  store: ReadableStorage,
  signal: AbortSignal
) {
  return (await packDirectory(directory, store, signal)).blob
}

export function zipAvailableIpfsDirectory(
  directory: UnixFSDirectory,
  store: ReadableStorage,
  signal: AbortSignal,
  onPath: (path: string) => void
) {
  return packDirectory(directory, store, signal, onPath)
}

async function packDirectory(
  directory: UnixFSDirectory,
  store: ReadableStorage,
  signal: AbortSignal,
  onPath?: (path: string) => void
) {
  const { BlobReader, BlobWriter, ZipWriter } = await import("@zip.js/zip.js")
  const writer = new ZipWriter(new BlobWriter("application/zip"), {
    bufferedWrite: false,
  })
  const failed: string[] = []
  let saved = 0

  async function addFolder(folder: UnixFSDirectory, parent: string) {
    for await (const { name, cid } of folder.entries({ signal })) {
      signal.throwIfAborted()
      const member = parent + name
      onPath?.(member)
      try {
        const path = zipPath(parent, name)
        const entry = await openIpfsEntry(cid, store, signal)
        if (entry.type === "directory") {
          await writer.add(path + "/", undefined, { directory: true, signal })
          await addFolder(entry, path + "/")
        } else {
          // In partial mode, finish reading this file before writing to the ZIP.
          const input = onPath
            ? new BlobReader(await readIpfsFile(entry, signal))
            : fileStream(entry, signal)
          await writer.add(path, input, { signal, level: 0 })
          saved++
        }
      } catch (error) {
        const problem = error instanceof IpfsFileError ? error : null
        if (signal.aborted || problem?.path !== undefined) throw error
        if (onPath && problem) {
          failed.push(member)
          continue
        }
        throw new IpfsFileError(problem?.code ?? "failed", member, {
          cause: error,
        })
      }
    }
  }

  try {
    await addFolder(directory, "")
  } catch (error) {
    await writer.close().catch(() => {})
    throw error
  }
  const blob = await writer.close()
  signal.throwIfAborted()
  return { blob, failed, saved }
}

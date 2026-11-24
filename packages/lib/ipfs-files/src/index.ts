import {
  exporter,
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
  const entry = await exporter(cid, store, { signal })
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
  const { BlobWriter, ZipWriter } = await import("@zip.js/zip.js")
  const writer = new ZipWriter(new BlobWriter("application/zip"), {
    bufferedWrite: false,
  })

  async function addFolder(folder: UnixFSDirectory, parent: string) {
    for await (const { name, cid } of folder.entries({ signal })) {
      signal.throwIfAborted()
      try {
        const path = zipPath(parent, name)
        const entry = await openIpfsEntry(cid, store, signal)
        if (entry.type === "directory") {
          await writer.add(path + "/", undefined, { directory: true, signal })
          await addFolder(entry, path + "/")
        } else {
          await writer.add(path, fileStream(entry, signal), {
            signal,
            level: 0,
          })
        }
      } catch (error) {
        const problem = error instanceof IpfsFileError ? error : null
        if (signal.aborted || problem?.path !== undefined) throw error
        throw new IpfsFileError(problem?.code ?? "failed", parent + name, {
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
  const zip = await writer.close()
  signal.throwIfAborted()
  return zip
}

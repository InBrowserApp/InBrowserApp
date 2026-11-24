export const BLOCK_SIZE = 1024 * 1024

export class StorageError extends Error {
  constructor(cause: unknown) {
    super("The browser could not save the file", { cause })
  }
}

export type FileHeader = { id: string; name: string; size: number }

type Checkpoint = {
  header: FileHeader
  key: string
  handle: FileSystemFileHandle
  writer?: FileSystemWritableFileStream
  offset: number
}

export function createFileStorage() {
  let directory: FileSystemDirectoryHandle | undefined
  let releaseDirectory: (() => Promise<void>) | undefined
  let partial: Checkpoint | undefined
  const completed = new Map<string, Checkpoint>()
  let operation = Promise.resolve()

  function serialize<T>(run: () => Promise<T>): Promise<T> {
    const result = operation.then(run)
    operation = result.then(
      () => {},
      () => {}
    )
    return result
  }

  async function remove(checkpoint: Checkpoint) {
    await checkpoint.writer?.abort().catch(() => {})
    await directory?.removeEntry(checkpoint.key)
  }

  async function openDirectory() {
    const root = await navigator.storage.getDirectory()
    const parent = await root.getDirectoryHandle(
      "local-network-file-transfer-v2",
      { create: true }
    )
    const key = crypto.randomUUID()
    // A lock keeps other tool tabs from reclaiming files this tab still needs.
    let release!: () => void
    let announce!: () => void
    const lease = new Promise<void>((resolve) => {
      release = resolve
    })
    const ready = new Promise<void>((resolve) => {
      announce = resolve
    })
    const lockName = (id: string) => `local-network-file-transfer/${id}`
    const locked = navigator.locks.request(lockName(key), async () => {
      announce()
      await lease
    })
    await Promise.race([ready, locked])
    try {
      const folder = await parent.getDirectoryHandle(key, { create: true })
      releaseDirectory = async () => {
        try {
          await parent.removeEntry(key, { recursive: true })
        } finally {
          release()
          await locked
        }
      }
      // Recover disk space from closed or crashed tabs on the next transfer.
      void (async () => {
        const entries = parent as FileSystemDirectoryHandle & {
          values(): AsyncIterable<FileSystemHandle>
        }
        for await (const entry of entries.values()) {
          if (entry.name === key) continue
          await navigator.locks
            .request(
              lockName(entry.name),
              { ifAvailable: true },
              async (lock) => {
                if (lock)
                  await parent.removeEntry(entry.name, { recursive: true })
              }
            )
            .catch(() => {})
        }
      })().catch(() => {})
      return folder
    } catch (error) {
      release()
      throw error
    }
  }

  return {
    open(header: FileHeader) {
      return serialize(async () => {
        const previous =
          partial?.header.id === header.id ? partial : completed.get(header.id)
        if (previous) {
          if (
            previous.header.size !== header.size ||
            previous.header.name !== header.name
          ) {
            throw new Error("File metadata changed during resume")
          }
          return previous.offset
        }

        try {
          if (partial) {
            const obsolete = partial
            partial = undefined
            await remove(obsolete)
          }
          if (!directory) {
            directory = await openDirectory()
          }
          const key = crypto.randomUUID()
          const handle = await directory.getFileHandle(key, { create: true })
          try {
            const writer = await handle.createWritable()
            partial = { header, key, handle, writer, offset: 0 }
          } catch (error) {
            await directory.removeEntry(key)
            throw error
          }
          return 0
        } catch (error) {
          throw new StorageError(error)
        }
      })
    },
    write(id: string, offset: number, data: Uint8Array<ArrayBuffer>) {
      return serialize(async () => {
        if (
          !partial?.writer ||
          partial.header.id !== id ||
          partial.offset !== offset
        ) {
          throw new Error("Unexpected file checkpoint")
        }
        try {
          await partial.writer.write(data)
        } catch (error) {
          const failed = partial
          partial = undefined
          await remove(failed).catch(() => {})
          throw new StorageError(error)
        }
        partial.offset += data.byteLength
        return partial.offset
      })
    },
    finish(id: string) {
      return serialize(async () => {
        const existing = completed.get(id)
        if (existing) return existing.handle.getFile()
        if (
          !partial?.writer ||
          partial.header.id !== id ||
          partial.offset !== partial.header.size
        ) {
          throw new Error("Incomplete file")
        }
        const file = partial
        partial = undefined
        try {
          await file.writer?.close()
          file.writer = undefined
          const blob = await file.handle.getFile()
          if (blob.size !== file.header.size)
            throw new Error("Stored file size mismatch")
          completed.set(id, file)
          return blob
        } catch (error) {
          await remove(file).catch(() => {})
          throw new StorageError(error)
        }
      })
    },
    removeCompleted(key: string) {
      return serialize(async () => {
        for (const [id, file] of completed) {
          if (file.key !== key) continue
          await remove(file)
          completed.delete(id)
          break
        }
      })
    },
    dispose() {
      return serialize(async () => {
        await Promise.allSettled(
          [...(partial ? [partial] : []), ...completed.values()].map(remove)
        )
        partial = undefined
        completed.clear()
        await releaseDirectory?.().catch(() => {})
        releaseDirectory = undefined
        directory = undefined
      })
    },
  }
}

export type FileStorage = ReturnType<typeof createFileStorage>

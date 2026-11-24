import { CarWriter } from "@ipld/car/writer"
import {
  DEFAULT_SETTINGS,
  importUnixFs,
  type UnixFsSource,
} from "@workspace/ipfs-files/import"

export class DuplicatePathError extends Error {}

export async function buildCar(
  entries: readonly UnixFsSource[],
  signal: AbortSignal,
  onPacking: () => void
) {
  const paths = new Set(entries.map(({ path }) => path))
  if (paths.size !== entries.length) throw new DuplicatePathError()

  const roots = new Set(entries.map(({ path }) => path.split("/", 1)[0]))
  const settings = { ...DEFAULT_SETTINGS, wrap: roots.size > 1 }
  const cid = await importUnixFs(entries, settings, signal)
  onPacking()

  const { writer, out } = CarWriter.create([cid])
  const written = new Set<string>()
  const write = async () => {
    try {
      const writtenRoot = await importUnixFs(entries, settings, signal, {
        async put(cid, bytes) {
          signal.throwIfAborted()
          const key = cid.toString()
          if (!written.has(key)) {
            written.add(key)
            await writer.put({ cid, bytes })
          }
          return cid
        },
      })
      if (!writtenRoot.equals(cid))
        throw new Error("The input changed while creating the CAR")
    } finally {
      await writer.close()
    }
  }
  const read = async () => {
    const parts: BlobPart[] = []
    for await (const part of out) parts.push(new Uint8Array(part))
    return new Blob(parts, { type: "application/vnd.ipld.car" })
  }

  const [blob] = await Promise.all([read(), write()])
  signal.throwIfAborted()
  return { cid: cid.toString(), blob }
}

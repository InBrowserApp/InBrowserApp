import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { openArchive } from "../core/archive"
import type { ArchiveEntry } from "../core/types"
import type { ArchiveRequest, ArchiveResponse } from "./protocol"

class ArchiveWorker extends EventTarget {
  static instance: ArchiveWorker
  readonly requests: ArchiveRequest[] = []
  readonly postMessage = vi.fn((request: ArchiveRequest) => {
    this.requests.push(request)
  })
  readonly terminate = vi.fn()

  constructor() {
    super()
    ArchiveWorker.instance = this
  }

  reply(data: ArchiveResponse) {
    this.dispatchEvent(new MessageEvent("message", { data }))
  }
}

const makeEntry = (
  path: string,
  kind: ArchiveEntry["kind"] = "file"
): ArchiveEntry => ({
  path,
  kind,
  size: 1,
  compressedSize: null,
  modifiedAt: null,
  extension: "",
})

beforeEach(() => vi.stubGlobal("Worker", ArchiveWorker))
afterEach(() => vi.unstubAllGlobals())

async function startOpening(controller = new AbortController()) {
  const file = new File(
    [Uint8Array.of(0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c)],
    "archive"
  )
  const result = openArchive(file, controller.signal)
  await vi.waitFor(() =>
    expect(ArchiveWorker.instance?.requests[0]).toMatchObject({
      type: "open",
      file,
      format: "7z",
      id: 0,
    })
  )
  return { result, worker: ArchiveWorker.instance }
}

describe("worker archive handle", () => {
  test("keeps physical entry indices and routes concurrent extraction replies", async () => {
    const { result, worker } = await startOpening()
    worker.reply({
      id: 0,
      type: "opened",
      listing: {
        entries: [
          makeEntry(""),
          makeEntry("folder/", "directory"),
          makeEntry("folder/z.txt"),
          makeEntry("folder/z.txt"),
          makeEntry("folder/a.txt"),
        ],
        tarWrapped: false,
      },
    })
    const archive = await result
    expect(archive.entries.map(({ path }) => path)).toEqual([
      "folder/",
      "folder/a.txt",
      "folder/z.txt",
    ])
    await expect(archive.readEntry("folder/")).rejects.toMatchObject({
      code: "file-only",
    })
    await expect(archive.readEntry("missing")).rejects.toMatchObject({
      code: "entry-not-found",
    })
    const first = archive.readEntry("folder/z.txt")
    const second = archive.readEntry("./folder/a.txt")
    expect(worker.requests.slice(1)).toEqual([
      { id: 1, type: "extract", index: 2, path: "folder/z.txt" },
      { id: 2, type: "extract", index: 4, path: "folder/a.txt" },
    ])
    const a = new Blob(["a"])
    const z = new Blob(["z"])
    worker.reply({ id: 2, type: "extracted", blob: a })
    worker.reply({ id: 1, type: "extracted", blob: z })
    await expect(first).resolves.toBe(z)
    await expect(second).resolves.toBe(a)
    const pending = archive.readEntry("folder/a.txt")
    await archive.dispose()
    await archive.dispose()
    await expect(pending).rejects.toMatchObject({ name: "AbortError" })
    await expect(archive.readEntry("folder/a.txt")).rejects.toMatchObject({
      name: "AbortError",
    })
    expect(worker.terminate).toHaveBeenCalledTimes(1)
  })

  test("cancels a pending listing and terminates the worker", async () => {
    const controller = new AbortController()
    const { result, worker } = await startOpening(controller)
    controller.abort()
    await expect(result).rejects.toMatchObject({ name: "AbortError" })
    expect(worker.terminate).toHaveBeenCalledTimes(1)
    await expect(
      openArchive(new File([], "empty.7z"), controller.signal)
    ).rejects.toMatchObject({ name: "AbortError" })
  })

  test("preserves the error from the decoder and cleans up after failure", async () => {
    const { result, worker } = await startOpening()
    worker.reply({
      id: 0,
      type: "error",
      code: "archive-read-failed",
      message: "Bad archive.",
    })
    await expect(result).rejects.toMatchObject({
      code: "archive-read-failed",
      message: "Bad archive.",
    })
    expect(worker.terminate).toHaveBeenCalledTimes(1)
  })

  test("reports worker load failure", async () => {
    const { result, worker } = await startOpening()
    worker.dispatchEvent(new Event("error"))
    await expect(result).rejects.toMatchObject({ code: "archive-read-failed" })
    expect(worker.terminate).toHaveBeenCalledTimes(1)
  })
})

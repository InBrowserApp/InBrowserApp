import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { afterEach, expect, test, vi } from "vitest"
import { NoFileDataError, saveTorrentFile } from "./save-file"
import type { TorrentFile } from "webtorrent"

vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: vi.fn() }))

const contents = new TextEncoder().encode("Sample torrent data")

function file(stream: ReadableStream, length = contents.byteLength) {
  return {
    name: "sample.txt",
    length,
    downloaded: 0,
    stream: () => stream,
  } as Pick<TorrentFile, "name" | "length" | "downloaded" | "stream">
}

function bytes() {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(contents)
      controller.close()
    },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
  vi.clearAllMocks()
})

test("hands the verified file to the browser with its name", async () => {
  const onProgress = vi.fn()
  const result = await saveTorrentFile(
    file(bytes()),
    new AbortController().signal,
    onProgress
  )
  expect(result).toBe("saved")
  expect(onProgress).toHaveBeenCalledWith(100)
  const [blob, name] = vi.mocked(downloadBlob).mock.calls[0]!
  expect(name).toBe("sample.txt")
  expect(new Uint8Array(await blob.arrayBuffer())).toEqual(contents)
})

test("rejects a truncated stream and never saves the partial file", async () => {
  await expect(
    saveTorrentFile(
      file(bytes(), contents.byteLength + 1),
      new AbortController().signal,
      vi.fn()
    )
  ).rejects.toThrow("Incomplete file")
  expect(downloadBlob).not.toHaveBeenCalled()
})

test("streams into the native save destination when available", async () => {
  const write = vi.fn()
  const close = vi.fn()
  const picker = vi.fn(async () => ({
    createWritable: () => new WritableStream({ write, close }),
  }))
  vi.stubGlobal("showSaveFilePicker", picker)

  await expect(
    saveTorrentFile(file(bytes()), new AbortController().signal, vi.fn())
  ).resolves.toBe("written")
  expect(picker).toHaveBeenCalledWith({ suggestedName: "sample.txt" })
  expect(write).toHaveBeenCalledWith(contents, expect.anything())
  expect(close).toHaveBeenCalledOnce()
  expect(downloadBlob).not.toHaveBeenCalled()
})

test("cancels a stalled transfer and closes the source", async () => {
  const cancel = vi.fn()
  const controller = new AbortController()
  const stream = new ReadableStream({ cancel })
  const result = saveTorrentFile(file(stream), controller.signal, vi.fn())

  await Promise.all([
    expect(result).rejects.toMatchObject({ name: "AbortError" }),
    Promise.resolve().then(() => controller.abort()),
  ])
  expect(cancel).toHaveBeenCalledOnce()
  expect(downloadBlob).not.toHaveBeenCalled()
})

test("a stalled source times out even without user cancellation", async () => {
  vi.useFakeTimers()
  const cancel = vi.fn()
  const stream = new ReadableStream({ cancel })

  await Promise.all([
    expect(
      saveTorrentFile(file(stream), new AbortController().signal, vi.fn())
    ).rejects.toBeInstanceOf(NoFileDataError),
    vi.advanceTimersByTimeAsync(60_001),
  ])
  expect(cancel).toHaveBeenCalledOnce()
})

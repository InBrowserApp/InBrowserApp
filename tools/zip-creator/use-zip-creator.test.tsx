import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import { createZip } from "./core/zip"
import { formatBytes } from "./format"
import messages from "./messages/en.json"
import { useZipCreator } from "./use-zip-creator"

import type { Progress, ZipItem } from "./types"

vi.mock("./core/zip", () => ({ createZip: vi.fn() }))
const file = (path = "a.txt"): ZipItem => ({
  path,
  file: new File(["hello"], path),
})
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
beforeEach(() => {
  vi.mocked(createZip)
    .mockReset()
    .mockResolvedValue(new Blob(["zip"]))
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:zip-result")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it("withdraws and revokes completed results on input, option, removal, undo and unmount", async () => {
  const { result: r, unmount } = renderHook(() => useZipCreator(messages))
  await act(async () => {
    await r.current.create()
    r.current.undo()
  })
  expect(createZip).not.toHaveBeenCalled()
  await act(async () => r.current.add(async () => [file()]))
  await act(async () => r.current.create())
  expect(r.current.result?.filename).toBe("archive.zip")
  act(() => r.current.changeFilename("my documents.zip"))
  expect(r.current.result).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:zip-result")
  await act(async () => r.current.create())
  expect(r.current.result?.filename).toBe("my documents.zip")
  act(() => r.current.changeLevel("0"))
  expect(r.current.level).toBe(0)
  expect(r.current.result).toBeNull()
  await act(async () => r.current.create())
  act(() => r.current.remove("a.txt"))
  expect(r.current.items).toEqual([])
  act(() => r.current.undo())
  expect(r.current.items).toHaveLength(1)
  await act(async () => r.current.create())
  act(() => r.current.remove())
  act(() => r.current.undo())
  await act(async () => r.current.create())
  await act(async () => r.current.add(async () => [file("b.txt")]))
  expect(r.current.result).toBeNull()
  expect(r.current.canUndo).toBe(false)
  await act(async () => r.current.create())
  const revokes = vi.mocked(URL.revokeObjectURL).mock.calls.length
  unmount()
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(revokes + 1)
})

it("retains the previous queue/result on unreadable inputs and handles picker dismissal", async () => {
  const { result: r } = renderHook(() => useZipCreator(messages))
  await act(async () => r.current.add(async () => [file()]))
  await act(async () => r.current.create())
  await act(async () =>
    r.current.add(async () => {
      throw new Error("unavailable")
    })
  )
  expect(r.current.error).toBe(messages.readError)
  expect(r.current.items).toHaveLength(1)
  expect(r.current.result).not.toBeNull()
  await act(async () =>
    r.current.add(async () => {
      throw new DOMException("dismissed", "AbortError")
    })
  )
  expect(r.current.error).toBe("")
  await act(async () => r.current.add(async () => [file()]))
  expect(r.current.notice).toBe(messages.renamed)
})

it("locks concurrent additions and ignores cancelled reading work after a new operation", async () => {
  const { result: r } = renderHook(() => useZipCreator(messages))
  const pending = deferred<ZipItem[]>()
  const ignored = vi.fn()
  let old!: Promise<void>
  act(() => {
    old = r.current.add(() => pending.promise)
  })
  expect(r.current.status).toBe("reading")
  await act(async () => r.current.add(ignored))
  expect(ignored).not.toHaveBeenCalled()
  act(() => r.current.cancel())
  expect(r.current.notice).toBe(messages.cancelled)
  await act(async () => r.current.add(async () => [file("new.txt")]))
  await act(async () => {
    pending.resolve([file("old.txt")])
    await old
  })
  expect(r.current.items.map((item) => item.path)).toEqual(["new.txt"])
  expect(r.current.error).toBe("")
})

it("rejects invalid names, reports generation errors and guards cancelled progress/results", async () => {
  const { result: r } = renderHook(() => useZipCreator(messages))
  await act(async () => r.current.add(async () => [file()]))
  act(() => r.current.changeFilename("../invalid"))
  await act(async () => r.current.create())
  expect(createZip).not.toHaveBeenCalled()
  act(() => r.current.changeFilename("valid"))
  vi.mocked(createZip).mockRejectedValueOnce(new Error("memory"))
  await act(async () => r.current.create())
  expect(r.current.error).toBe(messages.createError)
  const pending = deferred<Blob>()
  let progress!: (value: Progress) => void
  let signal!: AbortSignal
  vi.mocked(createZip).mockImplementationOnce(
    (_items, _level, selectedSignal, onProgress) => {
      signal = selectedSignal
      progress = onProgress
      return pending.promise
    }
  )
  let old!: Promise<void>
  act(() => {
    old = r.current.create()
  })
  act(() => progress({ path: "a.txt", percent: 50 }))
  expect(r.current.progress?.percent).toBe(50)
  await act(async () => r.current.create())
  expect(createZip).toHaveBeenCalledTimes(2)
  act(() => r.current.cancel())
  expect(signal.aborted).toBe(true)
  act(() => progress({ path: "a.txt", percent: 99 }))
  expect(r.current.progress).toBeNull()
  await act(async () => {
    pending.resolve(new Blob(["partial"]))
    await old
  })
  expect(r.current.result).toBeNull()
  expect(URL.createObjectURL).not.toHaveBeenCalled()
})

it("aborts pending work when the tool unmounts", async () => {
  const { result: r, unmount } = renderHook(() => useZipCreator(messages))
  let signal!: AbortSignal
  const pending = deferred<ZipItem[]>()
  let old!: Promise<void>
  act(() => {
    old = r.current.add((selected) => {
      signal = selected
      return pending.promise
    })
  })
  unmount()
  expect(signal.aborted).toBe(true)
  await act(async () => {
    pending.reject(new Error("closed"))
    await old
  })
})

it("formats byte counts for the selected language", () => {
  expect(formatBytes(0, "en")).toBe("0 B")
  expect(formatBytes(1024, "en")).toBe("1 KiB")
  expect(formatBytes(1536, "de")).toBe("1,5 KiB")
  expect(formatBytes(1024 ** 5, "en")).toBe("1,024 TiB")
})

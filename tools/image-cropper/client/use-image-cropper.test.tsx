import { act, cleanup, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import messages from "../messages/en.json"
import { INITIAL_TRANSFORM } from "../core/crop"
import { exportImage, loadImage } from "./image"
import { useImageCropper } from "./use-image-cropper"
import type { CropResult, ImageSource } from "./types"

vi.mock("./image", () => ({ loadImage: vi.fn(), exportImage: vi.fn() }))
const file = new File(["image"], "photo.png", { type: "image/png" })
const source = () => ({
  image: {} as ImageBitmap,
  width: 800,
  height: 600,
  dispose: vi.fn(),
})
const output = {
  blob: new Blob(["result"], { type: "image/png" }),
  name: "photo-cropped.png",
  width: 600,
  height: 600,
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(loadImage).mockResolvedValue(source())
  vi.mocked(exportImage).mockResolvedValue(output)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:result")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

async function open() {
  const hook = renderHook(() => useImageCropper(messages))
  act(() => hook.result.current.changeFile(file))
  await waitFor(() => expect(hook.result.current.source).not.toBeNull())
  return hook
}

describe("image cropper lifecycle", () => {
  it("ignores export without an image and safely handles settings before loading", async () => {
    const { result } = renderHook(() => useImageCropper(messages))
    act(() => {
      result.current.changeRatio("original")
      result.current.changeTransform({ ...INITIAL_TRANSFORM, rotation: 90 })
      result.current.reset()
    })
    await act(() => result.current.runExport())
    expect(exportImage).not.toHaveBeenCalled()
  })

  it("changes ratios/transforms and resets to native image dimensions", async () => {
    const { result } = await open()
    act(() => result.current.changeRatio("1"))
    expect(result.current.crop.width).toBe(75)
    expect(result.current.aspect).toBe(1)
    act(() =>
      result.current.changeTransform({ ...INITIAL_TRANSFORM, rotation: 90 })
    )
    expect(result.current.size).toEqual({ width: 600, height: 800 })
    expect(result.current.crop.height).toBe(75)
    act(() => result.current.changeRatio("original"))
    expect(result.current.aspect).toBe(0.75)
    act(() =>
      result.current.changeTransform({ ...INITIAL_TRANSFORM, rotation: 180 })
    )
    expect(result.current.crop.width).toBe(100)
    act(() => result.current.changeRatio("free"))
    expect(result.current.aspect).toBeUndefined()
    act(() =>
      result.current.changeCrop({
        unit: "%",
        x: 10,
        y: 10,
        width: 20,
        height: 20,
      })
    )
    act(() => result.current.reset())
    expect(result.current.crop).toEqual({
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    })
    expect(result.current.transform).toEqual(INITIAL_TRANSFORM)
  })

  it("exports and revokes stale result URLs when any edit changes output", async () => {
    const { result, unmount } = await open()
    act(() => result.current.changeFormat("image/jpeg"))
    act(() => result.current.changeQuality(80))
    await act(() => result.current.runExport())
    expect(exportImage).toHaveBeenCalledWith(
      expect.anything(),
      "photo.png",
      expect.anything(),
      INITIAL_TRANSFORM,
      "image/jpeg",
      80
    )
    expect(result.current.resultUrl).toBe("blob:result")
    act(() => result.current.changeQuality(90))
    expect(result.current.result).toBeNull()
    expect(result.current.resultUrl).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:result")
    await act(() => result.current.runExport())
    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
  })

  it("reports decode, preview, and export failures and recovers after replacement", async () => {
    vi.mocked(loadImage).mockRejectedValueOnce(new Error())
    const hook = renderHook(() => useImageCropper(messages))
    act(() => hook.result.current.changeFile(file))
    await waitFor(() =>
      expect(hook.result.current.error).toBe(messages.invalidImage)
    )
    expect(hook.result.current.errorTarget).toBe("source")
    act(() =>
      hook.result.current.changeFile(
        new File(["image"], "next.png", { type: "image/png" })
      )
    )
    await waitFor(() => expect(hook.result.current.source).not.toBeNull())
    expect(hook.result.current.error).toBeNull()
    act(() => hook.result.current.previewError())
    expect(hook.result.current.error).toBe(messages.previewError)
    expect(hook.result.current.errorTarget).toBe("source")
    vi.mocked(exportImage).mockRejectedValueOnce(new Error())
    await act(() => hook.result.current.runExport())
    expect(hook.result.current.error).toBe(messages.exportError)
    expect(hook.result.current.errorTarget).toBe("export")
    expect(hook.result.current.processing).toBe(false)
    act(() => hook.result.current.changeFile(null))
    expect(hook.result.current.error).toBeNull()
    expect(hook.result.current.errorTarget).toBeUndefined()
    expect(hook.result.current.source).toBeNull()
  })

  it.each(["resolve", "reject"] as const)(
    "ignores an old decoder's %s after replacing the file",
    async (finish) => {
      const pending = deferred<ImageSource>()
      vi.mocked(loadImage).mockReturnValueOnce(pending.promise)
      const { result, unmount } = renderHook(() => useImageCropper(messages))
      act(() => result.current.changeFile(file))
      expect(result.current.loading).toBe(true)
      act(() => result.current.changeFile(null))
      const obsolete = source()
      await act(async () => {
        if (finish === "resolve") pending.resolve(obsolete)
        else pending.reject(new Error())
        await pending.promise.catch(() => {})
      })
      expect(result.current.source).toBeNull()
      expect(result.current.error).toBeNull()
      expect(obsolete.dispose).toHaveBeenCalledTimes(
        finish === "resolve" ? 1 : 0
      )
      unmount()
    }
  )

  it.each(["resolve", "reject"] as const)(
    "ignores an old export's %s after an edit",
    async (finish) => {
      const { result } = await open()
      const pending = deferred<CropResult>()
      vi.mocked(exportImage).mockReturnValueOnce(pending.promise)
      let exporting!: Promise<void>
      act(() => {
        exporting = result.current.runExport()
      })
      expect(result.current.processing).toBe(true)
      act(() => result.current.reset())
      await act(async () => {
        if (finish === "resolve") pending.resolve(output)
        else pending.reject(new Error())
        await exporting
      })
      expect(result.current.result).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.processing).toBe(false)
    }
  )
})

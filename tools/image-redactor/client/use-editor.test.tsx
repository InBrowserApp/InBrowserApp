import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import messages from "../messages/en.json"
import { createRegion } from "../core/geometry"
import type { Source, Tool } from "../types"
import { exportImage } from "../render"
import { exampleSource, loadSource } from "./image-source"
import { useEditor } from "./use-editor"

vi.mock("../render", () => ({ exportImage: vi.fn() }))
vi.mock("./image-source", () => ({
  exampleSource: vi.fn(),
  loadSource: vi.fn(),
}))

const source: Source = {
  image: document.createElement("canvas"),
  name: "sample.png",
  width: 1000,
  height: 600,
}
const file = new File(["image"], "sample.png", { type: "image/png" })
function setup() {
  const hook = renderHook(() => useEditor(messages))
  act(() => hook.result.current.example())
  return hook
}
function select(hook: ReturnType<typeof setup>) {
  const region = createRegion(
    "one",
    "rectangle",
    { x: 10, y: 20 },
    { x: 110, y: 80 },
    hook.result.current.style
  )
  act(() => {
    hook.result.current.commit([region])
    hook.result.current.setSelectedId("one")
  })
  return region
}

beforeEach(() => {
  vi.mocked(exampleSource).mockReturnValue(source)
  vi.mocked(loadSource).mockResolvedValue(source)
  vi.mocked(exportImage).mockResolvedValue(
    new Blob(["png"], { type: "image/png" })
  )
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("image redactor editor", () => {
  it("starts with solid rectangles and does nothing without a source", async () => {
    const { result } = renderHook(() => useEditor(messages))
    expect(result.current.style.effect).toBe("solid")
    expect(result.current.tool).toBe("rectangle")
    await act(async () => {
      await result.current.load(undefined)
      await result.current.save()
    })
    act(() => {
      result.current.updateSelected({ x: 1 })
      result.current.remove()
      result.current.commit()
      result.current.addRegion()
      result.current.cycleRegion(1)
    })
    expect(loadSource).not.toHaveBeenCalled()
    expect(exportImage).not.toHaveBeenCalled()
  })
  it.each(["rectangle", "ellipse", "brush", "pan"] as const)(
    "clears selection when choosing %s without changing existing regions",
    (tool) => {
      const hook = setup()
      const region = select(hook)
      act(() => hook.result.current.chooseTool(tool))
      expect(hook.result.current.tool).toBe(tool)
      expect(hook.result.current.selected).toBeNull()
      act(() => hook.result.current.changeStyle({ effect: "blur" }))
      expect(hook.result.current.regions).toEqual([region])
    }
  )
  it.each<Tool>(["rectangle", "ellipse", "brush", "select", "pan"])(
    "creates a centered region from %s, ready for keyboard editing",
    (tool) => {
      const hook = setup()
      act(() => hook.result.current.chooseTool(tool))
      act(() => hook.result.current.addRegion())
      const region = hook.result.current.selected!
      expect(region.shape).toBe(
        tool === "select" || tool === "pan" ? "rectangle" : tool
      )
      expect(region.x + region.width / 2).toBe(source.width / 2)
      expect(region.y + region.height / 2).toBe(source.height / 2)
      expect(hook.result.current.tool).toBe("select")
      act(() => hook.result.current.undo())
      expect(hook.result.current.regions).toEqual([])
    }
  )
  it("cycles regions in both directions without adding history", () => {
    const hook = setup()
    const first = select(hook)
    const second = { ...first, id: "two", x: 120 }
    act(() => hook.result.current.commit([first, second]))
    act(() => hook.result.current.chooseTool("pan"))
    const regions = hook.result.current.regions
    act(() => hook.result.current.cycleRegion(1))
    expect(hook.result.current.selected?.id).toBe("one")
    act(() => hook.result.current.chooseTool("pan"))
    act(() => hook.result.current.cycleRegion(-1))
    expect(hook.result.current.selected?.id).toBe("two")
    expect(hook.result.current.tool).toBe("select")
    act(() => hook.result.current.cycleRegion(1))
    expect(hook.result.current.selected?.id).toBe("one")
    act(() => hook.result.current.cycleRegion(-1))
    expect(hook.result.current.selected?.id).toBe("two")
    expect(hook.result.current.regions).toBe(regions)
    act(() => hook.result.current.undo())
    expect(hook.result.current.regions).toEqual([first])
  })
  it("makes style previews one undoable edit, and updates the drawing defaults", () => {
    const hook = setup()
    select(hook)
    act(() =>
      hook.result.current.changeStyle({ effect: "blur", strength: 30 }, true)
    )
    act(() => hook.result.current.changeStyle({ strength: 40 }, true))
    act(() => hook.result.current.commit())
    expect(hook.result.current.selected?.strength).toBe(40)
    act(() => hook.result.current.undo())
    expect(hook.result.current.selected?.effect).toBe("solid")
    act(() => hook.result.current.redo())
    expect(hook.result.current.selected?.effect).toBe("blur")
    act(() => hook.result.current.changeStyle({ effect: "pixelate" }))
    expect(hook.result.current.style.effect).toBe("pixelate")
  })
  it("cancels drafts, deletes, and restores deleted regions", () => {
    const hook = setup()
    const region = select(hook)
    act(() => hook.result.current.updateSelected({ x: 25 }))
    expect(hook.result.current.selected?.x).toBe(25)
    act(() => hook.result.current.preview([{ ...region, x: 90 }]))
    act(() => hook.result.current.cancel())
    expect(hook.result.current.selected?.x).toBe(25)
    act(() => hook.result.current.preview([{ ...region, x: 100 }]))
    act(() => hook.result.current.undo())
    expect(hook.result.current.selected?.x).toBe(10)
    act(() => hook.result.current.remove())
    expect(hook.result.current.regions).toEqual([])
    expect(hook.result.current.selected).toBeNull()
    act(() => hook.result.current.undo())
    expect(hook.result.current.regions).toHaveLength(1)
    act(() => hook.result.current.example())
    expect(hook.result.current.canUndo).toBe(false)
  })
  it("keeps a valid current image on decode failure and clears errors on success", async () => {
    const hook = setup()
    vi.mocked(loadSource).mockRejectedValueOnce(new Error("decode failed"))
    await act(async () => hook.result.current.load(file))
    expect(hook.result.current.error).toBe(messages.imageError)
    expect(hook.result.current.source).toBe(source)
    await act(async () => hook.result.current.load(file))
    expect(hook.result.current.error).toBe("")
    expect(hook.result.current.loading).toBe(false)
  })
  it("ignores stale loads, stale failures, and loads completed after unmount", async () => {
    const hook = setup()
    let resolve!: (value: Source) => void
    let reject!: (error: Error) => void
    vi.mocked(loadSource).mockReturnValueOnce(
      new Promise((r) => {
        resolve = r
      })
    )
    let first!: Promise<void>
    act(() => {
      first = hook.result.current.load(file)
    })
    await act(async () => hook.result.current.load(file))
    await act(async () => {
      resolve({ ...source, name: "old.png" })
      await first
    })
    expect(hook.result.current.source?.name).toBe("sample.png")
    vi.mocked(loadSource).mockReturnValueOnce(
      new Promise((_r, j) => {
        reject = j
      })
    )
    act(() => {
      first = hook.result.current.load(file)
    })
    act(() => hook.result.current.example())
    await act(async () => {
      reject(new Error("old failure"))
      await first
    })
    expect(hook.result.current.error).toBe("")
    vi.mocked(loadSource).mockReturnValueOnce(
      new Promise((r) => {
        resolve = r
      })
    )
    act(() => {
      first = hook.result.current.load(file)
    })
    hook.unmount()
    await act(async () => {
      resolve(source)
      await first
    })
    expect(loadSource).toHaveBeenCalledTimes(4)
  })
  it.each([
    ["png", "png"],
    ["jpeg", "jpg"],
    ["webp", "webp"],
  ])("downloads %s with its actual extension", async (format, extension) => {
    vi.useFakeTimers()
    const hook = setup()
    select(hook)
    const clicked: string[] = []
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      clicked.push(this.download)
    })
    vi.mocked(exportImage).mockResolvedValue(
      new Blob(["result"], { type: `image/${format}` })
    )
    act(() => {
      hook.result.current.setFormat(format)
      hook.result.current.setQuality(85)
    })
    await act(async () => hook.result.current.save())
    expect(clicked).toEqual([`sample-redacted.${extension}`])
    expect(exportImage).toHaveBeenLastCalledWith(
      source,
      hook.result.current.regions,
      format,
      85
    )
    expect(hook.result.current.busy).toBe(false)
    act(() => vi.runAllTimers())
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:export")
  })
  it("copies a flattened PNG and reports clipboard/export failures", async () => {
    const hook = setup()
    const write = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue({
      write,
    } as unknown as Clipboard)
    vi.stubGlobal(
      "ClipboardItem",
      class {
        constructor(public values: Record<string, Blob>) {}
      }
    )
    await act(async () => hook.result.current.save(true))
    expect(write).toHaveBeenCalledTimes(1)
    expect(hook.result.current.copied).toBe(true)
    write.mockRejectedValueOnce(new Error("denied"))
    await act(async () => hook.result.current.save(true))
    expect(hook.result.current.error).toBe(messages.copyError)
    vi.mocked(exportImage).mockRejectedValueOnce(new Error("encode failed"))
    await act(async () => hook.result.current.save())
    expect(hook.result.current.error).toBe(messages.exportError)
  })
})

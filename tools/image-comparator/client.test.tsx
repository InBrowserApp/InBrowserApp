import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ImageComparator from "./client"
import type { DifferenceReply, DifferenceRequest } from "./difference.worker"
import messages from "./messages/en.json"

function bitmap(width = 2, height = 2) {
  return { width, height, close: vi.fn() } as unknown as ImageBitmap
}

class TestWorker {
  static latest: TestWorker
  onmessage?: (event: { data: DifferenceReply }) => void
  onerror?: (event: { preventDefault: () => void }) => void
  postMessage = vi.fn<(request: DifferenceRequest) => void>()
  terminate = vi.fn()

  constructor() {
    TestWorker.latest = this
  }
}

const decode = vi.fn<(file: Blob) => Promise<ImageBitmap>>()

beforeEach(() => {
  decode.mockReset().mockImplementation(async () => bitmap())
  vi.stubGlobal("createImageBitmap", decode)
  vi.stubGlobal("Worker", TestWorker)
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
    drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function open(input: HTMLElement, name: string) {
  const file = new File(["data"], name, { type: "image/png" })
  fireEvent.change(input, { target: { files: [file] } })
  return file
}

function setup() {
  const { container } = render(
    <ImageComparator lang="en" messages={messages} />
  )
  const [before, after] =
    container.querySelectorAll<HTMLInputElement>('input[type="file"]')
  return { before: before!, after: after! }
}

async function openPair() {
  const inputs = setup()
  const before = open(inputs.before, "before.png")
  const after = open(inputs.after, "after.png")
  await screen.findByRole("slider", { name: messages.divider })
  return { ...inputs, files: { before, after } }
}

describe("Image Comparator", () => {
  it("keeps the images and divider position across comparison modes", async () => {
    await openPair()
    const divider = screen.getByRole<HTMLInputElement>("slider", {
      name: messages.divider,
    })
    fireEvent.change(divider, { target: { value: "30" } })
    expect(divider.value).toBe("30")
    fireEvent.click(screen.getByText(messages.overlay))
    expect(
      screen
        .getByRole("slider", { name: messages.opacity })
        .getAttribute("aria-valuenow")
    ).toBe("50")
    fireEvent.click(screen.getByText(messages.slider))
    expect(
      screen.getByRole<HTMLInputElement>("slider", { name: messages.divider })
        .value
    ).toBe("30")
    expect(decode).toHaveBeenCalledTimes(2)
  })

  it("keeps the last valid image when a replacement fails and ignores obsolete decodes", async () => {
    const { before } = await openPair()
    let resolveObsolete: (decoded: ImageBitmap) => void = () => {}
    decode.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveObsolete = resolve
        })
    )
    open(before, "old-pending.png")
    expect(screen.getByText(messages.loadingImage)).toBeTruthy()
    decode.mockRejectedValueOnce(new Error("Invalid image"))
    open(before, "broken.png")
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidImage
    )
    expect(screen.getByText("before.png")).toBeTruthy()

    const obsolete = bitmap()
    await act(async () => resolveObsolete(obsolete))
    expect(obsolete.close).toHaveBeenCalledOnce()
    expect(screen.queryByText("old-pending.png")).toBeNull()
  })

  it("explains when pixel comparison is unavailable and recovers after replacing the image", async () => {
    decode.mockResolvedValueOnce(bitmap(3, 2))
    const { after, files } = await openPair()
    fireEvent.click(screen.getByText(messages.difference))
    expect(screen.getByText(messages.differentSizes)).toBeTruthy()
    decode.mockResolvedValueOnce(bitmap(3, 2))
    const replacement = open(after, "matching.png")
    await screen.findByText(messages.diffLoading)

    const worker = TestWorker.latest
    expect(worker.postMessage).toHaveBeenCalledTimes(2)
    expect(decode).toHaveBeenNthCalledWith(1, files.before)
    expect(decode).toHaveBeenNthCalledWith(3, replacement)
    expect(worker.postMessage).toHaveBeenLastCalledWith(0)

    const output = bitmap(3, 2)
    act(() =>
      worker.onmessage?.({
        data: { type: "result", tolerance: 0, bitmap: output, changed: 3 },
      })
    )
    expect(await screen.findByText("50%")).toBeTruthy()
    expect(screen.getByRole("status").textContent).toContain("3 / 6")

    fireEvent.click(screen.getByText(messages.slider))
    expect(worker.terminate).toHaveBeenCalledOnce()
    expect(output.close).toHaveBeenCalledOnce()
  })

  it("keeps visual comparison available if the diff worker fails", async () => {
    await openPair()
    fireEvent.click(screen.getByText(messages.difference))
    act(() => TestWorker.latest.onmessage?.({ data: { type: "error" } }))
    expect(await screen.findByText(messages.diffError)).toBeTruthy()
    fireEvent.click(screen.getByText(messages.overlay))
    expect(screen.getByRole("slider", { name: messages.opacity })).toBeTruthy()
    await waitFor(() =>
      expect(screen.queryByText(messages.diffError)).toBeNull()
    )
  })
})

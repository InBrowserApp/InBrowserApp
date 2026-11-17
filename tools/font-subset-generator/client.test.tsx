import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import FontSubsetClient from "./client"
import { processFont } from "./client/processor"
import messages from "./messages/en.json"
import type { SubsetOutput } from "./types"

vi.mock("./client/processor", () => ({ processFont: vi.fn() }))
const process = vi.mocked(processFont)
const output: SubsetOutput = {
  output: new ArrayBuffer(100),
  extension: "ttf",
  glyphCount: 4,
  originalGlyphCount: 200,
  weight: "400",
  style: "normal",
  missing: [],
  unicodes: [65, 66, 67],
}
const revoke = vi.fn()
const load = vi.fn()
const addFont = vi.fn()
const deleteFont = vi.fn()

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal(
    "FontFace",
    class {
      load = load
    }
  )
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { add: addFont, delete: deleteFont },
  })
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:font-subset")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(revoke)
  load.mockResolvedValue({})
  process.mockResolvedValue(output)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function open() {
  render(<FontSubsetClient messages={messages} lang="en" />)
}
function choose(name = "Demo.ttf", size = 2048) {
  fireEvent.change(
    screen.getByLabelText(messages.chooseFile, { selector: "input" }),
    { target: { files: [new File([new Uint8Array(size)], name)] } }
  )
}
function enter(text = "ABC") {
  fireEvent.change(screen.getByRole("textbox", { name: messages.textTitle }), {
    target: { value: text },
  })
}
function generate() {
  fireEvent.click(screen.getByRole("button", { name: messages.generate }))
}
async function ready() {
  return await screen.findByRole("link", { name: messages.downloadFont })
}

describe("Font Subset Generator interactions", () => {
  it("validates missing font and empty text, focuses text and adds the basic Latin preset", () => {
    open()
    generate()
    expect(screen.getByRole("alert").textContent).toContain(
      messages.invalidFont
    )
    choose()
    generate()
    expect(screen.getByRole("alert").textContent).toContain(messages.emptyText)
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: messages.textTitle })
    )
    fireEvent.click(screen.getByRole("button", { name: messages.addAscii }))
    expect(
      (screen.getByRole("textbox") as HTMLTextAreaElement).value
    ).toHaveLength(95)
    expect(screen.getByText(`${messages.uniqueCharacters}: 95`)).toBeTruthy()
  })
  it("generates actual-output preview, sizes, matching downloads and CSS, and cleans up", async () => {
    open()
    choose()
    enter()
    generate()
    const link = await ready()
    expect(link.getAttribute("download")).toBe("Demo.subset.woff2")
    expect(
      screen
        .getByRole("link", { name: messages.downloadCss })
        .getAttribute("download")
    ).toBe("Demo.subset.css")
    expect(screen.getByText("95.1%")).toBeTruthy()
    expect(screen.getAllByText("2 KiB")).toHaveLength(2)
    expect(screen.getByText("100 B")).toBeTruthy()
    await waitFor(() => expect(addFont).toHaveBeenCalledOnce())
    expect(screen.getByTestId("font-subset-preview").textContent).toBe("ABC")
    expect(screen.getByText(/font-display: swap/).textContent).toContain(
      "U+41-43"
    )
    enter("AB")
    expect(
      screen.queryByRole("link", { name: messages.downloadFont })
    ).toBeNull()
    expect(revoke).toHaveBeenCalledTimes(2)
    expect(deleteFont).toHaveBeenCalledOnce()
  })
  it("reports missing source characters and a preview failure while retaining downloads", async () => {
    process.mockResolvedValue({
      ...output,
      missing: [0x4e2d],
      output: new ArrayBuffer(4000),
    })
    load.mockRejectedValue(new Error("Font loading failed"))
    open()
    choose()
    enter("ABC中")
    generate()
    await ready()
    expect(screen.getByText(messages.missingTitle)).toBeTruthy()
    expect(screen.getByText("中 (U+4E2D)")).toBeTruthy()
    expect(screen.getByText(messages.noReduction)).toBeTruthy()
    expect(await screen.findByText(messages.previewError)).toBeTruthy()
  })
  it("cancels a pending job and ignores its late completion", async () => {
    let resolve!: (value: SubsetOutput) => void
    process.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    open()
    choose()
    enter()
    generate()
    const signal = process.mock.calls[0]![2]
    fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
    expect(signal.aborted).toBe(true)
    await act(async () => {
      resolve(output)
    })
    expect(
      screen.queryByRole("link", { name: messages.downloadFont })
    ).toBeNull()
    expect(screen.queryByRole("alert")).toBeNull()
    generate()
    await ready()
  })
  it("keeps downloads available when the browser cannot construct a preview face", async () => {
    vi.stubGlobal(
      "FontFace",
      class {
        constructor() {
          throw new Error("Unsupported font descriptor")
        }
      }
    )
    open()
    choose()
    enter()
    generate()
    await ready()
    expect(await screen.findByText(messages.previewError)).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadCss })
    ).toBeTruthy()
  })
  it("aborts on replacement and unmount, and does not surface canceled errors", async () => {
    let reject!: (reason: unknown) => void
    process.mockImplementationOnce(
      () =>
        new Promise((_, fail) => {
          reject = fail
        })
    )
    open()
    choose()
    enter()
    generate()
    const signal = process.mock.calls[0]![2]
    choose("replacement.otf", 3 * 1024 ** 2)
    expect(screen.getByText("3 MiB")).toBeTruthy()
    expect(signal.aborted).toBe(true)
    await act(async () => {
      reject(new Error("aborted"))
    })
    expect(screen.queryByRole("alert")).toBeNull()
    process.mockImplementationOnce(() => new Promise(() => {}))
    generate()
    const next = process.mock.calls[1]![2]
    cleanup()
    expect(next.aborted).toBe(true)
  })
  it.each([
    [new Error("INVALID_FONT"), "invalidFont"],
    [new Error("NO_CHARACTERS"), "noCharacters"],
    [new Error("WORKER_ERROR"), "workerError"],
    [new Error("broken font"), "generationError"],
    [new RangeError("bad bytes"), "invalidFont"],
    [new TypeError("bad bytes"), "invalidFont"],
    ["unknown", "generationError"],
  ] as const)("localizes a processing error: %s", async (error, key) => {
    process.mockRejectedValueOnce(error)
    open()
    choose()
    enter()
    generate()
    expect((await screen.findByRole("alert")).textContent).toContain(
      messages[key]
    )
    expect(
      screen.queryByRole("link", { name: messages.downloadFont })
    ).toBeNull()
  })
  it("supports keyboard file picking, drag/drop, cancellation of a picker and removal", () => {
    open()
    const input = screen.getByLabelText(messages.chooseFile, {
      selector: "input",
    })
    const click = vi.spyOn(input as HTMLInputElement, "click")
    const dropzone = screen.getByRole("button", { name: messages.chooseFile })
    fireEvent.click(dropzone)
    expect(click).toHaveBeenCalledOnce()
    fireEvent.dragOver(dropzone)
    fireEvent.dragLeave(dropzone)
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [new File(["font"], "drop.ttf")] },
    })
    expect(screen.getByText("drop.ttf")).toBeTruthy()
    fireEvent.drop(screen.getByRole("button", { name: messages.replaceFile }), {
      dataTransfer: { files: [] },
    })
    fireEvent.change(input, { target: { files: [] } })
    expect(screen.getByText("drop.ttf")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.removeFile }))
    expect(screen.queryByText("drop.ttf")).toBeNull()
  })
  it("clears a previous download when output format changes", async () => {
    open()
    choose()
    enter()
    generate()
    await ready()
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" })
    fireEvent.click(
      await screen.findByRole("option", { name: messages.sfntOption })
    )
    expect(
      screen.queryByRole("link", { name: messages.downloadFont })
    ).toBeNull()
    generate()
    await ready()
    expect(process.mock.calls.at(-1)![1].format).toBe("sfnt")
    expect(
      screen
        .getByRole("link", { name: messages.downloadFont })
        .getAttribute("download")
    ).toBe("Demo.subset.ttf")
  })
})

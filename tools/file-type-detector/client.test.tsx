import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import FileTypeDetectorClient from "./client"
import { inspectFile } from "./core/inspect"
import messages from "./messages/en.json"
import type { Inspection } from "./types"

vi.mock("./core/inspect", () => ({ inspectFile: vi.fn() }))

const result: Inspection = {
  fileName: "sample.jpg",
  fileSize: 68,
  browserMime: "image/jpeg",
  extension: "jpg",
  detected: { ext: "png", mime: "image/png" },
  extensions: ["png"],
  status: "mismatch",
  hex: "00000000  89 50 4E 47  |.PNG|",
}
const inspect = vi.mocked(inspectFile)
const input = () => screen.getByLabelText(messages.inputTitle)
const select = () =>
  fireEvent.change(input(), {
    target: { files: [new File(["data"], "sample.jpg")] },
  })
const mount = () =>
  render(<FileTypeDetectorClient language="en" messages={messages} />)

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
beforeEach(() => {
  inspect.mockReset()
  inspect.mockResolvedValue(result)
})

describe("file type detector", () => {
  test("starts empty, accepts any file, and exposes a keyboard-accessible picker", () => {
    mount()
    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(input().hasAttribute("accept")).toBe(false)
    expect(
      (
        screen.getByRole("button", {
          name: messages.copyReport,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    const click = vi.spyOn(input(), "click")
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.dropLabel} ${messages.inputHint}`,
      })
    )
    expect(click).toHaveBeenCalledOnce()
    fireEvent.change(input(), { target: { files: [] } })
    expect(inspect).not.toHaveBeenCalled()
  })

  test("loads a file and copies a report and its actual hex preview", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", { clipboard: { writeText } })
    mount()
    select()
    await screen.findByText(messages.status.mismatch)
    expect(screen.getByText("image/png")).toBeTruthy()
    expect(screen.getByText("image/jpeg")).toBeTruthy()
    expect(screen.getByText(messages.hexTitle)).toBeTruthy()
    expect((input() as HTMLInputElement).value).toBe("")
    fireEvent.click(screen.getByRole("button", { name: messages.copyReport }))
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining(
          "sample.jpg\nFile Size: 68 B\nExtension Mismatch"
        )
      )
    )
    fireEvent.click(screen.getByRole("button", { name: messages.copyHex }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(result.hex))
    const click = vi.spyOn(input(), "click")
    fireEvent.click(screen.getByRole("button", { name: messages.change }))
    expect(click).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole("button", { name: messages.clear }))
    expect(screen.queryByText(messages.hexTitle)).toBeNull()
    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
  })

  test("provides a renamed PNG example entirely locally", async () => {
    mount()
    fireEvent.click(screen.getByRole("button", { name: messages.example }))
    await screen.findByText(messages.status.mismatch)
    const file = inspect.mock.calls[0]![0]
    expect(file.name).toBe("sample.jpg")
    expect(file.type).toBe("image/jpeg")
    expect(new Uint8Array(await file.arrayBuffer()).slice(0, 4)).toEqual(
      new Uint8Array([137, 80, 78, 71])
    )
  })

  test("supports dragging, leaving, dropping and an empty drop", async () => {
    mount()
    const drop = screen.getByRole("button", {
      name: `${messages.dropLabel} ${messages.inputHint}`,
    })
    fireEvent.dragOver(drop)
    expect(drop.className).toContain("border-foreground/40")
    fireEvent.dragLeave(drop)
    expect(drop.className).not.toContain("border-foreground/40")
    fireEvent.drop(drop, { dataTransfer: { files: [] } })
    expect(inspect).not.toHaveBeenCalled()
    fireEvent.drop(drop, {
      dataTransfer: { files: [new File(["data"], "sample.jpg")] },
    })
    await screen.findByText(messages.status.mismatch)
  })

  test.each(["empty", "unknown", "missing"] as const)(
    "renders the %s state without invented MIME or bytes",
    async (status) => {
      inspect.mockResolvedValue({
        ...result,
        status,
        detected: null,
        extensions: [],
        extension: "",
        browserMime: "",
        hex: "",
      })
      mount()
      select()
      await screen.findByText(messages.status[status])
      expect(screen.getByText(messages.hexEmpty)).toBeTruthy()
      expect(screen.getByText(messages.noExtension)).toBeTruthy()
      expect(screen.getByText(messages.notReported)).toBeTruthy()
      expect(screen.getAllByText(messages.unknownType)).toHaveLength(2)
    }
  )

  test("shows an actionable error and permits retrying the same file", async () => {
    inspect.mockRejectedValueOnce(new Error("read failed"))
    mount()
    select()
    await screen.findByText(messages.readError)
    select()
    await screen.findByText(messages.status.mismatch)
    expect(screen.queryByText(messages.readError)).toBeNull()
  })

  test.each(["resolve", "reject"] as const)(
    "ignores a stale %s after clearing or selecting a newer file",
    async (outcome) => {
      let resolve!: (value: Inspection) => void
      let reject!: (error: Error) => void
      inspect.mockImplementationOnce(
        () =>
          new Promise((res, rej) => {
            resolve = res
            reject = rej
          })
      )
      mount()
      select()
      await screen.findByText(messages.loading)
      await waitFor(() => expect(inspect).toHaveBeenCalledOnce())
      fireEvent.click(screen.getByRole("button", { name: messages.clear }))
      if (outcome === "reject") select()
      await act(async () => {
        if (outcome === "resolve") resolve(result)
        else reject(new Error("stale"))
      })
      if (outcome === "resolve")
        expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
      else await screen.findByText(messages.status.mismatch)
      expect(screen.queryByText(messages.readError)).toBeNull()
    }
  )

  test("ignores pending results after unmount", async () => {
    let resolve!: (value: Inspection) => void
    inspect.mockImplementationOnce(
      () =>
        new Promise((res) => {
          resolve = res
        })
    )
    const view = mount()
    select()
    await waitFor(() => expect(inspect).toHaveBeenCalledOnce())
    view.unmount()
    await act(async () => resolve(result))
    expect(screen.queryByText(messages.resultTitle)).toBeNull()
  })
})

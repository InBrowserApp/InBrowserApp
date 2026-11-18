import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"
import chineseMessages from "./messages/zh-CN.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderTool() {
  const view = render(<Client messages={messages} lang="en" />)
  return {
    ...view,
    input: screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.paste,
    }),
    output: screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.converted,
    }),
    convert: screen.getByRole<HTMLButtonElement>("button", {
      name: messages.convert,
    }),
    source: screen.getByRole<HTMLSelectElement>("combobox", {
      name: messages.input,
    }),
    target: screen.getByRole<HTMLSelectElement>("combobox", {
      name: messages.output,
    }),
  }
}

describe("Bibliography Converter", () => {
  it("loads the example, checks for duplicates, copies and clears stale output", async () => {
    const clipboard = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    const { convert, output, source, target } = renderTool()
    expect(convert.disabled).toBe(true)
    fireEvent.change(source, { target: { value: "json" } })
    fireEvent.click(screen.getByRole("button", { name: messages.example }))
    expect(source.value).toBe("auto")
    fireEvent.click(convert)

    expect(await screen.findByText("Entries: 3")).toBeTruthy()
    expect(
      screen.getByText("Entries 1 and 2 · " + messages.byMetadata)
    ).toBeTruthy()
    expect(output.value.match(/TY  -/g)).toHaveLength(3)
    expect(
      (
        await screen.findByRole("link", { name: messages.download })
      ).getAttribute("download")
    ).toBe("references.ris")
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByText(messages.copied)
    expect(clipboard).toHaveBeenCalledWith(output.value)

    fireEvent.change(target, { target: { value: "json" } })
    expect(output.value).toBe("")
    expect(screen.queryByText(messages.copied)).toBeNull()
    expect(screen.queryByText(messages.duplicates)).toBeNull()
    fireEvent.click(convert)
    await screen.findByText("Entries: 3")
    expect(JSON.parse(output.value)).toHaveLength(3)
  })

  it("separates adjacent entry numbers in Chinese", async () => {
    render(<Client messages={chineseMessages} lang="zh-CN" />)
    fireEvent.click(
      screen.getByRole("button", { name: chineseMessages.example })
    )
    fireEvent.click(
      screen.getByRole("button", { name: chineseMessages.convert })
    )
    expect(await screen.findByText(/条目 1和2/)).toBeTruthy()
  })

  it("retains invalid input and recovers after editing", async () => {
    const { convert, input } = renderTool()
    fireEvent.change(input, { target: { value: "@article{invalid," } })
    fireEvent.click(convert)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.inputError
    )
    expect(input.value).toBe("@article{invalid,")
    expect(input.getAttribute("aria-invalid")).toBe("true")

    fireEvent.change(input, {
      target: { value: "@book{b,title={Field notes}}" },
    })
    expect(screen.queryByRole("alert")).toBeNull()
    fireEvent.click(convert)
    expect(await screen.findByText("Entries: 1")).toBeTruthy()
    expect(screen.getByText(messages.noDuplicates)).toBeTruthy()
  })

  it("reads a file using auto detection and preserves input on a read failure", async () => {
    const { container, convert, input, source } = renderTool()
    const picker =
      container.querySelector<HTMLInputElement>('input[type="file"]')!
    const open = vi.spyOn(picker, "click")
    fireEvent.click(screen.getByRole("button", { name: messages.open }))
    expect(open).toHaveBeenCalled()
    fireEvent.change(source, { target: { value: "ris" } })
    const file = new File(
      ['[{"type":"book","id":1,"title":"Field notes"}]'],
      "refs.json"
    )
    fireEvent.change(picker, { target: { files: [file] } })
    await waitFor(() => expect(input.value).toContain("Field notes"))
    expect(source.value).toBe("auto")
    fireEvent.click(convert)
    await screen.findByText("Entries: 1")

    vi.spyOn(file, "text").mockRejectedValueOnce(new Error("unreadable"))
    fireEvent.change(picker, { target: { files: [file] } })
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.fileError
    )
    expect(input.value).toContain("Field notes")
  })

  it("ignores a file that finishes reading after the user edits the input", async () => {
    const { container, input } = renderTool()
    const picker =
      container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(["old"], "old.txt")
    let finish!: (text: string) => void
    const read = new Promise<string>((resolve) => {
      finish = resolve
    })
    vi.spyOn(file, "text").mockReturnValueOnce(read)
    fireEvent.change(picker, { target: { files: [file] } })
    fireEvent.change(input, { target: { value: "new" } })
    finish("old")
    await read
    expect(input.value).toBe("new")
  })
})

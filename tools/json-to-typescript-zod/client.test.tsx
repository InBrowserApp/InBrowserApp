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

afterEach(cleanup)

describe("JSON to TypeScript / Zod", () => {
  it("generates current code from a sample, then recovers from invalid input", async () => {
    const { container } = render(<Client messages={messages} dir="ltr" />)
    const input = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.inputLabel,
    })

    expect(screen.getByText(messages.emptyOutput)).toBeDefined()
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: messages.copyLabel,
      }).disabled
    ).toBe(true)

    fireEvent.click(screen.getByRole("button", { name: messages.sampleLabel }))
    expect(container.querySelector("pre")?.textContent).toContain(
      "email: string | null"
    )
    const types = await screen.findByRole("link", {
      name: messages.downloadLabel,
    })
    expect(types.getAttribute("download")).toBe("api-response.ts")

    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    fireEvent.click(screen.getByRole("button", { name: messages.copyLabel }))
    await screen.findByRole("button", { name: messages.copiedLabel })
    expect(copy).toHaveBeenCalledWith(
      container.querySelector("pre")?.textContent
    )
    copy.mockRestore()

    fireEvent.change(input, { target: { value: '{"count":' } })
    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(input.value).toBe('{"count":')
    expect(screen.getByText(messages.invalidJson)).toBeDefined()
    expect(container.querySelector("pre")).toBeNull()
    expect(
      screen.queryByRole("link", { name: messages.downloadLabel })
    ).toBeNull()
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: messages.copyLabel,
      }).disabled
    ).toBe(true)

    fireEvent.change(input, { target: { value: '{"count":0}' } })
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Zod" }), {
      button: 0,
      ctrlKey: false,
    })
    expect(container.querySelector("pre")?.textContent).toContain(
      "count: z.number()"
    )
    expect(screen.queryByText(messages.invalidJson)).toBeNull()
    const zod = await screen.findByRole("link", {
      name: messages.downloadLabel,
    })
    expect(zod.getAttribute("download")).toBe("api-response.schema.ts")
  })

  it("opens a file and preserves input if another file fails to read", async () => {
    const { container } = render(<Client messages={messages} dir="ltr" />)
    const fileInput =
      container.querySelector<HTMLInputElement>('input[type="file"]')!
    const input = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.inputLabel,
    })
    const open = vi.spyOn(fileInput, "click")
    fireEvent.click(
      screen.getByRole("button", { name: messages.openFileLabel })
    )
    expect(open).toHaveBeenCalledOnce()

    const file = new File(['{"saved":true}'], "api.json")
    fireEvent.change(fileInput, { target: { files: [file] } })
    await waitFor(() => expect(input.value).toBe('{"saved":true}'))
    expect(container.querySelector("pre")?.textContent).toContain(
      "saved: boolean"
    )

    const rejected = new File([], "unreadable.json")
    vi.spyOn(rejected, "text").mockRejectedValue(new Error("read failure"))
    fireEvent.change(fileInput, { target: { files: [rejected] } })
    await screen.findByText(messages.fileReadError)
    expect(input.value).toBe('{"saved":true}')
    expect(container.querySelector("pre")?.textContent).toContain(
      "saved: boolean"
    )
  })

  it("keeps edits made while a file is reading", async () => {
    const { container } = render(<Client messages={messages} dir="ltr" />)
    const fileInput =
      container.querySelector<HTMLInputElement>('input[type="file"]')!
    const input = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.inputLabel,
    })
    const file = new File([], "api.json")
    let finishReading!: (text: string) => void
    const reading = new Promise<string>((resolve) => {
      finishReading = resolve
    })
    vi.spyOn(file, "text").mockReturnValue(reading)

    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.change(input, { target: { value: "42" } })
    finishReading("false")
    await reading
    expect(input.value).toBe("42")
  })
})

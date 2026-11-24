import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import ComposeValidator from "./client"
import messages from "./messages/en.json"

afterEach(cleanup)

describe("ComposeValidator", () => {
  it("loads an example, validates it, and clears the workspace", async () => {
    render(<ComposeValidator messages={messages} />)
    const editor = screen.getByLabelText<HTMLTextAreaElement>(
      messages.inputLabel
    )
    const validate = screen.getByRole<HTMLButtonElement>("button", {
      name: messages.validate,
    })
    expect(validate.disabled).toBe(true)

    fireEvent.click(screen.getByRole("button", { name: messages.example }))
    expect(editor.value).toContain("nginx:alpine")
    fireEvent.click(validate)
    expect(await screen.findByText(messages.valid)).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: messages.clear }))
    expect(editor.value).toBe("")
    expect(screen.getByText(messages.idle)).toBeTruthy()
  })

  it("jumps to an issue found with the keyboard and allows a correction", async () => {
    render(<ComposeValidator messages={messages} />)
    const editor = screen.getByLabelText<HTMLTextAreaElement>(
      messages.inputLabel
    )
    const source = "services:\n  web:\n    typo: nginx\n    image: []\n"
    fireEvent.change(editor, { target: { value: source } })
    fireEvent.keyDown(editor, { ctrlKey: true, key: "Enter" })

    fireEvent.click(
      await screen.findByRole("button", { name: /services\.web\.typo/ })
    )
    expect(document.activeElement).toBe(editor)
    expect(editor.selectionStart).toBe(source.indexOf("typo"))

    fireEvent.change(editor, {
      target: {
        value: source.replace("    image: []\n", "").replace("typo", "image"),
      },
    })
    expect(screen.getByText(messages.idle)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.validate }))
    expect(await screen.findByText(messages.valid)).toBeTruthy()
  })

  it("opens a file, normalizes line endings, and keeps the input if reading fails", async () => {
    const { container } = render(<ComposeValidator messages={messages} />)
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]')!
    const editor = screen.getByLabelText<HTMLTextAreaElement>(
      messages.inputLabel
    )
    const pick = vi.spyOn(input, "click")
    fireEvent.click(screen.getByRole("button", { name: messages.openFile }))
    expect(pick).toHaveBeenCalledOnce()

    fireEvent.change(input, {
      target: { files: [{ text: async () => "services:\r\n  web: {}" }] },
    })
    await waitFor(() => expect(editor.value).toBe("services:\n  web: {}"))
    fireEvent.click(screen.getByRole("button", { name: messages.validate }))
    expect(await screen.findByText(messages.valid)).toBeTruthy()

    fireEvent.change(input, {
      target: {
        files: [
          {
            text: async () => {
              throw Error("read failed")
            },
          },
        ],
      },
    })
    expect(await screen.findByText(messages.fileError)).toBeTruthy()
    expect(editor.value).toContain("services:")
  })
})

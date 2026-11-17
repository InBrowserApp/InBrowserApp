import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"
import EnvConverterClient from "./client"
import { SAMPLE_ENV } from "./constants"
import messages from "./messages/en.json"

const input = () =>
  screen.getByRole("textbox", { name: /^Input/ }) as HTMLTextAreaElement
const output = () =>
  screen.getByRole("textbox", { name: /^Output/ }) as HTMLTextAreaElement
const enter = (value: string) =>
  fireEvent.change(input(), { target: { value } })
const changeDirection = (value: string) =>
  fireEvent.change(screen.getByLabelText(messages.conversionLabel), {
    target: { value },
  })
const button = (name: string) =>
  screen.getByRole("button", { name }) as HTMLButtonElement

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe(".env converter UI", () => {
  test("shows a working example and preserves strings in JSON and YAML", () => {
    render(<EnvConverterClient messages={messages} />)
    expect(input().value).toBe(SAMPLE_ENV)
    expect(JSON.parse(output().value)).toMatchObject({
      PORT: "3000",
      DEBUG: "false",
      CODE: "0012",
    })
    expect(output().readOnly).toBe(true)
    expect(input().getAttribute("dir")).toBe("ltr")
    expect(screen.getByText(messages.privacyLabel)).toBeTruthy()
    changeDirection("env-yaml")
    expect(input().value).toBe(SAMPLE_ENV)
    expect(output().value).toContain('CODE: "0012"')
    fireEvent.click(button(messages.swapLabel))
    expect(input().value).toContain('CODE: "0012"')
    expect(output().value).toContain("CODE=0012")
    changeDirection("env-json")
    expect(input().value).toContain("CODE=0012")
  })

  test("navigates to warning and error lines, with warnings remaining exportable", () => {
    render(<EnvConverterClient messages={messages} />)
    enter("A=one\nA=two")
    expect(JSON.parse(output().value)).toEqual({ A: "two" })
    expect(screen.getByText(/Duplicate key/)).toBeTruthy()
    expect(button(messages.downloadLabel).disabled).toBe(false)
    fireEvent.click(button("Line 2"))
    expect(document.activeElement).toBe(input())
    expect(input().selectionStart).toBe(6)
    expect(input().selectionEnd).toBe(11)
    enter('A="bad\nnext line')
    expect(input().getAttribute("aria-invalid")).toBe("true")
    expect(output().value).toBe("")
    expect(button(messages.downloadLabel).disabled).toBe(true)
    expect(button(messages.copyLabel).disabled).toBe(true)
    fireEvent.click(button("Line 1"))
    expect(input().selectionStart).toBe(0)
    expect(input().selectionEnd).toBe(6)
    changeDirection("json-env")
    expect(input().value).toBe('A="bad\nnext line')
    expect(screen.getByText(/Invalid JSON/)).toBeTruthy()
    expect(screen.queryByRole("button", { name: /Line/ })).toBeNull()
  })

  test("supports clear and format-specific examples without storing configuration", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem")
    render(<EnvConverterClient messages={messages} />)
    fireEvent.click(button(messages.clearLabel))
    expect(input().value).toBe("")
    expect(output().value).toBe("")
    expect(screen.getByText(messages.emptyLabel)).toBeTruthy()
    expect(button(messages.clearLabel).disabled).toBe(true)
    expect(button(messages.swapLabel).disabled).toBe(true)
    changeDirection("json-env")
    fireEvent.click(button(messages.sampleLabel))
    expect(JSON.parse(input().value).CODE).toBe("0012")
    expect(output().value).toContain("CODE=0012")
    changeDirection("yaml-env")
    fireEvent.click(button(messages.sampleLabel))
    expect(input().value).toContain('CODE: "0012"')
    changeDirection("env-json")
    fireEvent.click(button(messages.sampleLabel))
    expect(input().value).toBe(SAMPLE_ENV)
    expect(setItem).not.toHaveBeenCalled()
  })

  test("copies the current output", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", { clipboard: { writeText } })
    render(<EnvConverterClient messages={messages} />)
    enter("A=latest")
    fireEvent.click(button(messages.copyLabel))
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith('{\n  "A": "latest"\n}')
    )
    expect(button(messages.copiedLabel)).toBeTruthy()
  })

  test("downloads each format and revokes temporary URLs", () => {
    const createObjectURL = vi.fn(() => "blob:download")
    const revokeObjectURL = vi.fn()
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL })
    const downloads: { filename: string; href: string }[] = []
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      downloads.push({ filename: this.download, href: this.href })
    })
    render(<EnvConverterClient messages={messages} />)
    fireEvent.click(button(messages.downloadLabel))
    changeDirection("env-yaml")
    fireEvent.click(button(messages.downloadLabel))
    fireEvent.click(button(messages.swapLabel))
    fireEvent.click(button(messages.downloadLabel))
    expect(downloads.map((item) => item.filename)).toEqual([
      "converted.json",
      "converted.yaml",
      ".env",
    ])
    expect(downloads.every((item) => item.href === "blob:download")).toBe(true)
    expect(createObjectURL).toHaveBeenCalledTimes(3)
    expect(revokeObjectURL).toHaveBeenCalledTimes(3)
  })

  test("imports a file, handles cancelled and failed reads, and clears the error on edit", async () => {
    render(<EnvConverterClient messages={messages} />)
    const fileInput = screen.getByLabelText(
      messages.importLabel
    ) as HTMLInputElement
    const click = vi.spyOn(fileInput, "click")
    fireEvent.click(button(messages.importLabel))
    expect(click).toHaveBeenCalled()
    fireEvent.change(fileInput, { target: { files: [] } })
    expect(input().value).toBe(SAMPLE_ENV)
    fireEvent.change(fileInput, {
      target: { files: [{ text: () => Promise.resolve("FILE=imported") }] },
    })
    await waitFor(() => expect(input().value).toBe("FILE=imported"))
    await waitFor(() =>
      expect(JSON.parse(output().value)).toEqual({ FILE: "imported" })
    )
    fireEvent.change(fileInput, {
      target: {
        files: [{ text: () => Promise.reject(new Error("read failed")) }],
      },
    })
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(
        messages.fileErrorLabel
      )
    )
    enter("A=ok")
    expect(screen.queryByRole("alert")).toBeNull()
  })
})

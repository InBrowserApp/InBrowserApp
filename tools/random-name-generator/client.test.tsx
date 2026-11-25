import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomNameClient from "./client"
import * as names from "./core/names"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const output = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.results })
const generate = () =>
  fireEvent.click(screen.getByRole("button", { name: messages.generate }))

function select(label: string, item: string) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: label }), {
    key: "ArrowDown",
  })
  fireEvent.click(screen.getByRole("option", { name: item }))
}

describe("Random Name Generator", () => {
  it("switches name type and data locale, then copies and downloads the result", async () => {
    const mockGenerate = vi
      .spyOn(names, "generateNames")
      .mockResolvedValueOnce(["田中", "鈴木"])
      .mockResolvedValueOnce(["山田", "岡田"])
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomNameClient lang="en" messages={messages} />)

    select(messages.locale, "Japanese")
    select(messages.nameType, messages.family)
    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "2" },
    })
    generate()

    await waitFor(() => expect(output().value).toBe("田中\n鈴木"))
    expect(mockGenerate).toHaveBeenCalledWith("ja", "family", 2)
    expect(
      screen.getByRole("heading", { name: "Names · Japanese · Family name" })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith("田中\n鈴木")
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("names-ja.txt")
    expect(download.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${encodeURIComponent("田中\n鈴木")}`
    )

    generate()
    await waitFor(() => expect(output().value).toBe("山田\n岡田"))
    expect(screen.getByRole("button", { name: messages.copy })).toBeTruthy()
    expect(writeText).toHaveBeenCalledTimes(1)
  })

  it("ignores repeat submissions while leaving the focused Generate button available", async () => {
    let resolveNames!: (names: string[]) => void
    const batch = new Promise<string[]>((resolve) => {
      resolveNames = resolve
    })
    const mockGenerate = vi
      .spyOn(names, "generateNames")
      .mockReturnValueOnce(batch)
    render(<RandomNameClient lang="en" messages={messages} />)

    const button = screen.getByRole("button", { name: messages.generate })
    const form = button.closest("form")!
    button.focus()
    fireEvent.submit(form)
    expect(button.getAttribute("aria-disabled")).toBe("true")
    fireEvent.submit(form)
    expect(mockGenerate).toHaveBeenCalledTimes(1)
    resolveNames(["Alex Morgan"])

    await waitFor(() => expect(output().value).toBe("Alex Morgan"))
    expect(document.activeElement).toBe(button)
    expect(button.getAttribute("aria-disabled")).toBe("false")
  })

  it("keeps the original batch after a failed generation and allows a retry", async () => {
    vi.spyOn(names, "generateNames")
      .mockResolvedValueOnce(["Alex Morgan"])
      .mockRejectedValueOnce(new Error("Load failed"))
      .mockResolvedValueOnce(["Morgan"])
    render(<RandomNameClient lang="en" messages={messages} />)

    generate()
    await waitFor(() => expect(output().value).toBe("Alex Morgan"))
    select(messages.nameType, messages.family)
    generate()
    expect((await screen.findByRole("alert")).textContent).toBe(messages.error)
    expect(output().value).toBe("Alex Morgan")
    generate()
    await waitFor(() => expect(output().value).toBe("Morgan"))
    expect(screen.queryByRole("alert")).toBeNull()
  })
})

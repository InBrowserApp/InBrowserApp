import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomPostalCodeClient from "./client"
import * as postalCodes from "./core/postal-codes"
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

describe("Random Postal Code Generator", () => {
  it("copies and downloads the generated text, preserving leading zeros", async () => {
    vi.spyOn(postalCodes, "generatePostalCodes").mockResolvedValueOnce([
      "02108",
      "00501",
    ])
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomPostalCodeClient lang="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "2" },
    })
    generate()

    expect(output().value).toBe("")
    await waitFor(() => expect(output().value).toBe("02108\n00501"))
    expect(postalCodes.generatePostalCodes).toHaveBeenCalledWith(
      "US",
      2,
      "zip5"
    )
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith("02108\n00501")
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("postal-codes-us.txt")
    expect(download.getAttribute("href")).toBe(
      "data:text/plain;charset=utf-8,02108%0A00501"
    )
  })

  it("changes postal formats and labels results with their original country", async () => {
    render(<RandomPostalCodeClient lang="en" messages={messages} />)
    select(messages.zipFormat, "ZIP+4")
    generate()
    await waitFor(() =>
      expect(output().value.split("\n")[0]).toMatch(/^\d{5}-\d{4}$/)
    )

    select(messages.country, "Canada")
    expect(
      screen.queryByRole("combobox", { name: messages.zipFormat })
    ).toBeNull()
    expect(
      screen.getByRole("heading", {
        name: `${messages.results} · United States · ZIP+4`,
      })
    ).toBeTruthy()
    generate()
    await waitFor(() =>
      expect(output().value.split("\n")[0]).toMatch(/^[A-Z]\d[A-Z] \d[A-Z]\d$/)
    )
    expect(screen.getByText(`${messages.results} · Canada`)).toBeTruthy()
  })

  it("can retry a failed generation from the same settings", async () => {
    vi.spyOn(postalCodes, "generatePostalCodes").mockRejectedValueOnce(
      new Error("Load failed")
    )
    render(<RandomPostalCodeClient lang="en" messages={messages} />)

    generate()
    expect((await screen.findByRole("alert")).textContent).toBe(messages.error)
    generate()
    await waitFor(() => expect(output().value.split("\n")).toHaveLength(10))
    expect(screen.queryByRole("alert")).toBeNull()
  })
})

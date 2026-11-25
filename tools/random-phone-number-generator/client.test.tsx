import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomPhoneNumberClient from "./client"
import * as phoneNumbers from "./core/phone-numbers"
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

describe("Random Phone Number Generator", () => {
  it("blocks native form submission until hydration", () => {
    const template = document.createElement("template")
    template.innerHTML = renderToString(
      <RandomPhoneNumberClient lang="en" messages={messages} />
    )

    expect(
      template.content.querySelector<HTMLButtonElement>("button[type=submit]")
        ?.disabled
    ).toBe(true)
  })

  it("copies and downloads the selected format with punctuation intact", async () => {
    const mockGenerate = vi
      .spyOn(phoneNumbers, "generatePhoneNumbers")
      .mockResolvedValueOnce(["+447700900123", "+447700900456"])
      .mockResolvedValueOnce(["07700 900123"])
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomPhoneNumberClient lang="en" messages={messages} />)

    select(messages.country, "United Kingdom")
    select(messages.format, messages.international)
    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "2" },
    })
    generate()
    const result = "+447700900123\n+447700900456"
    await waitFor(() => expect(output().value).toBe(result))
    expect(mockGenerate).toHaveBeenCalledWith("GB", "international", 2)
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith(result)
    const link = screen.getByRole("link", { name: messages.download })
    expect(link.getAttribute("download")).toBe("phone-numbers-gb.txt")
    expect(link.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${encodeURIComponent(result)}`
    )

    select(messages.format, messages.national)
    expect(output().value).toBe(result)
    expect(
      screen.getByRole("heading", {
        name: "Phone numbers · United Kingdom · International (E.164)",
      })
    ).toBeTruthy()
    generate()
    await waitFor(() => expect(output().value).toBe("07700 900123"))
    expect(screen.getByRole("button", { name: messages.copy })).toBeTruthy()
  })

  it("retains prior results when generation fails and lets the reader retry", async () => {
    vi.spyOn(phoneNumbers, "generatePhoneNumbers")
      .mockResolvedValueOnce(["(202) 555-0100"])
      .mockRejectedValueOnce(new Error("Load failed"))
      .mockResolvedValueOnce(["(202) 555-0101"])
    render(<RandomPhoneNumberClient lang="en" messages={messages} />)

    generate()
    await waitFor(() => expect(output().value).toBe("(202) 555-0100"))
    const heading = { name: "Phone numbers · United States · National" }
    const firstBatchTitle = screen.getByRole("heading", heading)
    generate()
    expect((await screen.findByRole("alert")).textContent).toBe(messages.error)
    expect(output().value).toBe("(202) 555-0100")
    generate()
    await waitFor(() => expect(output().value).toBe("(202) 555-0101"))
    expect(screen.getByRole("heading", heading)).not.toBe(firstBatchTitle)
  })

  it("ignores a repeat submission and preserves keyboard focus", async () => {
    let resolveBatch!: (numbers: string[]) => void
    const batch = new Promise<string[]>((resolve) => {
      resolveBatch = resolve
    })
    const mockGenerate = vi
      .spyOn(phoneNumbers, "generatePhoneNumbers")
      .mockReturnValueOnce(batch)
    render(<RandomPhoneNumberClient lang="en" messages={messages} />)

    const button = screen.getByRole("button", { name: messages.generate })
    button.focus()
    fireEvent.submit(button.closest("form")!)
    fireEvent.submit(button.closest("form")!)
    expect(mockGenerate).toHaveBeenCalledExactlyOnceWith("US", "national", 10)
    resolveBatch(["(202) 555-0100"])
    await waitFor(() => expect(output().value).toBe("(202) 555-0100"))
    expect(document.activeElement).toBe(button)
  })
})

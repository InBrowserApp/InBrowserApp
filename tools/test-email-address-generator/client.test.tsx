import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import TestEmailAddressClient from "./client"
import * as emails from "./core/email-addresses"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const output = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.results })
const generate = () =>
  fireEvent.click(screen.getByRole("button", { name: messages.generate }))

describe("Test Email Address Generator", () => {
  it("generates, copies and downloads addresses for the selected domain", async () => {
    const mockGenerate = vi
      .spyOn(emails, "generateEmailAddresses")
      .mockResolvedValueOnce(["alex.lee@example.org", "Morgan_42@example.org"])
      .mockResolvedValueOnce(["Ari.Young@example.org"])
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<TestEmailAddressClient lang="en" messages={messages} />)

    fireEvent.keyDown(screen.getByRole("combobox", { name: messages.domain }), {
      key: "ArrowDown",
    })
    fireEvent.click(screen.getByRole("option", { name: "example.org" }))
    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "2" },
    })
    generate()

    const text = "alex.lee@example.org\nMorgan_42@example.org"
    await waitFor(() => expect(output().value).toBe(text))
    expect(mockGenerate).toHaveBeenCalledWith("example.org", 2)
    expect(
      screen.getByRole("heading", { name: "Email addresses · example.org" })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith(text)
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("test-email-addresses.txt")
    expect(download.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    )

    generate()
    await waitFor(() => expect(output().value).toBe("Ari.Young@example.org"))
    expect(screen.getByRole("button", { name: messages.copy })).toBeTruthy()
    expect(writeText).toHaveBeenCalledTimes(1)
  })

  it("keeps keyboard focus and ignores repeats while generation is pending", async () => {
    let resolveBatch!: (addresses: string[]) => void
    const batch = new Promise<string[]>((resolve) => {
      resolveBatch = resolve
    })
    const mockGenerate = vi
      .spyOn(emails, "generateEmailAddresses")
      .mockReturnValueOnce(batch)
    render(<TestEmailAddressClient lang="en" messages={messages} />)

    const button = screen.getByRole("button", { name: messages.generate })
    const form = button.closest("form")!
    button.focus()
    fireEvent.submit(form)
    expect(button.getAttribute("aria-disabled")).toBe("true")
    fireEvent.submit(form)
    expect(mockGenerate).toHaveBeenCalledExactlyOnceWith("any", 10)
    resolveBatch(["Ari.Young@example.net"])

    await waitFor(() => expect(output().value).toBe("Ari.Young@example.net"))
    expect(document.activeElement).toBe(button)
  })

  it("allows retry without losing the prior result after a failure", async () => {
    vi.spyOn(emails, "generateEmailAddresses")
      .mockResolvedValueOnce(["Alex.Morgan@example.com"])
      .mockRejectedValueOnce(new Error("Load failed"))
      .mockResolvedValueOnce(["Morgan42@example.net"])
    render(<TestEmailAddressClient lang="en" messages={messages} />)

    generate()
    await waitFor(() => expect(output().value).toBe("Alex.Morgan@example.com"))
    generate()
    expect((await screen.findByRole("alert")).textContent).toBe(messages.error)
    expect(output().value).toBe("Alex.Morgan@example.com")
    generate()
    await waitFor(() => expect(output().value).toBe("Morgan42@example.net"))
    expect(screen.queryByRole("alert")).toBeNull()
  })
})

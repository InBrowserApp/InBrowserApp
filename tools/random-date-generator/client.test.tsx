import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomDateClient from "./client"
import * as dates from "./core/dates"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const output = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.results })
const generate = () =>
  fireEvent.click(screen.getByRole("button", { name: messages.generate }))
const start = () => screen.getByLabelText<HTMLInputElement>(messages.start)
const end = () => screen.getByLabelText<HTMLInputElement>(messages.end)

function updateRange(startDate: string, endDate: string) {
  fireEvent.change(start(), { target: { value: startDate } })
  fireEvent.change(end(), { target: { value: endDate } })
}

describe("Random Date Generator", () => {
  it("renders a disabled submit button before hydration", () => {
    const template = document.createElement("template")
    template.innerHTML = renderToString(
      <RandomDateClient lang="en" messages={messages} />
    )

    expect(
      template.content.querySelector<HTMLButtonElement>("button[type=submit]")
        ?.disabled
    ).toBe(true)
  })

  it("preserves the prior batch when an end date is earlier and lets the user correct the range", async () => {
    render(<RandomDateClient lang="en" messages={messages} />)
    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "1" },
    })
    updateRange("2024-02-29", "2024-02-29")
    generate()
    await waitFor(() => expect(output().value).toBe("2024-02-29"))
    expect(output().dir).toBe("ltr")
    expect(
      screen.getByRole("heading", {
        name: `Dates · 2024-02-29 · ${messages.iso}`,
      })
    ).toBeTruthy()

    updateRange("2024-03-01", "2024-02-28")
    generate()
    expect(screen.getByRole("alert").textContent).toBe(messages.invalidRange)
    expect(end().getAttribute("aria-invalid")).toBe("true")
    expect(output().value).toBe("2024-02-29")

    fireEvent.change(end(), { target: { value: "2024-03-01" } })
    expect(screen.queryByRole("alert")).toBeNull()
    generate()
    await waitFor(() => expect(output().value).toBe("2024-03-01"))
  })

  it("copies and downloads the localized calendar date", async () => {
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomDateClient lang="de" messages={messages} />)
    updateRange("2024-02-29", "2024-02-29")
    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "2" },
    })
    fireEvent.keyDown(screen.getByRole("combobox", { name: messages.format }), {
      key: "ArrowDown",
    })
    fireEvent.click(screen.getByRole("option", { name: messages.localized }))
    generate()

    const text = "29.02.2024\n29.02.2024"
    await waitFor(() => expect(output().value).toBe(text))
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith(text)
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("random-dates.txt")
    expect(download.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    )
  })

  it("blocks repeat submissions and allows retry after a generation failure", async () => {
    const mockGenerate = vi
      .spyOn(dates, "generateDates")
      .mockImplementationOnce(() => {
        throw new Error("Load failed")
      })
    render(<RandomDateClient lang="en" messages={messages} />)
    updateRange("2024-02-29", "2024-02-29")
    const button = screen.getByRole("button", { name: messages.generate })
    button.focus()
    fireEvent.submit(button.closest("form")!)
    fireEvent.submit(button.closest("form")!)
    expect((await screen.findByRole("alert")).textContent).toBe(messages.error)
    expect(mockGenerate).toHaveBeenCalledTimes(1)
    generate()
    await waitFor(() => expect(output().value.split("\n")).toHaveLength(10))
    expect(document.activeElement).toBe(button)
  })
})

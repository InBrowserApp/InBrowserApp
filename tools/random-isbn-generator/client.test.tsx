import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomIsbnClient from "./client"
import * as isbns from "./core/isbns"
import messages from "./messages/en.json"

const isbn13 = "978-0-306-40615-7"
const isbn10 = "080442957X"
const generate = () => screen.getByRole("button", { name: messages.generate })
const output = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.results })

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("Random ISBN Generator", () => {
  it("prevents a native form submission before hydration", () => {
    const template = document.createElement("template")
    template.innerHTML = renderToString(
      <RandomIsbnClient lang="en" messages={messages} />
    )

    expect(
      template.content.querySelector<HTMLButtonElement>("button[type=submit]")
        ?.disabled
    ).toBe(true)
  })

  it("defaults to hyphenated ISBN-13 and exports compact ISBN-10 without losing zeros or X", async () => {
    const createBatch = vi
      .spyOn(isbns, "generateIsbns")
      .mockResolvedValueOnce([isbn13])
      .mockResolvedValueOnce([isbn10])
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomIsbnClient lang="ar" messages={messages} />)
    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "1" },
    })
    const button = generate()
    fireEvent.click(button)
    await waitFor(() => expect(output().value).toBe(isbn13))
    expect(createBatch).toHaveBeenNthCalledWith(
      1,
      { variant: 13, separator: "-" },
      1
    )
    expect(screen.getByRole("heading", { name: /ISBN-13/ })).toBeTruthy()

    fireEvent.keyDown(screen.getByRole("combobox", { name: messages.format }), {
      key: "ArrowDown",
    })
    fireEvent.click(screen.getByRole("option", { name: "ISBN-10" }))
    fireEvent.click(screen.getByRole("checkbox", { name: messages.hyphens }))
    expect(output().value).toBe(isbn13)
    expect(screen.getByRole("heading", { name: /ISBN-13/ })).toBeTruthy()
    fireEvent.click(button)

    await waitFor(() => expect(output().value).toBe(isbn10))
    expect(createBatch).toHaveBeenNthCalledWith(
      2,
      { variant: 10, separator: "" },
      1
    )
    expect(output().dir).toBe("ltr")
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith(isbn10)
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("random-isbns.txt")
    expect(download.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${isbn10}`
    )
  })

  it("keeps focus while loading and tells users how to recover after failure", async () => {
    let rejectBatch!: (error: Error) => void
    const pendingBatch = new Promise<string[]>((_, reject) => {
      rejectBatch = reject
    })
    const createBatch = vi
      .spyOn(isbns, "generateIsbns")
      .mockReturnValueOnce(pendingBatch)
    render(<RandomIsbnClient lang="en" messages={messages} />)
    const button = generate()
    const form = button.closest("form")!
    button.focus()
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(createBatch).toHaveBeenCalledTimes(1)

    rejectBatch(new Error("Load failed"))
    expect((await screen.findByRole("alert")).textContent).toBe(messages.error)
    expect(document.activeElement).toBe(button)
  })
})

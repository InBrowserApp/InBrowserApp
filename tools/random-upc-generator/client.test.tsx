import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomUpcClient from "./client"
import * as upcs from "./core/upcs"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("Random UPC Generator", () => {
  it("preserves a leading zero in both clipboard and TXT output", async () => {
    const generatedCodes = ["084044127435", "904366396701"]
    const createBatch = vi
      .spyOn(upcs, "generateUpcs")
      .mockResolvedValue(generatedCodes)
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomUpcClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "2" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.generate }))

    const batch = generatedCodes.join("\n")
    const result = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.results,
    })
    await waitFor(() => expect(result.value).toBe(batch))
    expect(createBatch).toHaveBeenCalledWith(2)
    expect(result.dir).toBe("ltr")
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith(batch)

    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("random-upcs.txt")
    expect(download.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${encodeURIComponent(batch)}`
    )
  })
})

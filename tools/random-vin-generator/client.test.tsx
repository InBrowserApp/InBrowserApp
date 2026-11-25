import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomVinClient from "./client"
import * as vins from "./core/vins"
import messages from "./messages/en.json"

const firstVin = "1M8GDM9AXKP042788"
const secondVin = "1HGCM82633A004352"
const generate = () => screen.getByRole("button", { name: messages.generate })
const output = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.results })

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("Random VIN Generator", () => {
  it("prevents a native form submission before hydration", () => {
    const template = document.createElement("template")
    template.innerHTML = renderToString(<RandomVinClient messages={messages} />)

    expect(
      template.content.querySelector<HTMLButtonElement>("button[type=submit]")
        ?.disabled
    ).toBe(true)
  })

  it("copies and downloads the generated VINs, one per line", async () => {
    const createBatch = vi
      .spyOn(vins, "generateVins")
      .mockResolvedValue([firstVin, secondVin])
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomVinClient messages={messages} />)
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()

    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "2" },
    })
    fireEvent.click(generate())

    const batch = `${firstVin}\n${secondVin}`
    await waitFor(() => expect(output().value).toBe(batch))
    expect(createBatch).toHaveBeenCalledWith(2)
    expect(output().dir).toBe("ltr")
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith(batch)
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("random-vins.txt")
    expect(download.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${encodeURIComponent(batch)}`
    )
  })

  it("keeps focus during a pending batch and explains how to recover from a load failure", async () => {
    let rejectBatch!: (error: Error) => void
    const pendingBatch = new Promise<string[]>((_, reject) => {
      rejectBatch = reject
    })
    const createBatch = vi
      .spyOn(vins, "generateVins")
      .mockReturnValueOnce(pendingBatch)
    render(<RandomVinClient messages={messages} />)
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

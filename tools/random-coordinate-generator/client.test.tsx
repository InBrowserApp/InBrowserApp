import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import RandomCoordinateClient from "./client"
import * as coordinates from "./core/coordinates"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const output = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.results })
const generate = () =>
  fireEvent.submit(
    screen.getByRole("button", { name: messages.generate }).closest("form")!
  )

function chooseArea(label: string) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: messages.area }), {
    key: "ArrowDown",
  })
  fireEvent.click(screen.getByRole("option", { name: label }))
}

describe("Random Coordinate Generator", () => {
  it("guards against native form submission before hydration", () => {
    const template = document.createElement("template")
    template.innerHTML = renderToString(
      <RandomCoordinateClient lang="en" messages={messages} />
    )

    expect(
      template.content.querySelector<HTMLButtonElement>("button[type=submit]")
        ?.disabled
    ).toBe(true)
  })

  it("keeps a nearby center when switching areas and exports the exact coordinates", async () => {
    const mockGenerate = vi
      .spyOn(coordinates, "generateCoordinates")
      .mockResolvedValueOnce(["1.000000, 2.000000"])
      .mockResolvedValueOnce(["37.774900, -122.419400"])
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<RandomCoordinateClient lang="en" messages={messages} />)
    expect(
      screen.queryByRole("spinbutton", { name: messages.latitude })
    ).toBeNull()
    fireEvent.change(screen.getByLabelText(messages.quantity), {
      target: { value: "1" },
    })
    generate()
    await waitFor(() => expect(output().value).toBe("1.000000, 2.000000"))
    expect(mockGenerate).toHaveBeenCalledWith({ area: "worldwide" }, 1)
    chooseArea(messages.nearby)
    fireEvent.change(screen.getByLabelText(messages.latitude), {
      target: { value: "37.7749" },
    })
    fireEvent.change(screen.getByLabelText(messages.longitude), {
      target: { value: "-122.4194" },
    })
    chooseArea(messages.worldwide)
    chooseArea(messages.nearby)
    expect(
      screen.getByRole<HTMLInputElement>("spinbutton", {
        name: messages.longitude,
      }).value
    ).toBe("-122.4194")
    expect(output().value).toBe("1.000000, 2.000000")
    generate()

    const point = "37.774900, -122.419400"
    await waitFor(() => expect(output().value).toBe(point))
    expect(mockGenerate).toHaveBeenCalledWith(
      { area: "nearby", latitude: 37.7749, longitude: -122.4194, radius: 25 },
      1
    )
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByRole("button", { name: messages.copied })
    expect(writeText).toHaveBeenCalledWith(point)
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("download")).toBe("random-coordinates.txt")
    expect(download.getAttribute("href")).toBe(
      `data:text/plain;charset=utf-8,${encodeURIComponent(point)}`
    )
  })

  it("keeps the focus through pending work and can retry after a failure", async () => {
    let rejectBatch!: (error: Error) => void
    const batch = new Promise<string[]>((_, reject) => {
      rejectBatch = reject
    })
    const mockGenerate = vi
      .spyOn(coordinates, "generateCoordinates")
      .mockReturnValueOnce(batch)
      .mockResolvedValueOnce(["1.000000, 2.000000"])
    render(<RandomCoordinateClient lang="en" messages={messages} />)
    const button = screen.getByRole("button", { name: messages.generate })
    button.focus()
    fireEvent.submit(button.closest("form")!)
    fireEvent.submit(button.closest("form")!)
    expect(mockGenerate).toHaveBeenCalledTimes(1)
    rejectBatch(new Error("Load failed"))
    expect((await screen.findByRole("alert")).textContent).toBe(messages.error)
    generate()
    await waitFor(() => expect(output().value).toBe("1.000000, 2.000000"))
    expect(document.activeElement).toBe(button)
  })
})

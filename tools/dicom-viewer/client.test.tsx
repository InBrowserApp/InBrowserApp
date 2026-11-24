import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it("browses sample slices by button, keyboard and wheel, then adjusts and resets the window", async () => {
  render(<Client messages={messages} lang="en" />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  await screen.findByRole("img", { name: "Slice 1 of 17" })
  fireEvent.click(screen.getByRole("button", { name: messages.next }))
  await screen.findByRole("img", { name: "Slice 2 of 17" })
  const image = screen.getByRole("region", { name: messages.viewport })
  fireEvent.keyDown(image, { key: "ArrowDown" })
  await screen.findByRole("img", { name: "Slice 3 of 17" })
  fireEvent.wheel(image, { deltaY: -40 })
  await screen.findByRole("img", { name: "Slice 2 of 17" })

  const width = screen.getByRole<HTMLInputElement>("spinbutton", {
    name: messages.windowWidth,
  })
  fireEvent.change(width, { target: { value: "750" } })
  fireEvent.blur(width)
  expect(width.valueAsNumber).toBe(750)
  fireEvent.click(screen.getByRole("button", { name: messages.reset }))
  expect(width.valueAsNumber).toBe(1450)
})

it("searches sample metadata and retains the loaded series when replacement fails", async () => {
  const { container } = render(<Client messages={messages} lang="en" />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  await screen.findByRole("img", { name: "Slice 1 of 17" })
  const details = screen.getByText(messages.metadata).closest("details")!
  details.open = true
  fireEvent(details, new Event("toggle"))
  const search = await screen.findByRole("searchbox", {
    name: messages.searchTags,
  })
  fireEvent.change(search, { target: { value: "00281050" } })
  expect(screen.getByText("Window Center")).toBeTruthy()
  expect(screen.queryByText("Window Width")).toBeNull()
  fireEvent.change(search, { target: { value: "unknown" } })
  expect(screen.getByText(messages.noTags)).toBeTruthy()

  const file = new File(["not DICOM"], "readme.txt")
  fireEvent.change(container.querySelector("input[type=file]")!, {
    target: { files: [file] },
  })
  await screen.findByText(messages.unreadable)
  expect(screen.getByRole("img", { name: "Slice 1 of 17" })).toBeTruthy()
  expect(screen.getByText("Skipped files (1)")).toBeTruthy()
})

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import { createPdf } from "./export-pdf"
import messages from "./messages/en.json"

vi.mock("./export-pdf", () => ({ createPdf: vi.fn() }))

const save = vi.fn()
const mockPdf = vi.mocked(createPdf)

beforeEach(() => {
  vi.resetAllMocks()
  mockPdf.mockResolvedValue({ save } as unknown as Awaited<
    ReturnType<typeof createPdf>
  >)
})

afterEach(cleanup)

function upload(input: HTMLElement, name: string, source: string) {
  fireEvent.change(input, { target: { files: [new File([source], name)] } })
}

test("shows an example and downloads it using the selected paper size", async () => {
  render(<Client messages={messages} language="en" />)
  fireEvent.click(screen.getByRole("button", { name: messages.tryExample }))
  await screen.findByText("alpine.svg")
  expect(screen.getByText("169.33 × 105.83 mm")).toBeTruthy()
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "a4" } })
  expect(screen.getByText("297 × 210 mm")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.download }))

  await screen.findByText(messages.downloadReady)
  expect(mockPdf).toHaveBeenCalledWith(
    expect.objectContaining({ width: 640, height: 400 }),
    "a4"
  )
  expect(save).toHaveBeenCalledWith("alpine.pdf")
})

test("keeps the previous artwork on an invalid replacement and allows a retry", async () => {
  render(<Client messages={messages} language="en" />)
  const input = screen.getByLabelText(messages.chooseSvg)
  const valid =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"/>'
  upload(input, "drawing.SVG", valid)
  await screen.findByText("drawing.SVG")
  upload(input, "bad.svg", "not an SVG")
  await screen.findByText(messages.invalidSvg)
  expect(screen.getByText("drawing.SVG")).toBeTruthy()

  mockPdf.mockRejectedValueOnce(new Error("Conversion failed"))
  fireEvent.click(screen.getByRole("button", { name: messages.download }))
  await screen.findByText(messages.conversionFailed)
  fireEvent.click(screen.getByRole("button", { name: messages.download }))
  await waitFor(() => expect(save).toHaveBeenCalledWith("drawing.pdf"))
  expect(screen.queryByRole("alert")).toBeNull()
})

test("loads a dropped SVG without using the file picker", async () => {
  render(<Client messages={messages} language="en" />)
  const area = screen.getByText(messages.dropSvg)
  fireEvent.dragOver(area, { dataTransfer: { types: ["Files"] } })
  fireEvent.dragLeave(area)
  fireEvent.drop(area, {
    dataTransfer: {
      files: [new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], ".svg")],
    },
  })
  await screen.findByText(".svg")
  fireEvent.click(screen.getByRole("button", { name: messages.download }))
  await waitFor(() => expect(save).toHaveBeenCalledWith("image.pdf"))
})

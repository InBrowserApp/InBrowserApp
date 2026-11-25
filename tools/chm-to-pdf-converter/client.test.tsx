import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import { convert } from "./convert"
import catalog from "./messages/en.json"

vi.mock("./convert", () => ({ convert: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

const { article: _, ...messages } = catalog

function setup() {
  const { container } = render(<Client messages={messages} lang="en" />)
  return container.querySelector<HTMLInputElement>('input[type="file"]')!
}

test("recovers after a bad file and offers the generated PDF", async () => {
  vi.mocked(convert)
    .mockRejectedValueOnce(new Error("Invalid archive"))
    .mockImplementationOnce(async (_file, _signal, report) => {
      report({ page: 1, pages: 2 })
      report({ page: 2, pages: 2, saving: true })
      return { pdf: new Blob(["%PDF-"]), pages: 2 }
    })
  const input = setup()
  fireEvent.change(input, { target: { files: [new File([], "bad.chm")] } })
  expect((await screen.findByRole("alert")).textContent).toContain(
    messages.error
  )
  expect(screen.getByText("bad.chm")).toBeTruthy()
  const zone = input.parentElement!
  const dataTransfer = {
    files: [new File([], "Help.CHM")],
    types: ["Files"],
  }
  fireEvent.dragEnter(zone, { dataTransfer })
  fireEvent.dragOver(zone, { dataTransfer })
  fireEvent.dragLeave(zone, { dataTransfer })
  fireEvent.drop(zone, { dataTransfer })
  const download = await screen.findByRole("link", { name: messages.download })
  expect(download.getAttribute("download")).toBe("Help.pdf")
  expect(screen.getByRole("status").textContent).toContain("Pages: 2")
  expect(screen.queryByRole("alert")).toBeNull()
})

test("cancels work, restores focus and ignores stale results", async () => {
  let complete!: () => void
  vi.mocked(convert).mockImplementation(
    () =>
      new Promise((resolve) => {
        complete = () => resolve({ pdf: new Blob(), pages: 1 })
      })
  )
  const input = setup()
  const choose = screen.getByRole("button", { name: messages.choose })
  const clicked = vi.spyOn(input, "click")
  fireEvent.click(choose)
  expect(clicked).toHaveBeenCalled()
  fireEvent.change(input, { target: { files: [new File([], "report.chm")] } })
  await waitFor(() => expect(convert).toHaveBeenCalled())
  const signal = vi.mocked(convert).mock.calls[0]![1]

  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(signal.aborted).toBe(true)
  expect(document.activeElement).toBe(choose)
  await act(async () => complete())
  expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
})

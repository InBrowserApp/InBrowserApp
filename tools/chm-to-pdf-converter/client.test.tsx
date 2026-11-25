// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import { prepareDocument } from "./prepare-document"
import catalog from "./messages/en.json"

vi.mock("./prepare-document", () => ({ prepareDocument: vi.fn() }))

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    class extends URL {
      static override createObjectURL = vi.fn(() => "blob:chm-preview")
      static override revokeObjectURL = vi.fn()
    }
  )
})

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  vi.unstubAllGlobals()
})

const { article: _, ...messages } = catalog

function setup() {
  const { container } = render(<Client messages={messages} />)
  return container.querySelector<HTMLInputElement>('input[type="file"]')!
}

test("recovers after a bad file and offers the print preview and PDF save action", async () => {
  vi.mocked(prepareDocument)
    .mockRejectedValueOnce(new Error("Invalid archive"))
    .mockResolvedValueOnce("<p>Searchable text</p>")
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
  const frame = await screen.findByTitle<HTMLIFrameElement>(messages.preview)
  expect(frame.getAttribute("sandbox")).toBe("allow-same-origin allow-modals")
  const save = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.save,
  })
  expect(save.disabled).toBe(true)
  fireEvent.load(frame)
  expect(save.disabled).toBe(false)
  const print = vi.fn().mockImplementationOnce(() => {
    throw new Error("Print unavailable")
  })
  Object.defineProperty(frame, "contentWindow", { value: { print } })
  fireEvent.click(save)
  expect(screen.getByRole("alert").textContent).toBe(messages.printUnavailable)
  fireEvent.click(save)
  expect(print).toHaveBeenCalledTimes(2)
  expect(screen.getByRole("status").textContent).toBe(messages.ready)
  expect(screen.queryByRole("alert")).toBeNull()
})

test("cancels work, restores focus and ignores stale results", async () => {
  let complete!: () => void
  vi.mocked(prepareDocument).mockImplementation(
    () =>
      new Promise((resolve) => {
        complete = () => resolve("<p>Text</p>")
      })
  )
  const input = setup()
  const choose = screen.getByRole("button", { name: messages.choose })
  const clicked = vi.spyOn(input, "click")
  fireEvent.click(choose)
  expect(clicked).toHaveBeenCalled()
  fireEvent.change(input, { target: { files: [new File([], "report.chm")] } })
  await waitFor(() => expect(prepareDocument).toHaveBeenCalled())
  const signal = vi.mocked(prepareDocument).mock.calls[0]![1]

  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(signal.aborted).toBe(true)
  expect(document.activeElement).toBe(choose)
  await act(async () => complete())
  expect(screen.queryByTitle(messages.preview)).toBeNull()
})

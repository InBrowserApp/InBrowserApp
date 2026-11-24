import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

const mocks = vi.hoisted(() => ({
  openForm: vi.fn(),
  flattenForm: vi.fn(),
  FormOpenError: class extends Error {
    constructor(readonly problem: string) {
      super(problem)
    }
  },
  pdf: {
    annotationStorage: { size: 1 },
    saveDocument: vi.fn(),
    getData: vi.fn(),
  },
  reader: { page: vi.fn(), zoom: vi.fn() },
}))

vi.mock("./open-form", () => ({
  openForm: mocks.openForm,
  FormOpenError: mocks.FormOpenError,
}))

vi.mock("./flatten-form", () => ({ flattenForm: mocks.flattenForm }))

beforeEach(() => {
  vi.resetAllMocks()
  mocks.pdf.annotationStorage.size = 1
  mocks.pdf.saveDocument.mockResolvedValue(new Uint8Array([1, 2, 3]))
  mocks.pdf.getData.mockResolvedValue(new Uint8Array([4, 5, 6]))
  mocks.flattenForm.mockResolvedValue(new Uint8Array([7, 8, 9]))
  mocks.openForm.mockImplementation(
    async (_file, _container, _signal, change) => {
      change({ page: 1, total: 2, zoom: 100 })
      return { pdf: mocks.pdf, reader: mocks.reader }
    }
  )
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function choose(name = "registration.PDF") {
  const file = new File(["sample"], name, { type: "application/pdf" })
  fireEvent.change(
    screen.getByLabelText(messages.open, { selector: "input" }),
    {
      target: { files: [file] },
    }
  )
  return file
}

test("navigates a loaded form and downloads editable and flattened copies", async () => {
  const names: string[] = []
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    names.push(this.download)
  })
  render(<Client lang="en" messages={messages} />)
  const file = choose()
  const editable = await screen.findByRole("button", {
    name: messages.downloadEditable,
  })
  expect(mocks.openForm.mock.calls[0]?.[0]).toBe(file)

  fireEvent.click(screen.getByRole("button", { name: messages.next }))
  expect(mocks.reader.page).toHaveBeenCalledWith(2)
  fireEvent.click(screen.getByRole("button", { name: messages.zoomIn }))
  expect(mocks.reader.zoom).toHaveBeenCalledWith(125)
  fireEvent.click(editable)
  await screen.findByText(messages.downloadReady)
  expect(mocks.pdf.saveDocument).toHaveBeenCalledOnce()
  expect(mocks.flattenForm).not.toHaveBeenCalled()

  fireEvent.click(
    screen.getByRole("button", { name: messages.downloadFlattened })
  )
  await waitFor(() =>
    expect(names).toEqual([
      "registration-filled.pdf",
      "registration-flattened.pdf",
    ])
  )
  expect(mocks.flattenForm).toHaveBeenCalledWith(
    new Uint8Array([1, 2, 3]),
    mocks.pdf,
    expect.anything()
  )
})

test("recovers from a file with no fields by opening the sample", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValue({ ok: true, blob: async () => new Blob(["sample"]) })
  vi.stubGlobal("fetch", fetch)
  mocks.openForm.mockRejectedValueOnce(new mocks.FormOpenError("noFields"))
  render(<Client lang="en" messages={messages} />)
  choose("scan.pdf")
  await screen.findByText(messages.noFields)
  fireEvent.click(screen.getByRole("button", { name: messages.sample }))
  await screen.findByRole("button", { name: messages.downloadEditable })
  expect(mocks.openForm.mock.calls.at(-1)?.[0].name).toBe("sample-form.pdf")
  expect(fetch).toHaveBeenCalledOnce()
})

test("keeps the form available after a failed flatten and can export it without changes", async () => {
  mocks.pdf.annotationStorage.size = 0
  mocks.flattenForm.mockRejectedValueOnce(new Error("Flatten failed"))
  const download = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  render(<Client lang="en" messages={messages} />)
  choose()
  fireEvent.click(
    await screen.findByRole("button", { name: messages.downloadFlattened })
  )
  await screen.findByText(messages.flattenError)
  expect(download).not.toHaveBeenCalled()
  fireEvent.click(
    screen.getByRole("button", { name: messages.downloadEditable })
  )
  await screen.findByText(messages.downloadReady)
  expect(mocks.pdf.getData).toHaveBeenCalledTimes(2)
  expect(download).toHaveBeenCalledOnce()
})

test("discards a pending export when the source file changes", async () => {
  let finish!: (bytes: Uint8Array) => void
  const pending = new Promise<Uint8Array>((resolve) => {
    finish = resolve
  })
  mocks.pdf.saveDocument.mockReturnValueOnce(pending)
  const download = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  render(<Client lang="en" messages={messages} />)
  choose()
  const editable = await screen.findByRole("button", {
    name: messages.downloadEditable,
  })
  fireEvent.click(editable)
  fireEvent.click(editable)
  expect(mocks.pdf.saveDocument).toHaveBeenCalledOnce()
  await screen.findByText(messages.saving)

  choose("second.pdf")
  finish(new Uint8Array([1]))
  await screen.findByRole("button", { name: messages.downloadEditable })
  expect(mocks.openForm.mock.calls[0]?.[2].aborted).toBe(true)
  expect(download).not.toHaveBeenCalled()
  expect(screen.queryByText(messages.downloadReady)).toBeNull()
})

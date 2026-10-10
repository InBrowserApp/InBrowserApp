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
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({
  prepare: vi.fn(),
  open: vi.fn(),
  dispose: vi.fn(),
  fail: null as null | (() => void),
}))
vi.mock("@workspace/caj", () => ({ prepareDocument: mock.prepare }))
vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.open }))
const pdf = new Blob(["%PDF-output"], { type: "application/pdf" })
const report = {
  format: "caj",
  pagesConverted: 3,
  omittedPages: [],
  substitutedGlyphs: 0n,
  outlineWarnings: 0,
  outlineOmitted: false,
}
const instance = {
  page: vi.fn(),
  zoom: vi.fn(),
  find: vi.fn(),
  dispose: mock.dispose,
}
function upload(file = new File(["CAJ"], "paper.v2.CAJ")) {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [file] },
  })
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:converted")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  mock.prepare.mockImplementation(async (_file, _signal, progress) => {
    progress(null)
    progress(0.5)
    return { file: pdf, report }
  })
  mock.open.mockImplementation(async ({ onChange, onError }) => {
    mock.fail = onError
    onChange({ total: 3, page: 1 })
    return instance
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("previews the prepared PDF and downloads the same bytes with the source basename", async () => {
  render(<Client messages={m} />)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  upload()
  const download = await screen.findByRole("link", { name: m.download })
  expect(download.getAttribute("download")).toBe("paper.v2.pdf")
  expect(download.getAttribute("href")).toBe("blob:converted")
  expect(URL.createObjectURL).toHaveBeenCalledWith(pdf)
  expect(mock.open).toHaveBeenCalledWith(expect.objectContaining({ file: pdf }))
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(instance.page).toHaveBeenCalledWith(2)
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  expect(instance.zoom).toHaveBeenCalledWith("page-width")
  const signal = mock.prepare.mock.calls[0]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(signal.aborted).toBe(true)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted")
})

test("removes a previous download immediately on replacement and suppresses stale work", async () => {
  let finish!: (value: { file: Blob; report: typeof report }) => void
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  mock.prepare.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  upload(new File(["NH"], "replacement.nh"))
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted")
  await waitFor(() => expect(mock.prepare).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => finish({ file: pdf, report }))
  expect(mock.open).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
})

test("rejects invalid and incomplete input and revokes a result after a preview error", async () => {
  render(<Client messages={m} />)
  upload(new File([], "empty.caj"))
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  upload(new File(["pdf"], "wrong.pdf"))
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  expect(mock.prepare).not.toHaveBeenCalled()
  mock.prepare.mockRejectedValueOnce(new Error("MISSING_PAGES"))
  upload()
  expect(await screen.findByText(m.missingPages)).toBeTruthy()
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  upload()
  await screen.findByRole("link", { name: m.download })
  act(() => mock.fail?.())
  expect(await screen.findByText(m.missingPages)).toBeTruthy()
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:converted")
})

test("shows compatibility warnings alongside experimental output", async () => {
  mock.prepare.mockResolvedValueOnce({
    file: pdf,
    report: {
      ...report,
      format: "hn",
      substitutedGlyphs: 2n,
      outlineOmitted: true,
    },
  })
  render(<Client messages={m} />)
  upload(new File(["NH"], "scan.nh"))
  await screen.findByRole("link", { name: m.download })
  expect(screen.getByText(m.experimental)).toBeTruthy()
  expect(screen.getByText(m.substituted)).toBeTruthy()
  expect(screen.getByText(m.outlineWarning)).toBeTruthy()
  expect(screen.getByText(m.textHint)).toBeTruthy()
})

test("aborts a pending preview on replacement and disposes a late reader", async () => {
  let finish!: (value: typeof instance) => void
  let failed!: () => void
  mock.open.mockImplementationOnce(({ onPassword }) => {
    failed = onPassword
    return new Promise((resolve) => {
      finish = resolve
    })
  })
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  upload(new File(["KDH"], "replacement.kdh"))
  await screen.findByRole("link", { name: m.download })
  await act(async () => {
    failed()
    finish(instance)
  })
  expect(mock.dispose).toHaveBeenCalledOnce()
  expect(screen.queryByText(m.protected)).toBeNull()
  expect(
    screen.getByRole("link", { name: m.download }).getAttribute("download")
  ).toBe("replacement.pdf")
})

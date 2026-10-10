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
  page: vi.fn(),
  zoom: vi.fn(),
  find: vi.fn(),
  rotate: vi.fn(),
  destination: vi.fn(),
  thumbnail: vi.fn(),
  outline: vi.fn(),
  dispose: vi.fn(),
  signals: [] as AbortSignal[],
  change: null as null | ((s: object) => void),
  fail: null as null | (() => void),
  password: null as null | (() => void),
}))
vi.mock("@workspace/caj", () => ({ prepareDocument: mock.prepare }))
vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.open }))
const report = {
  format: "caj",
  pagesConverted: 1001,
  omittedPages: [],
  bookmarksWritten: 2,
  outlineWarnings: 0,
  outlineOmitted: false,
  substitutedGlyphs: 0n,
}
const instance = {
  page: mock.page,
  zoom: mock.zoom,
  find: mock.find,
  rotate: mock.rotate,
  destination: mock.destination,
  thumbnail: mock.thumbnail,
  outline: mock.outline,
  dispose: mock.dispose,
}
function upload(value: File = new File(["CAJ"], "paper.caj")) {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [value] },
  })
}
function button(name: string) {
  return screen.getByRole("button", { name })
}
beforeEach(() => {
  vi.resetAllMocks()
  mock.signals = []
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({ matches: true }),
  })
  mock.prepare.mockImplementation(async (_file, signal, progress) => {
    mock.signals.push(signal)
    progress(null)
    progress(0.5)
    return { file: new Blob(["PDF"]), report }
  })
  mock.open.mockImplementation(async ({ onChange, onError, onPassword }) => {
    mock.change = onChange
    mock.fail = onError
    mock.password = onPassword
    onChange({ total: 1001, page: 1, zoom: 100 })
    return instance
  })
  mock.page.mockImplementation((page) => mock.change?.({ page }))
  mock.outline.mockResolvedValue([
    {
      title: "Introduction",
      destination: "intro",
      children: [{ title: "Measurements", destination: [1], children: [] }],
    },
    { title: "No target", destination: null, children: [] },
  ])
  mock.thumbnail.mockResolvedValue(undefined)
})
afterEach(cleanup)

test("downloads the prepared PDF and removes the link when the document closes", async () => {
  const create = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValue("blob:viewer-pdf")
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  try {
    render(<Client messages={m} />)
    upload()
    const link = await screen.findByRole("link", { name: m.download })
    expect(link.getAttribute("download")).toBe("paper.pdf")
    expect(link.getAttribute("href")).toBe("blob:viewer-pdf")
    expect(await (create.mock.calls[0]![0] as Blob).text()).toBe("PDF")
    fireEvent.click(button(m.clear))
    expect(screen.queryByRole("link", { name: m.download })).toBeNull()
    expect(revoke).toHaveBeenCalledWith("blob:viewer-pdf")
  } finally {
    cleanup()
    create.mockRestore()
    revoke.mockRestore()
  }
})

test("reads, navigates, searches, rotates and closes without retaining workers", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  await screen.findByLabelText(m.page)
  fireEvent.click(button(m.next))
  expect(mock.page).toHaveBeenCalledWith(2)
  fireEvent.click(button(m.fitPage))
  expect(mock.zoom).toHaveBeenCalledWith("page-fit")
  fireEvent.click(button(m.rotate))
  expect(mock.rotate).toHaveBeenCalledOnce()
  fireEvent.click(button(m.search))
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "river" },
  })
  fireEvent.click(button(m.find))
  expect(mock.find).toHaveBeenCalledWith("river")
  fireEvent.click(button(m.closeSearch))
  expect(mock.find).toHaveBeenLastCalledWith("")
  fireEvent.click(button(m.overview))
  await screen.findByText("Measurements")
  fireEvent.click(screen.getByText("Introduction"))
  expect(mock.destination).toHaveBeenCalledWith("intro")
  fireEvent.click(screen.getByText("Measurements"))
  expect(mock.destination).toHaveBeenCalledWith([1])
  expect(button("No target").hasAttribute("disabled")).toBe(true)
  fireEvent.click(button(m.nextPreviews))
  expect(screen.getByText("Pages 7–12 of 1001")).toBeTruthy()
  fireEvent.click(button(m.previousPreviews))
  expect(screen.getByText("Pages 1–6 of 1001")).toBeTruthy()
  fireEvent.click(button("Open page 5"))
  expect(mock.page).toHaveBeenLastCalledWith(5)
  fireEvent.keyDown(screen.getByRole("complementary"), { key: "Escape" })
  expect(screen.queryByRole("complementary")).toBeNull()
  expect(document.activeElement).toBe(button(m.overview))
  fireEvent.click(button(m.clear))
  expect(mock.signals[0]!.aborted).toBe(true)
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("returns focus to mobile page after selecting a thumbnail and resets preview groups", async () => {
  vi.mocked(window.matchMedia).mockReturnValue({
    matches: false,
  } as MediaQueryList)
  render(<Client messages={m} />)
  upload()
  await screen.findByLabelText(m.page)
  fireEvent.click(button(m.overview))
  await screen.findByText("Introduction")
  fireEvent.click(button("Open page 2"))
  await waitFor(() => expect(screen.queryByRole("complementary")).toBeNull())
  expect(document.activeElement).toBe(
    screen.getByRole("region", { name: m.reader })
  )
  fireEvent.click(button(m.overview))
  fireEvent.click(button(m.nextPreviews))
  fireEvent.click(button(m.next))
  expect(screen.getByText("Pages 1–6 of 1001")).toBeTruthy()
  fireEvent.click(button(m.closeOverview))
  expect(document.activeElement).toBe(button(m.overview))
  fireEvent.click(button(m.overview))
  fireEvent.click(await screen.findByText("Introduction"))
  await waitFor(() => expect(screen.queryByRole("complementary")).toBeNull())
})

test("shows meaningful errors, warning notes and unavailable thumbnails", async () => {
  render(<Client messages={m} />)
  upload(new File(["bad"], "bad.txt"))
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  mock.prepare.mockRejectedValueOnce(
    Object.assign(new Error("text needs fonts"), { code: "HNC8" })
  )
  upload()
  expect(await screen.findByText(m.fontsRequired)).toBeTruthy()
  mock.prepare.mockResolvedValueOnce({
    file: new Blob(["PDF"]),
    report: {
      ...report,
      format: "hn",
      substitutedGlyphs: 2n,
      outlineWarnings: 1,
    },
  })
  mock.thumbnail.mockRejectedValue(new Error("bad page"))
  mock.outline.mockResolvedValue([])
  upload()
  await screen.findByLabelText(m.page)
  expect(screen.getByText(m.experimental)).toBeTruthy()
  expect(screen.getByText(m.substituted)).toBeTruthy()
  expect(screen.getByText(m.outlineWarning)).toBeTruthy()
  fireEvent.click(button(m.overview))
  await waitFor(() =>
    expect(screen.getAllByText(m.thumbnailError).length).toBe(6)
  )
  expect(screen.getByText(m.noBookmarks)).toBeTruthy()
  act(() => mock.fail?.())
  expect(await screen.findByText(m.missingPages)).toBeTruthy()
  upload()
  await screen.findByLabelText(m.page)
  act(() => mock.password?.())
  expect(await screen.findByText(m.protected)).toBeTruthy()
})

test("cancels replacement and ignores a late old reader result", async () => {
  let finish!: (value: typeof instance) => void
  mock.open.mockImplementationOnce(({ onChange }) => {
    onChange({ total: 3 })
    return new Promise((resolve) => {
      finish = resolve
    })
  })
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  upload(new File(["CAJ"], "replacement.nh"))
  await screen.findByLabelText(m.page)
  await waitFor(() => expect(mock.signals[0]!.aborted).toBe(true))
  await act(async () => finish(instance))
  expect(mock.dispose).toHaveBeenCalledOnce()
  fireEvent.click(button(m.clear))
  expect(mock.signals[1]!.aborted).toBe(true)
})

test("cancels conversion before page allocation and ignores late progress and errors", async () => {
  let reject!: (reason: unknown) => void
  let progress!: (n: number | null) => void
  mock.prepare.mockImplementationOnce((_file, signal, onProgress) => {
    mock.signals.push(signal)
    progress = onProgress
    return new Promise((_resolve, fail) => {
      reject = fail
    })
  })
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.prepare).toHaveBeenCalledOnce())
  fireEvent.click(button(m.clear))
  await act(async () => {
    progress(0.8)
    reject(new Error("late"))
  })
  expect(mock.open).not.toHaveBeenCalled()
  expect(screen.queryByText(m.invalid)).toBeNull()
})

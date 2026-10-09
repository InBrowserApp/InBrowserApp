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
  open: vi.fn(),
  page: vi.fn(),
  dispose: vi.fn(),
  signals: [] as AbortSignal[],
}))
vi.mock("./open", () => ({ openDocument: mock.open }))
const page = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"/>',
  width: 600,
  height: 800,
}
const upload = (file = new File(["HWP"], "book.hwp")) =>
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [file] },
  })
const button = (name: string) => screen.getByRole("button", { name })
beforeEach(() => {
  vi.resetAllMocks()
  mock.signals = []
  mock.page.mockResolvedValue(page)
  mock.open.mockImplementation(async (_file, signal) => {
    mock.signals.push(signal)
    signal.addEventListener("abort", mock.dispose)
    return { total: 1001, page: mock.page, dispose: mock.dispose }
  })
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(640)
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(500)
  vi.spyOn(HTMLElement.prototype, "scrollTo").mockImplementation(() => {})
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:page")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
test("reads over 1000 pages, commits page input, fits, rotates and releases resources", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  await screen.findByRole("img")
  fireEvent.click(button(m.next))
  await waitFor(() => expect(mock.page).toHaveBeenCalledWith(1))
  const input = screen.getByLabelText(m.page)
  fireEvent.change(input, { target: { value: "1001" } })
  expect(mock.page).not.toHaveBeenCalledWith(1000)
  fireEvent.keyDown(input, { key: "Enter" })
  await waitFor(() => expect(mock.page).toHaveBeenCalledWith(1000))
  fireEvent.click(button(m.previous))
  fireEvent.click(button(m.zoomIn))
  fireEvent.click(button(m.zoomOut))
  fireEvent.click(button(m.fitPage))
  fireEvent.click(button(m.rotate))
  fireEvent.click(button(m.fit))
  await screen.findByRole("img")
  fireEvent.click(button(m.clear))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(mock.signals[0]!.aborted).toBe(true)
  expect(URL.revokeObjectURL).toHaveBeenCalled()
})
test("rejects empty and unrelated files before starting the engine", async () => {
  render(<Client messages={m} />)
  upload(new File([], "empty.hwp"))
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  upload(new File(["x"], "file.pdf"))
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  expect(mock.open).not.toHaveBeenCalled()
})
test("reports protected and allocation failures and allows replacement", async () => {
  mock.open.mockRejectedValueOnce(new Error("protected"))
  render(<Client messages={m} />)
  upload()
  expect(await screen.findByText(m.protected)).toBeTruthy()
  upload(new File(["x"], "next.hwpx"))
  await screen.findByRole("img")
})
test("closing during open cannot resurrect old content", async () => {
  let resolve!: (value: object) => void
  mock.open.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  upload()
  await screen.findByText(m.loading)
  await waitFor(() => expect(mock.open).toHaveBeenCalled())
  fireEvent.click(button(m.clear))
  await act(async () =>
    resolve({ total: 1, page: mock.page, dispose: mock.dispose })
  )
  expect(mock.dispose).toHaveBeenCalledOnce()
  expect(screen.queryByLabelText(m.page)).toBeNull()
})
test("stale open errors and page replies do not replace the current document", async () => {
  let reject!: (reason: Error) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((_done, fail) => {
        reject = fail
      })
  )
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.open).toHaveBeenCalled())
  upload(new File(["next"], "next.hwpx"))
  await screen.findByRole("img")
  await act(async () => reject(new Error("protected")))
  expect(screen.queryByText(m.protected)).toBeNull()
  let resolve!: (value: typeof page) => void
  mock.page.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  fireEvent.click(button(m.next))
  await screen.findByText(m.rendering)
  fireEvent.click(button(m.next))
  await screen.findByRole("img", { name: "Page 3" })
  await act(async () => resolve(page))
  expect(screen.getByRole("img", { name: "Page 3" })).toBeTruthy()
})
test("page failures keep navigation usable and image failures are explained", async () => {
  mock.page.mockRejectedValueOnce(new Error("out of memory"))
  render(<Client messages={m} />)
  upload()
  expect(await screen.findByText(m.resourceLimit)).toBeTruthy()
  fireEvent.click(button(m.next))
  const image = await screen.findByRole("img")
  fireEvent.error(image)
  expect(screen.getAllByText(m.pageError).length).toBeGreaterThan(0)
  mock.page.mockRejectedValueOnce(new Error("bad page"))
  fireEvent.click(button(m.next))
  await waitFor(() =>
    expect(screen.getAllByText(m.pageError).length).toBeGreaterThan(0)
  )
})
test("opens compatibility guidance when a page loses an embedded resource", async () => {
  mock.page.mockResolvedValueOnce({ ...page, limited: true })
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("img")
  expect(screen.getByText(m.compatibility).closest("details")?.open).toBe(true)
  expect(screen.getByRole("status").textContent).toBe(m.contentNotice)
})

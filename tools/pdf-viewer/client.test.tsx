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
import type { openReader } from "@workspace/pdf-reader"

const mock = vi.hoisted(() => ({
  open: vi.fn(),
  page: vi.fn(),
  zoom: vi.fn(),
  find: vi.fn(),
  dispose: vi.fn(),
}))
vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.open }))
const instance = {
  page: mock.page,
  zoom: mock.zoom,
  find: mock.find,
  dispose: mock.dispose,
}
type Options = Parameters<typeof openReader>[0]
const file = (name = "read.pdf") => new File(["%PDF-1.7"], name)
function choose(value = file()) {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [value] },
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  mock.open.mockImplementation(async ({ onChange }: Options) => {
    onChange({ total: 3, page: 1 })
    return instance
  })
})
afterEach(cleanup)

test("opens local files, navigates, searches, zooms and clears", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  const picker = screen.getByLabelText(m.open)
  const click = vi.spyOn(picker, "click")
  fireEvent.click(screen.getByRole("button", { name: m.open }))
  expect(click).toHaveBeenCalledOnce()
  // Flush the lazy reader and toolbar mount effects before editing a page.
  await act(async () => {
    choose()
    await vi.dynamicImportSettled()
  })
  await screen.findByLabelText(m.page)
  fireEvent.click(screen.getByLabelText(m.next))
  expect(mock.page).toHaveBeenCalledWith(2)
  fireEvent.change(screen.getByLabelText(m.page), { target: { value: "3" } })
  fireEvent.keyDown(screen.getByLabelText(m.page), { key: "Enter" })
  expect(mock.page).toHaveBeenCalledWith(3)
  fireEvent.change(screen.getByLabelText(m.page), { target: { value: "9" } })
  fireEvent.keyDown(screen.getByLabelText(m.page), { key: "Enter" })
  expect(mock.page).toHaveBeenCalledTimes(2)
  fireEvent.change(screen.getByLabelText(m.zoom), { target: { value: "150" } })
  fireEvent.keyDown(screen.getByLabelText(m.zoom), { key: "Enter" })
  expect(mock.zoom).toHaveBeenCalledWith(150)
  fireEvent.change(screen.getByLabelText(m.zoom), { target: { value: "900" } })
  fireEvent.keyDown(screen.getByLabelText(m.zoom), { key: "Enter" })
  expect(mock.zoom).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  expect(mock.zoom).toHaveBeenCalledWith("page-width")
  fireEvent.click(screen.getByRole("button", { name: m.search }))
  fireEvent.change(screen.getByRole("searchbox", { name: m.search }), {
    target: { value: " local " },
  })
  fireEvent.submit(
    screen.getByRole("searchbox", { name: m.search }).closest("form")!
  )
  expect(mock.find).toHaveBeenCalledWith("local")
  fireEvent.click(screen.getByLabelText(m.previousMatch))
  expect(mock.find).toHaveBeenCalledWith("local", true)
  fireEvent.click(screen.getByLabelText(m.nextMatch))
  fireEvent.change(screen.getByRole("searchbox", { name: m.search }), {
    target: { value: "" },
  })
  expect(mock.find).toHaveBeenCalledWith("")
  fireEvent.click(screen.getByLabelText(m.clear))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect((mock.open.mock.calls[0]![0] as Options).signal.aborted).toBe(true)
})

test("does not parse invalid or empty files", async () => {
  render(<Client messages={m} />)
  choose(file("text.txt"))
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  choose(new File([], "empty.pdf"))
  await screen.findByText(m.invalid)
  expect(mock.open).not.toHaveBeenCalled()
})

test("retries passwords without retaining them after submission", async () => {
  let complete!: (value: typeof instance) => void
  let options!: Options
  const submit = vi.fn(() => options.onPassword(submit, true))
  mock.open.mockImplementation((value: Options) => {
    options = value
    value.onPassword(submit, false)
    return new Promise((resolve) => {
      complete = resolve
    })
  })
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.passwordHint)
  fireEvent.change(screen.getByLabelText(m.password), {
    target: { value: "wrong" },
  })
  fireEvent.submit(screen.getByLabelText(m.password).closest("form")!)
  expect(submit).toHaveBeenCalledWith("wrong")
  // The worker's next password event arrives asynchronously.
  options.onPassword(submit, true)
  await screen.findByText(m.wrongPassword)
  expect(screen.getByLabelText(m.password)).toHaveProperty("value", "")
  options.onChange({ total: 3 })
  complete(instance)
  await screen.findByLabelText(m.page)
  expect(screen.queryByLabelText(m.password)).toBeNull()
})

test("ignores stale results and failures when files are replaced or closed", async () => {
  let finish!: (value: typeof instance) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  choose(file("old.pdf"))
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  const old = mock.open.mock.calls[0]![0] as Options
  fireEvent.dragOver(screen.getByText(m.loading).closest("section")!)
  fireEvent.drop(screen.getByText(m.loading).closest("section")!, {
    dataTransfer: { files: [file("new.pdf")] },
  })
  await screen.findByLabelText(m.page)
  expect(old.signal.aborted).toBe(true)
  old.onChange({ total: 999 })
  old.onPassword(vi.fn(), false)
  old.onError()
  finish(instance)
  await waitFor(() => expect(mock.dispose).toHaveBeenCalledOnce())
  expect(screen.getByText("of 3")).toBeTruthy()
  expect(screen.queryByText(m.invalid)).toBeNull()
})

test("reports parse and render failures", async () => {
  mock.open.mockRejectedValueOnce(new Error("broken"))
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.invalid)
  choose(file("good.pdf"))
  await screen.findByLabelText(m.page)
  const options = mock.open.mock.calls.at(-1)![0] as Options
  fireEvent.click(screen.getByRole("button", { name: m.search }))
  options.onChange({ page: 2, searching: true })
  await screen.findByText(m.searching)
  fireEvent.click(screen.getByLabelText(m.previous))
  expect(mock.page).toHaveBeenCalledWith(1)
  options.onChange({ searching: false, current: 2, matches: 4 })
  await screen.findByText("2 of 4 matches")
  options.onError()
  await screen.findByText(m.invalid)
})

test("attempts to open files above the former 50 MB cap", async () => {
  render(<Client messages={m} />)
  const large = file()
  Object.defineProperty(large, "size", { value: 50 * 1024 * 1024 + 1 })
  choose(large)
  await screen.findByLabelText(m.page)
  expect(mock.open).toHaveBeenCalledWith(
    expect.objectContaining({ file: large })
  )
  expect(screen.queryByRole("alert")).toBeNull()
})

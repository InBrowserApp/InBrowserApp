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
import type { openReader } from "./reader"

const mock = vi.hoisted(() => ({
  open: vi.fn(),
  page: vi.fn(),
  zoom: vi.fn(),
  fitPage: vi.fn(),
  find: vi.fn(),
  dispose: vi.fn(),
  convert: vi.fn(),
}))
vi.mock("./reader", () => ({ openReader: mock.open }))
vi.mock("@workspace/pptx-markdown", () => ({ exportDocument: mock.convert }))
const instance = {
  page: mock.page,
  zoom: mock.zoom,
  fitPage: mock.fitPage,
  find: mock.find,
  dispose: mock.dispose,
  thumbnail: async () => {},
}
type Options = Parameters<typeof openReader>[0]
const file = (name = "read.pptx") => new File(["PPTX"], name)
function choose(value = file()) {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [value] },
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:markdown")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  mock.convert.mockResolvedValue({ text: "# Slides\n\nSpeaker notes" })
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
  mock.open.mockImplementation(async ({ onChange }: Options) => {
    onChange({ total: 3, page: 1 })
    return instance
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("opens local files, navigates, searches, zooms and clears", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  const picker = screen.getByLabelText(m.open)
  const click = vi.spyOn(picker, "click")
  fireEvent.click(screen.getByRole("button", { name: m.open }))
  expect(click).toHaveBeenCalledOnce()
  await act(async () => choose())
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
  fireEvent.click(screen.getByRole("button", { name: m.fitPage }))
  expect(mock.fitPage).toHaveBeenCalledOnce()
  const toggle = screen.getByRole("button", { name: m.thumbnails })
  const shown = toggle.getAttribute("aria-expanded") === "true"
  fireEvent.click(toggle)
  expect(toggle.getAttribute("aria-expanded")).toBe(String(!shown))
  fireEvent.click(toggle)
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

test.each(["pptx", "pptm", "potx", "potm", "ppsx", "ppsm", "PPSM"])(
  "opens modern presentations, slideshows and templates: %s",
  async (extension) => {
    render(<Client messages={m} />)
    const presentation = file(`read.${extension}`)
    choose(presentation)
    await screen.findByLabelText(m.page)
    expect(mock.open).toHaveBeenCalledWith(
      expect.objectContaining({ file: presentation })
    )
  }
)

test("does not parse unrelated, legacy, misleading or empty files", async () => {
  render(<Client messages={m} />)
  for (const name of ["text.txt", "old.ppt", "file.ppsx.zip", "pptm"]) {
    choose(file(name))
    expect(await screen.findByText(m.invalid)).toBeTruthy()
  }
  for (const extension of ["pptx", "pptm", "potx", "potm", "ppsx", "ppsm"]) {
    choose(new File([], `empty.${extension}`))
    await screen.findByText(m.invalid)
  }
  expect(mock.open).not.toHaveBeenCalled()
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
  choose(file("old.pptx"))
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  const old = mock.open.mock.calls[0]![0] as Options
  fireEvent.dragOver(screen.getByText(m.loading).closest("section")!)
  fireEvent.drop(screen.getByText(m.loading).closest("section")!, {
    dataTransfer: { files: [file("new.pptx")] },
  })
  await screen.findByLabelText(m.page)
  expect(old.signal.aborted).toBe(true)
  old.onChange({ total: 999 })
  old.onError(new Error("stale"))
  finish(instance)
  await waitFor(() => expect(mock.dispose).toHaveBeenCalledOnce())
  expect(screen.getByText("of 3")).toBeTruthy()
  expect(screen.queryByText(m.invalid)).toBeNull()
})

test("reports parse, render and resource limit failures", async () => {
  mock.open.mockRejectedValueOnce(new Error("broken"))
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.invalid)
  mock.open.mockRejectedValueOnce(new Error("TOO_LARGE"))
  choose(file("long.pptx"))
  await screen.findByText(m.resourceLimit)
  choose(file("good.pptx"))
  await screen.findByLabelText(m.page)
  const options = mock.open.mock.calls.at(-1)![0] as Options
  fireEvent.click(screen.getByRole("button", { name: m.search }))
  options.onChange({ page: 2, searching: true })
  await screen.findByText(m.searching)
  fireEvent.click(screen.getByLabelText(m.previous))
  expect(mock.page).toHaveBeenCalledWith(1)
  options.onChange({ searching: false, current: 2, matches: 4 })
  await screen.findByText("2 of 4 matches")
  options.onError(new Error("render"))
  await screen.findByText(m.invalid)
})

test("reports archive and decoded image limits without exposing parser details", async () => {
  render(<Client messages={m} />)
  for (const code of ["ooxml-resource-limit", "ooxml-decoded-image-limit"]) {
    mock.open.mockRejectedValueOnce(
      Object.assign(new Error("private parser detail"), { code })
    )
    choose(file(`${code}.pptx`))
    await screen.findByText(m.resourceLimit)
    expect(screen.queryByText("private parser detail")).toBeNull()
  }
})

test("explains an empty presentation", async () => {
  mock.open.mockRejectedValueOnce(new Error("EMPTY"))
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.empty)
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

test("exports Markdown on request and removes the download immediately when replacing the source", async () => {
  render(<Client messages={m} />)
  const source = file("talk.PPTM")
  choose(source)
  const exportButton = await screen.findByRole("button", {
    name: m.markdown.export,
  })
  expect(mock.convert).not.toHaveBeenCalled()
  fireEvent.click(exportButton)
  const download = await screen.findByRole("link", {
    name: m.markdown.download,
  })
  expect(download.getAttribute("download")).toBe("talk.md")
  expect(mock.convert).toHaveBeenCalledWith(
    { file: source },
    m.markdown.labels,
    expect.any(AbortSignal)
  )
  expect(
    await (vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob).text()
  ).toContain("Speaker notes")
  expect(screen.getByText(m.markdown.note)).toBeTruthy()
  choose(file("replacement.pptx"))
  expect(screen.queryByRole("link", { name: m.markdown.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:markdown")
  await screen.findByRole("button", { name: m.markdown.export })
})

test("cancels Markdown work on close and ignores late success or failure", async () => {
  render(<Client messages={m} />)
  for (const outcome of ["resolve", "reject"] as const) {
    let finish!: () => void
    mock.convert.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          finish = () =>
            outcome === "resolve"
              ? resolve({ text: "stale" })
              : reject(new Error("late"))
        })
    )
    choose()
    fireEvent.click(
      await screen.findByRole("button", { name: m.markdown.export })
    )
    await waitFor(() =>
      expect(mock.convert.mock.calls.length).toBe(outcome === "resolve" ? 1 : 2)
    )
    const signal = mock.convert.mock.calls.at(-1)![2] as AbortSignal
    fireEvent.click(screen.getByRole("button", { name: m.clear }))
    expect(signal.aborted).toBe(true)
    await act(async () => finish())
    expect(screen.queryByRole("link", { name: m.markdown.download })).toBeNull()
    expect(screen.queryByRole("alert")).toBeNull()
  }
})

test("explains Markdown failures without discarding the slide reader", async () => {
  render(<Client messages={m} />)
  choose()
  await screen.findByRole("button", { name: m.markdown.export })
  for (const error of ["resource", "invalid"] as const) {
    mock.convert.mockResolvedValueOnce({ error })
    fireEvent.click(screen.getByRole("button", { name: m.markdown.export }))
    await screen.findByText(
      error === "resource" ? m.markdown.resource : m.markdown.error
    )
    expect(screen.queryByRole("link", { name: m.markdown.download })).toBeNull()
    expect(screen.getByLabelText(m.page)).toBeTruthy()
  }
})

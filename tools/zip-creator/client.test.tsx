import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import ZipCreator from "./client"
import { createZip } from "./core/zip"
import m from "./messages/en.json"

import type { FolderHandle } from "./core/selection"

vi.mock("./core/zip", () => ({ createZip: vi.fn() }))
const button = (name: string) => screen.getByRole("button", { name })
const fileInput = () => screen.getByLabelText(m.addFiles, { selector: "input" })
const folderInput = () =>
  screen.getByLabelText(m.addFolder, { selector: "input" })
const source = (name: string) => new File(["contents"], name)
const add = (...files: File[]) =>
  fireEvent.change(fileInput(), { target: { files } })
const dropZone = () =>
  screen.getByText(m.dropTitle).closest("div.border-dashed")!.parentElement!
const mount = () => render(<ZipCreator messages={m} lang="en" />)
beforeEach(() => {
  vi.mocked(createZip)
    .mockReset()
    .mockResolvedValue(new Blob(["zip"]))
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:created-zip")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it("provides separate file and folder pickers, a disabled empty action and resettable inputs", async () => {
  mount()
  expect(button(m.create)).toHaveProperty("disabled", true)
  expect(screen.getByText(m.emptyTitle)).toBeTruthy()
  const filesClick = vi.spyOn(fileInput() as HTMLInputElement, "click")
  const foldersClick = vi.spyOn(folderInput() as HTMLInputElement, "click")
  fireEvent.click(button(m.addFiles))
  expect(filesClick).toHaveBeenCalledOnce()
  fireEvent.click(button(m.addFolder))
  expect(foldersClick).toHaveBeenCalledOnce()
  fireEvent.change(fileInput(), { target: { files: [] } })
  fireEvent.change(folderInput(), { target: { files: [] } })
  add(source("report.txt"))
  await screen.findByText("report.txt")
  expect(button(m.create)).toHaveProperty("disabled", false)
  expect(fileInput()).toHaveProperty("value", "")
  const nested = source("notes.txt")
  Object.defineProperty(nested, "webkitRelativePath", {
    value: "Work/sub/notes.txt",
  })
  fireEvent.change(folderInput(), { target: { files: [nested] } })
  await screen.findByRole("button", { name: "Work" })
  fireEvent.click(button("Work"))
  fireEvent.click(button("sub"))
  expect(screen.getByText("notes.txt")).toBeTruthy()
  fireEvent.click(button(m.goUp))
  expect(button("sub")).toBeTruthy()
  fireEvent.click(button(m.root))
  expect(screen.getByText("report.txt")).toBeTruthy()
})

it("supports a modern folder picker with an entirely empty directory", async () => {
  const empty: FolderHandle = {
    name: "Empty",
    kind: "directory",
    values: async function* () {},
  }
  vi.stubGlobal("showDirectoryPicker", vi.fn().mockResolvedValue(empty))
  mount()
  fireEvent.click(button(m.addFolder))
  await screen.findByRole("button", { name: "Empty" })
  fireEvent.click(button("Empty"))
  expect(screen.getByText(m.emptyFolder)).toBeTruthy()
  fireEvent.click(button(m.create))
  await screen.findByRole("link", { name: m.download })
  expect(createZip).toHaveBeenCalledWith(
    [{ path: "Empty", file: null }],
    6,
    expect.any(AbortSignal),
    expect.any(Function)
  )
})

it("keeps drag feedback stable across child enter/leave and accepts another drop after files were added", async () => {
  mount()
  const zone = dropZone()
  const transfer = {
    types: ["Files"],
    items: [],
    files: [source("dropped.txt")],
  }
  fireEvent.dragEnter(zone, { dataTransfer: transfer })
  fireEvent.dragEnter(zone, { dataTransfer: transfer })
  expect(zone.className).toContain("border-primary")
  fireEvent.dragLeave(zone)
  expect(zone.className).toContain("border-primary")
  fireEvent.dragLeave(zone)
  expect(zone.className).not.toContain("border-primary")
  fireEvent.dragOver(zone, { dataTransfer: transfer })
  fireEvent.drop(zone, { dataTransfer: transfer })
  await screen.findByText("dropped.txt")
  fireEvent.drop(zone, { dataTransfer: transfer })
  await screen.findByText("dropped (2).txt")
  expect(screen.getByText(m.renamed)).toBeTruthy()
  fireEvent.dragEnter(zone, { dataTransfer: { types: ["text/plain"] } })
  expect(zone.className).not.toContain("border-primary")
})

it("shows read errors and removes complete subtrees with undo and clear", async () => {
  mount()
  const file = source("report.txt")
  Object.defineProperty(file, "webkitRelativePath", {
    value: "Work/report.txt",
  })
  fireEvent.change(folderInput(), { target: { files: [file] } })
  await screen.findByRole("button", { name: "Work" })
  fireEvent.click(button(m.remove.replace("{name}", "Work")))
  expect(screen.getByText(m.emptyTitle)).toBeTruthy()
  fireEvent.click(button(m.undo))
  expect(button("Work")).toBeTruthy()
  fireEvent.click(button("Work"))
  fireEvent.click(button(m.remove.replace("{name}", "report.txt")))
  expect(screen.getByText(m.emptyFolder)).toBeTruthy()
  fireEvent.click(button(m.undo))
  expect(screen.getByText("report.txt")).toBeTruthy()
  fireEvent.click(button(m.clear))
  expect(screen.getByText(m.emptyTitle)).toBeTruthy()
  fireEvent.click(button(m.undo))
  fireEvent.drop(dropZone(), { dataTransfer: { items: [], files: [] } })
  await screen.findByRole("alert")
  expect(screen.getByText(m.readError)).toBeTruthy()
  expect(button("Work")).toBeTruthy()
})

it("paginates long folders without hiding files from the generated ZIP", async () => {
  mount()
  add(
    ...Array.from({ length: 105 }, (_, i) =>
      source(`file-${String(i).padStart(3, "0")}.txt`)
    )
  )
  await screen.findByText("file-000.txt")
  expect(screen.queryByText("file-050.txt")).toBeNull()
  fireEvent.click(button(m.next))
  expect(screen.getByText("file-050.txt")).toBeTruthy()
  fireEvent.click(button(m.next))
  expect(screen.getByText("file-104.txt")).toBeTruthy()
  expect(button(m.next)).toHaveProperty("disabled", true)
  fireEvent.click(button(m.previous))
  expect(screen.getByText("file-050.txt")).toBeTruthy()
  fireEvent.click(button(m.create))
  await screen.findByRole("link", { name: m.download })
  expect(vi.mocked(createZip).mock.calls[0]![0]).toHaveLength(105)
})

it("names downloads, validates filenames inline and withdraws stale results", async () => {
  mount()
  add(source("file.txt"))
  await screen.findByText("file.txt")
  const input = screen.getByLabelText(m.filename)
  fireEvent.change(input, { target: { value: "../invalid" } })
  expect(input.getAttribute("aria-invalid")).toBe("true")
  expect(screen.getByText(m.filenameError)).toBeTruthy()
  expect(button(m.create)).toHaveProperty("disabled", true)
  fireEvent.change(input, { target: { value: "My Photos.ZIP" } })
  fireEvent.click(button(m.create))
  const download = await screen.findByRole("link", { name: m.download })
  expect(download.getAttribute("download")).toBe("My Photos.zip")
  expect(download.getAttribute("href")).toBe("blob:created-zip")
  fireEvent.change(input, { target: { value: "changed" } })
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:created-zip")
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" })
  await screen.findByRole("option", { name: m.store })
  fireEvent.click(screen.getByRole("option", { name: m.store }))
  fireEvent.click(button(m.create))
  await screen.findByRole("link", { name: m.download })
  expect(vi.mocked(createZip).mock.lastCall![1]).toBe(0)
})

it("announces progress, disables mutation and cancels generation without losing source files", async () => {
  let resolve!: (blob: Blob) => void
  vi.mocked(createZip).mockImplementationOnce(
    async (_items, _level, _signal, progress) => {
      progress({ path: "file.txt", percent: 42 })
      return new Promise<Blob>((yes) => {
        resolve = yes
      })
    }
  )
  mount()
  add(source("file.txt"))
  await screen.findByText("file.txt")
  fireEvent.click(button(m.create))
  await screen.findByRole("progressbar")
  expect(screen.getByText("42%")).toBeTruthy()
  expect(button(m.addFiles)).toHaveProperty("disabled", true)
  const zone = dropZone()
  const transfer = {
    types: ["Files"],
    items: [],
    files: [source("ignored.txt")],
  }
  fireEvent.dragEnter(zone, { dataTransfer: transfer })
  fireEvent.dragOver(zone, { dataTransfer: transfer })
  fireEvent.drop(zone, { dataTransfer: transfer })
  fireEvent.click(button(m.cancel))
  expect(screen.getByText(m.cancelled)).toBeTruthy()
  await act(async () => resolve(new Blob(["stale"])))
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(screen.queryByText("ignored.txt")).toBeNull()
  expect(button(m.create)).toHaveProperty("disabled", false)
})

it("can cancel a pending directory picker and recover after generation errors", async () => {
  let resolve!: (value: FolderHandle) => void
  vi.stubGlobal(
    "showDirectoryPicker",
    () =>
      new Promise<FolderHandle>((yes) => {
        resolve = yes
      })
  )
  mount()
  fireEvent.click(button(m.addFolder))
  expect(screen.getAllByText(m.reading).length).toBeGreaterThan(0)
  fireEvent.click(button(m.cancel))
  await act(async () =>
    resolve({ name: "old", kind: "directory", values: async function* () {} })
  )
  expect(screen.queryByRole("button", { name: "old" })).toBeNull()
  add(source("keep.txt"))
  await screen.findByText("keep.txt")
  vi.mocked(createZip).mockRejectedValueOnce(new Error("read failed"))
  fireEvent.click(button(m.create))
  await screen.findByText(m.createError)
  fireEvent.click(button(m.create))
  await waitFor(() =>
    expect(screen.getByRole("link", { name: m.download })).toBeTruthy()
  )
  expect(screen.queryByRole("alert")).toBeNull()
})

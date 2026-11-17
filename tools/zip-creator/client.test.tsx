import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  within,
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
async function menu(name: string, label: string) {
  fireEvent.keyDown(button(m.actions.replace("{name}", name)), {
    key: "ArrowDown",
  })
  fireEvent.click(await screen.findByRole("menuitem", { name: label }))
}
it.each(["ar", "he"])(
  "uses RTL direction in compression controls for %s",
  (lang) => {
    render(<ZipCreator messages={m} lang={lang} />)
    expect(screen.getByRole("combobox").getAttribute("dir")).toBe("rtl")
  }
)
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

it("opens folders from their icon and navigates directly to an ancestor", async () => {
  mount()
  const file = source("notes.txt")
  Object.defineProperty(file, "webkitRelativePath", {
    value: "Work/sub/deep/notes.txt",
  })
  fireEvent.change(folderInput(), { target: { files: [file] } })
  await screen.findByRole("button", { name: "Work" })
  fireEvent.click(button("Work").querySelector("svg")!)
  fireEvent.click(button("sub"))
  fireEvent.click(button("deep"))
  expect(screen.getByText("notes.txt")).toBeTruthy()
  fireEvent.click(button("Work"))
  expect(button("sub")).toBeTruthy()
  expect(screen.queryByText("notes.txt")).toBeNull()
  fireEvent.click(button(m.root))
  expect(button("Work")).toBeTruthy()
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
  await menu("Work", m.remove.replace("{name}", "Work"))
  expect(screen.getByText(m.emptyTitle)).toBeTruthy()
  fireEvent.click(button(m.undo))
  expect(button("Work")).toBeTruthy()
  fireEvent.click(button("Work"))
  await menu("report.txt", m.remove.replace("{name}", "report.txt"))
  expect(screen.getByText(m.emptyFolder)).toBeTruthy()
  fireEvent.click(button(m.undo))
  expect(screen.getByText("report.txt")).toBeTruthy()
  fireEvent.click(button(m.clear))
  expect(screen.getByText(m.emptyTitle)).toBeTruthy()
  fireEvent.click(button(m.undo))
  fireEvent.drop(dropZone(), {
    dataTransfer: { types: ["Files"], items: [], files: [] },
  })
  await screen.findByRole("alert")
  expect(screen.getByText(m.readError)).toBeTruthy()
  expect(screen.getByText("report.txt")).toBeTruthy()
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

it("creates folders from an empty ZIP, validates names and adds into the current directory", async () => {
  mount()
  fireEvent.click(button(m.newFolder))
  const dialog = await screen.findByRole("dialog")
  const name = within(dialog).getByLabelText(m.name)
  fireEvent.change(name, { target: { value: "../bad" } })
  fireEvent.click(within(dialog).getByRole("button", { name: m.newFolder }))
  expect(within(dialog).getByRole("alert").textContent).toBe(m.entryNameError)
  fireEvent.change(name, { target: { value: "Project" } })
  fireEvent.click(within(dialog).getByRole("button", { name: m.newFolder }))
  expect(screen.queryByRole("dialog")).toBeNull()
  expect(screen.getByText(m.emptyFolder)).toBeTruthy()
  add(source("report.txt"))
  await screen.findByText("report.txt")
  fireEvent.click(button(m.create))
  await screen.findByRole("link", { name: m.download })
  expect(
    vi.mocked(createZip).mock.lastCall![0].map((item) => item.path)
  ).toEqual(["Project", "Project/report.txt"])
  fireEvent.click(button(m.undo))
  expect(screen.queryByText("report.txt")).toBeNull()
  expect(screen.getByText(m.emptyFolder)).toBeTruthy()
})

it("renames without overwriting, moves via the menu and restores the previous directory on undo", async () => {
  mount()
  add(source("a.txt"), source("b.txt"))
  await screen.findByText("a.txt")
  await menu("a.txt", m.rename)
  let dialog = await screen.findByRole("dialog")
  let input = within(dialog).getByLabelText(m.name)
  expect(input).toHaveProperty("value", "a.txt")
  fireEvent.change(input, { target: { value: "B.txt" } })
  fireEvent.click(within(dialog).getByRole("button", { name: m.save }))
  expect(within(dialog).getByRole("alert").textContent).toBe(m.nameExists)
  fireEvent.change(input, { target: { value: "renamed.txt" } })
  fireEvent.click(within(dialog).getByRole("button", { name: m.save }))
  expect(screen.getByText("renamed.txt")).toBeTruthy()
  fireEvent.click(button(m.newFolder))
  dialog = await screen.findByRole("dialog")
  input = within(dialog).getByLabelText(m.name)
  fireEvent.change(input, { target: { value: "Project" } })
  fireEvent.click(within(dialog).getByRole("button", { name: m.newFolder }))
  fireEvent.click(button(m.root))
  await menu("renamed.txt", m.move)
  dialog = await screen.findByRole("dialog")
  expect(
    within(dialog).getByRole("button", { name: m.moveHere })
  ).toHaveProperty("disabled", true)
  fireEvent.click(within(dialog).getByRole("button", { name: "Project" }))
  expect(within(dialog).getByText(m.noFolders)).toBeTruthy()
  fireEvent.click(within(dialog).getByRole("button", { name: m.moveHere }))
  expect(screen.queryByText("renamed.txt")).toBeNull()
  fireEvent.click(button("Project"))
  expect(screen.getByText("renamed.txt")).toBeTruthy()
  fireEvent.click(button(m.undo))
  expect(button("Project")).toBeTruthy()
  expect(screen.getByText("renamed.txt")).toBeTruthy()
  expect(screen.getByText("b.txt")).toBeTruthy()
})

it("accepts external drops onto folders and moves internal entries onto ancestor breadcrumbs", async () => {
  mount()
  const nested = source("notes.txt")
  Object.defineProperty(nested, "webkitRelativePath", {
    value: "Project/sub/notes.txt",
  })
  fireEvent.change(folderInput(), { target: { files: [nested] } })
  await screen.findByRole("button", { name: "Project" })
  const folder = button("Project").closest("li")!
  const external = {
    types: ["Files"],
    items: [],
    files: [source("dropped.txt")],
  }
  const externalOver = createEvent.dragOver(folder, { dataTransfer: external })
  fireEvent(folder, externalOver)
  expect(externalOver).toHaveProperty("dataTransfer.dropEffect", "copy")
  fireEvent.drop(folder, { dataTransfer: external })
  await waitFor(() =>
    expect(button(m.create)).toHaveProperty("disabled", false)
  )
  fireEvent.click(button("Project"))
  expect(screen.getByText("dropped.txt")).toBeTruthy()
  const transfer = {
    types: ["application/x-inbrowser-zip-entry"],
    files: [],
    items: [],
    setData: vi.fn(),
  }
  fireEvent.dragStart(screen.getByText("dropped.txt").closest("li")!, {
    dataTransfer: transfer,
  })
  expect(transfer.setData).toHaveBeenCalledWith(
    "application/x-inbrowser-zip-entry",
    "Project/dropped.txt"
  )
  const root = button(m.root)
  const internalOver = createEvent.dragOver(root, { dataTransfer: transfer })
  fireEvent(root, internalOver)
  expect(internalOver).toHaveProperty("dataTransfer.dropEffect", "move")
  fireEvent.drop(root, { dataTransfer: transfer })
  expect(screen.queryByText("dropped.txt")).toBeNull()
  fireEvent.click(root)
  expect(screen.getByText("dropped.txt")).toBeTruthy()
  fireEvent.click(button(m.create))
  await screen.findByRole("link", { name: m.download })
  expect(
    vi.mocked(createZip).mock.lastCall![0].map((item) => item.path)
  ).toEqual(["Project", "Project/sub", "Project/sub/notes.txt", "dropped.txt"])
})

it("rejects dragging a folder onto itself, clears cancelled feedback and prevents outside file navigation", async () => {
  mount()
  const nested = source("notes.txt")
  Object.defineProperty(nested, "webkitRelativePath", {
    value: "Project/notes.txt",
  })
  fireEvent.change(folderInput(), { target: { files: [nested] } })
  await screen.findByRole("button", { name: "Project" })
  const row = button("Project").closest("li")!
  const transfer = {
    types: ["application/x-inbrowser-zip-entry"],
    setData: vi.fn(),
  }
  fireEvent.dragStart(row, { dataTransfer: transfer })
  const invalidOver = createEvent.dragOver(row, { dataTransfer: transfer })
  fireEvent(row, invalidOver)
  expect(invalidOver).toHaveProperty("dataTransfer.dropEffect", "none")
  fireEvent.drop(row, { dataTransfer: transfer })
  expect(button("Project")).toBeTruthy()
  const files = { types: ["Files"], files: [source("ignored.txt")], items: [] }
  const outsideOver = createEvent.dragOver(document.body, {
    dataTransfer: files,
  })
  expect(fireEvent(document.body, outsideOver)).toBe(false)
  expect(outsideOver).toHaveProperty("dataTransfer.dropEffect", "none")
  expect(fireEvent.drop(document.body, { dataTransfer: files })).toBe(false)
  expect(screen.queryByText("ignored.txt")).toBeNull()
  fireEvent.dragEnter(dropZone(), { dataTransfer: files })
  expect(dropZone().className).toContain("border-primary")
  fireEvent.dragEnd(row)
  expect(dropZone().className).not.toContain("border-primary")
})

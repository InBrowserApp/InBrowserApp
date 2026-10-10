import { beforeEach, expect, test, vi } from "vitest"
import type { Worksheet, XlsxSelectionState } from "@silurus/ooxml/xlsx"
import { assertOfficeArchive } from "@workspace/document-reader"
import { importFile } from "./import-file"
import { openReader } from "./reader"
import { openWorkbook } from "@workspace/spreadsheet-export"

vi.mock("@workspace/spreadsheet-export", () => ({ openWorkbook: vi.fn() }))

vi.mock("./import-file", () => ({ importFile: vi.fn() }))

vi.mock("@workspace/document-reader", async (original) => ({
  ...(await original<typeof import("@workspace/document-reader")>()),
  assertOfficeArchive: vi.fn(),
}))
const mock = vi.hoisted(() => ({
  load: vi.fn(),
  create: vi.fn(),
  destroy: vi.fn(),
  documentDestroy: vi.fn(),
  goToSheet: vi.fn(),
  setScale: vi.fn(),
  fitWidth: vi.fn(),
  setSelection: vi.fn(),
  scrollToCell: vi.fn(),
  copySelection: vi.fn(),
  getWorksheet: vi.fn(),
  selectionState: null as XlsxSelectionState | null,
}))
vi.mock("@silurus/ooxml/xlsx", () => ({
  XlsxWorkbook: { load: mock.load },
  XlsxSheetViewer: { fromWorkbook: mock.create },
}))
const flush = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
}
function setup() {
  const controller = new AbortController(),
    container = document.createElement("div")
  const worksheet = {
    rows: [
      {
        index: 1,
        cells: [{ row: 1, col: 1, value: { type: "text", text: "Item" } }],
      },
    ],
    mergeCells: [],
    images: [],
    charts: [],
  } as unknown as Worksheet
  const workbook = {
    sheetCount: 3,
    sheetNames: ["Report", "Empty", "Secret"],
    isHidden: (i: number): boolean => i === 2,
    getWorksheet: mock.getWorksheet,
    cellText: () => "Item",
    destroy: mock.documentDestroy,
  }
  mock.load.mockResolvedValue(workbook)
  mock.getWorksheet.mockImplementation(async (index: number) =>
    index === 1
      ? { rows: [], mergeCells: [], images: [], charts: [] }
      : worksheet
  )
  const options = {
    file: {
      name: "test.xlsx",
      arrayBuffer: async () => new ArrayBuffer(10),
    } as File,
    container,
    signal: controller.signal,
    label: "Localized grid",
    onChange: vi.fn(),
    onError: vi.fn(),
  }
  return { options, controller, workbook, worksheet }
}
beforeEach(() => {
  vi.resetAllMocks()
  mock.selectionState = null
  mock.create.mockImplementation((canvas: HTMLCanvasElement) => {
    const viewport = document.createElement("div")
    viewport.dataset.xlsxViewportInput = "sheet"
    canvas.parentElement!.append(viewport)
    mock.destroy.mockImplementation(() => viewport.remove())
    return mock
  })
  mock.goToSheet.mockResolvedValue(undefined)
  mock.scrollToCell.mockResolvedValue(undefined)
  mock.copySelection.mockResolvedValue({ status: "copied" })
  mock.setSelection.mockImplementation(() => {
    mock.selectionState = {
      activeCell: { row: 1, col: 1 },
      extensionAnchor: { row: 1, col: 1 },
      activeAreaIndex: 0,
      areas: [{ kind: "cells", top: 1, bottom: 1, left: 1, right: 1 }],
    }
  })
})

test("loads a local worksheet, exposes selection, navigates, zooms, copies and disposes", async () => {
  const { options, controller, workbook } = setup()
  const reader = await openReader(options)
  expect(assertOfficeArchive).toHaveBeenCalledWith(
    expect.any(ArrayBuffer),
    "xlsx"
  )
  expect(mock.load).toHaveBeenCalledWith(
    expect.any(ArrayBuffer),
    expect.objectContaining({ useGoogleFonts: false })
  )
  expect(
    options.container
      .querySelector("[data-xlsx-viewport-input]")!
      .getAttribute("aria-label")
  ).toBe("Localized grid")
  const callbacks = mock.create.mock.calls[0]![2]
  expect(callbacks).toMatchObject({
    enableHyperlinks: false,
    comments: false,
    showScrollbars: true,
    resizable: false,
  })
  expect(options.onChange).toHaveBeenCalledWith({
    sheets: [
      { name: "Report", hidden: false },
      { name: "Empty", hidden: false },
      { name: "Secret", hidden: true },
    ],
  })
  expect(options.onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      selection: {
        reference: "A1",
        value: "Item",
        formula: "",
        noCachedValue: false,
      },
    })
  )
  callbacks.onScaleChange(1.5)
  expect(options.onChange).toHaveBeenCalledWith({ zoom: 150 })
  reader.zoom(200)
  reader.zoom("page-width")
  await flush()
  expect(mock.setScale).toHaveBeenCalledWith(2)
  expect(mock.fitWidth).toHaveBeenCalledOnce()
  reader.go("B2")
  await flush()
  expect(mock.scrollToCell).toHaveBeenCalledWith("B2")
  expect(mock.setSelection).toHaveBeenCalledWith("B2")
  reader.go("not a cell")
  await flush()
  expect(mock.scrollToCell).toHaveBeenCalledOnce()
  reader.copy()
  await flush()
  expect(options.onChange).toHaveBeenCalledWith({ copyStatus: "copied" })
  mock.copySelection.mockResolvedValueOnce({ status: "too-large" })
  reader.copy()
  await flush()
  expect(options.onChange).toHaveBeenCalledWith({ copyStatus: "failed" })
  reader.sheet(1)
  await flush()
  expect(mock.getWorksheet).toHaveBeenCalledWith(1)
  expect(options.onChange).toHaveBeenCalledWith({
    empty: true,
    switching: false,
  })
  mock.selectionState = null
  callbacks.onSelectionStateChange(null)
  expect(options.onChange).toHaveBeenCalledWith({
    selection: null,
    copyStatus: "",
  })
  callbacks.onError(new Error("render"))
  expect(options.onError).toHaveBeenCalledOnce()
  controller.abort()
  reader.dispose()
  expect(mock.destroy).toHaveBeenCalledOnce()
  expect(workbook.destroy).toHaveBeenCalledOnce()
  expect(options.container.children).toHaveLength(0)
  callbacks.onError(new Error())
  callbacks.onScaleChange(2)
  callbacks.onSelectionStateChange(null)
  reader.copy()
  await flush()
  expect(options.onError).toHaveBeenCalledOnce()
})

test("selects a merged cell's anchor so copying matches its displayed value", async () => {
  const { options, worksheet } = setup()
  worksheet.mergeCells = [{ top: 1, bottom: 1, left: 1, right: 4 }]
  const reader = await openReader(options)
  const callbacks = mock.create.mock.calls[0]![2]
  mock.selectionState = {
    ...mock.selectionState!,
    activeCell: { row: 1, col: 2 },
    areas: [{ kind: "cells", top: 1, bottom: 1, left: 2, right: 2 }],
  }
  mock.setSelection.mockClear()
  callbacks.onSelectionStateChange()
  expect(mock.setSelection).not.toHaveBeenCalled()
  options.container.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "c",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
  )
  await flush()
  expect(mock.setSelection).toHaveBeenCalledWith("A1")
  expect(mock.copySelection).toHaveBeenCalledOnce()
  callbacks.onSelectionStateChange()
  expect(options.onChange).toHaveBeenLastCalledWith({
    selection: {
      reference: "A1",
      value: "Item",
      formula: "",
      noCachedValue: false,
    },
    copyStatus: "",
  })
  reader.dispose()
})

test("ignores stale sheet changes and stale navigation or clipboard results", async () => {
  const { options, controller } = setup()
  const reader = await openReader(options)
  let finish!: () => void
  mock.goToSheet.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve
      })
  )
  reader.sheet(1)
  await flush()
  reader.sheet(2)
  await flush()
  finish()
  await flush()
  expect(
    options.onChange.mock.calls.filter(([state]) => "empty" in state).at(-1)![0]
  ).toEqual({ empty: false, switching: false })
  mock.scrollToCell.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve
      })
  )
  reader.go("C3")
  await flush()
  reader.sheet(0)
  await flush()
  finish()
  await flush()
  expect(mock.setSelection).not.toHaveBeenCalledWith("C3")
  let copyFinish!: (value: { status: string }) => void
  mock.copySelection.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        copyFinish = resolve
      })
  )
  reader.copy()
  await flush()
  reader.sheet(2)
  await flush()
  copyFinish({ status: "copied" })
  await flush()
  expect(options.onChange).not.toHaveBeenCalledWith({ copyStatus: "copied" })
  mock.copySelection.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        copyFinish = resolve
      })
  )
  reader.copy()
  await flush()
  controller.abort()
  copyFinish({ status: "copied" })
  await flush()
  expect(options.onChange).not.toHaveBeenCalledWith({ copyStatus: "copied" })
})

test("opens workbooks above 1,000 sheets and navigates to the last sheet", async () => {
  const { options, workbook } = setup()
  workbook.sheetCount = 1001
  workbook.sheetNames = Array.from({ length: 1001 }, (_, i) => `Sheet ${i + 1}`)
  const reader = await openReader(options)
  expect(options.onChange).toHaveBeenCalledWith({
    sheets: expect.arrayContaining([{ name: "Sheet 1001", hidden: false }]),
  })
  reader.sheet(1000)
  await flush()
  expect(mock.goToSheet).toHaveBeenCalledWith(1000)
  reader.dispose()
  expect(workbook.destroy).toHaveBeenCalledOnce()
})

test("cleans up late loads, empty workbooks, and renderer failures", async () => {
  const { options, controller, workbook } = setup()
  let finish!: (value: typeof workbook) => void
  mock.load.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  const pending = openReader(options)
  await flush()
  controller.abort()
  finish(workbook)
  await expect(pending).rejects.toThrow("aborted")
  expect(workbook.destroy).toHaveBeenCalledOnce()
  const empty = setup()
  empty.workbook.sheetCount = 0
  await expect(openReader(empty.options)).rejects.toThrow("INVALID")
  const next = setup()
  mock.goToSheet.mockRejectedValueOnce(new Error("invalid sheet"))
  await expect(openReader(next.options)).rejects.toThrow("invalid sheet")
  expect(next.options.container.children).toHaveLength(0)
})

test("uses the first available sheet and reports current async errors", async () => {
  const { options, workbook } = setup()
  workbook.isHidden = () => true
  const reader = await openReader(options)
  expect(mock.goToSheet).toHaveBeenCalledWith(0)
  mock.goToSheet.mockRejectedValueOnce(new Error("failed"))
  reader.sheet(2)
  await flush()
  expect(options.onError).toHaveBeenCalledOnce()
  reader.dispose()
})

test("imports additional formats locally and keeps their original worksheet labels", async () => {
  const { options } = setup()
  options.file = {
    name: "legacy.xls",
    arrayBuffer: async () => new ArrayBuffer(8),
  } as File
  const data = new ArrayBuffer(4)
  vi.mocked(importFile).mockResolvedValue({
    data,
    names: ["Original report", "Empty", "Secret"],
    notices: ["dataOnly"],
  })
  const reader = await openReader(options)
  expect(importFile).toHaveBeenCalledWith(
    expect.any(ArrayBuffer),
    "legacy.xls",
    { delimiter: "auto", encoding: "auto" },
    options.signal
  )
  expect(mock.load).toHaveBeenCalledWith(data, expect.anything())
  expect(options.onChange).toHaveBeenCalledWith({ notices: ["dataOnly"] })
  expect(options.onChange).toHaveBeenCalledWith({
    sheets: [
      { name: "Original report", hidden: false },
      { name: "Empty", hidden: false },
      { name: "Secret", hidden: true },
    ],
  })
  reader.dispose()
})

test("opens one reusable export session and cancels it when the reader is disposed", async () => {
  const { options } = setup()
  const reader = await openReader(options)
  const session = { sheets: [], export: vi.fn() }
  vi.mocked(openWorkbook).mockResolvedValue(session)
  expect(await reader.exportSession()).toBe(session)
  expect(await reader.exportSession()).toBe(session)
  expect(openWorkbook).toHaveBeenCalledOnce()
  expect(openWorkbook).toHaveBeenCalledWith(
    { file: options.file, names: undefined },
    expect.anything()
  )
  const signal = vi.mocked(openWorkbook).mock.calls[0]![1]
  reader.dispose()
  expect(signal.aborted).toBe(true)
  expect(() => reader.exportSession()).toThrow("aborted")
})

test("exports imported data and original names, preserves bytes before renderer transfer, and retries failed initialization", async () => {
  const { options } = setup()
  options.file = new File(["csv"], "original.csv")
  const bytes = new Uint8Array([80, 75, 3, 4]).buffer
  vi.mocked(importFile).mockResolvedValue({
    data: bytes,
    names: ["Original/中文"],
    notices: [],
  })
  const load = mock.load.getMockImplementation()!
  mock.load.mockImplementation((data, config) => {
    const result = load(data, config)
    structuredClone(data, { transfer: [data] })
    return result
  })
  const reader = await openReader(options)
  vi.mocked(openWorkbook).mockRejectedValueOnce(new Error("worker unavailable"))
  await expect(reader.exportSession()).rejects.toThrow("worker unavailable")
  vi.mocked(openWorkbook).mockResolvedValue({ sheets: [], export: vi.fn() })
  await reader.exportSession()
  const calls = vi.mocked(openWorkbook).mock.calls
  const source = calls[calls.length - 1]![0]
  expect(source.file.name).toBe("original.csv")
  expect(source.names).toEqual(["Original/中文"])
  expect(Array.from(new Uint8Array(await source.file.arrayBuffer()))).toEqual([
    80, 75, 3, 4,
  ])
  reader.dispose()
})

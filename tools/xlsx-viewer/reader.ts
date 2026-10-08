import { XlsxWorkbook, XlsxSheetViewer } from "@silurus/ooxml/xlsx"
import type { Worksheet } from "@silurus/ooxml/xlsx"
import {
  assertOfficeArchive,
  officeLoadOptions,
  imageResources,
} from "@workspace/document-reader"
import { cellDetails, cellReference, isCellReference } from "./core/cells"
import type { Reader, ReaderState } from "./types"

export async function openReader({
  file,
  container,
  signal,
  label,
  onChange,
  onError,
}: {
  file: File
  container: HTMLDivElement
  signal: AbortSignal
  label: string
  onChange: (update: Partial<ReaderState>) => void
  onError: (error: unknown) => void
}): Promise<Reader> {
  signal.throwIfAborted()
  const data = await file.arrayBuffer()
  signal.throwIfAborted()
  assertOfficeArchive(data, "xlsx")
  let workbook: XlsxWorkbook | undefined
  let viewer: ReturnType<typeof XlsxSheetViewer.fromWorkbook> | undefined
  let worksheet: Worksheet | undefined
  let disposed = false
  let sheetGeneration = 0
  const canvas = document.createElement("canvas")
  function dispose() {
    if (disposed) return
    disposed = true
    signal.removeEventListener("abort", dispose)
    container.removeEventListener("keydown", onKeyDown, true)
    viewer?.destroy()
    workbook?.destroy()
    canvas.remove()
    canvas.width = canvas.height = 0
  }
  function run(action: () => Promise<unknown> | void) {
    if (disposed) return
    void Promise.resolve()
      .then(action)
      .catch((error: unknown) => {
        if (!disposed) onError(error)
      })
  }
  function selectionChanged() {
    if (disposed || !worksheet || !viewer) return
    const selection = viewer.selectionState
    const details = selection
      ? cellDetails(worksheet, selection.activeCell, (cell) =>
          workbook!.cellText(worksheet!, cell)
        )
      : null
    onChange({ selection: details, copyStatus: "" })
  }
  async function copySelection() {
    const generation = sheetGeneration
    const selection = viewer!.selectionState
    const area = selection?.areas[0]
    if (
      worksheet &&
      selection &&
      selection.areas.length === 1 &&
      area?.kind === "cells" &&
      area.top === area.bottom &&
      area.left === area.right
    ) {
      const details = cellDetails(worksheet, selection.activeCell, () => "")
      if (details.reference !== cellReference(selection.activeCell))
        viewer!.setSelection(details.reference)
    }
    const result = await viewer!.copySelection()
    if (!disposed && generation === sheetGeneration)
      onChange({ copyStatus: result.status === "copied" ? "copied" : "failed" })
  }
  function onKeyDown(event: KeyboardEvent) {
    if (
      !event.defaultPrevented &&
      !event.isComposing &&
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "c" &&
      !(event.target as HTMLElement).closest(
        "input, textarea, select, [contenteditable]"
      )
    ) {
      event.preventDefault()
      run(copySelection)
    }
  }
  async function changeSheet(index: number) {
    const generation = ++sheetGeneration
    worksheet = undefined
    onChange({ sheet: index, switching: true, selection: null, copyStatus: "" })
    try {
      await viewer!.goToSheet(index)
      const next = await workbook!.getWorksheet(index)
      if (disposed || generation !== sheetGeneration) return
      worksheet = next
      onChange({
        switching: false,
        empty:
          next.rows.every((row) =>
            row.cells.every(
              (cell) => cell.value.type === "empty" && !cell.formula
            )
          ) &&
          !next.images.length &&
          !next.charts.length,
      })
      if (!viewer!.selectionState) viewer!.setSelection("A1")
      selectionChanged()
    } catch (error) {
      if (!disposed && generation === sheetGeneration) throw error
    }
  }
  try {
    workbook = await XlsxWorkbook.load(data, officeLoadOptions)
    signal.throwIfAborted()
    if (!workbook.sheetCount) throw new Error("INVALID")
    if (workbook.sheetCount > 1000) throw new Error("TOO_LARGE")
    canvas.style.width = canvas.style.height = "100%"
    container.append(canvas)
    viewer = XlsxSheetViewer.fromWorkbook(canvas, workbook, {
      imageResources,
      resizable: false,
      showScrollbars: true,
      enableHyperlinks: false,
      comments: false,
      zoomMin: 0.25,
      zoomMax: 4,
      onScaleChange: (scale) => {
        if (!disposed) onChange({ zoom: Math.round(scale * 100) })
      },
      onSelectionStateChange: selectionChanged,
      onError: (error) => {
        if (!disposed) onError(error)
      },
    })
    container
      .querySelector("[data-xlsx-viewport-input]")
      ?.setAttribute("aria-label", label)
    signal.addEventListener("abort", dispose, { once: true })
    container.addEventListener("keydown", onKeyDown, true)
    const sheets = workbook.sheetNames.map((name, index) => ({
      name,
      hidden: workbook!.isHidden(index),
    }))
    onChange({ sheets })
    await changeSheet(
      Math.max(
        0,
        sheets.findIndex((sheet) => !sheet.hidden)
      )
    )
    signal.throwIfAborted()
    return {
      sheet: (index) => run(() => changeSheet(index)),
      zoom: (value) =>
        run(() =>
          value === "page-width"
            ? viewer!.fitWidth()
            : viewer!.setScale(value / 100)
        ),
      go: (reference) =>
        run(async () => {
          if (!isCellReference(reference)) return
          const generation = sheetGeneration
          await viewer!.scrollToCell(reference)
          if (!disposed && generation === sheetGeneration)
            viewer!.setSelection(reference)
        }),
      copy: () => run(copySelection),
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}

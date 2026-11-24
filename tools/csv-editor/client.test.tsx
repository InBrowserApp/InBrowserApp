import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function start() {
  return render(<Client lang="en" messages={messages} />)
}

function example() {
  fireEvent.click(screen.getByRole("button", { name: messages.tryExample }))
}

function paste(text: string) {
  fireEvent.click(screen.getByRole("button", { name: messages.pasteCsv }))
  fireEvent.change(screen.getByRole("textbox", { name: messages.pasteLabel }), {
    target: { value: text },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.loadData }))
}

function rows() {
  return within(screen.getByRole("table")).getAllByRole("row").slice(1)
}

async function choose(trigger: string, item: string) {
  const button = screen.getByRole("button", { name: trigger })
  fireEvent.pointerDown(button, { button: 0, ctrlKey: false })
  const menuItem = await screen.findByRole("menuitem", { name: item })
  fireEvent.click(menuItem)
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
}

describe("CSV editor", () => {
  it("opens the example, edits a cell with the keyboard, and cancels a subsequent change", async () => {
    const { container } = start()
    const pick = vi.spyOn(
      container.querySelector("input[type=file]") as HTMLInputElement,
      "click"
    )
    fireEvent.click(screen.getByRole("button", { name: messages.openFile }))
    expect(pick).toHaveBeenCalledOnce()
    example()
    expect(rows()).toHaveLength(6)
    expect(
      screen.getByRole("checkbox", { name: messages.firstRowHeader })
    ).toHaveProperty("checked", true)

    const cell = screen.getByRole("button", { name: /Row 2, Product/ })
    fireEvent.click(cell)
    const input = screen.getByRole("textbox", { name: "Row 2, Product" })
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true })
    expect(input).toBe(document.activeElement)
    fireEvent.change(input, { target: { value: "Lined notebook\nBlue" } })
    fireEvent.keyDown(input, { key: "Enter" })
    const edited = await screen.findByRole("button", { name: /Lined notebook/ })
    await waitFor(() => expect(document.activeElement).toBe(edited))

    fireEvent.keyDown(edited, { key: "ArrowRight" })
    const category = screen.getByRole("button", { name: /Row 2, Category/ })
    expect(document.activeElement).toBe(category)
    fireEvent.keyDown(category, { key: "ArrowDown" })
    fireEvent.keyDown(screen.getByRole("button", { name: /Row 3, Category/ }), {
      key: "ArrowUp",
    })
    fireEvent.keyDown(category, { key: "ArrowLeft" })
    expect(document.activeElement).toBe(edited)
    fireEvent.click(edited)
    const retry = screen.getByRole("textbox", { name: "Row 2, Product" })
    fireEvent.change(retry, { target: { value: "Discard me" } })
    fireEvent.keyDown(retry, { key: "Escape" })
    expect(screen.getByRole("button", { name: /Lined notebook/ })).toBeTruthy()
  })

  it("sorts, filters and reorders records before downloading the selected result", async () => {
    start()
    paste(
      "Name\tStock\tCategory\r\nPen\t10\tDesk\r\nMug\t2\tKitchen\r\nNotes\t3\tDesk\r\n"
    )
    expect(
      await screen.findByRole("button", { name: "Download TSV" })
    ).toBeTruthy()
    await choose("Actions for Stock", messages.sortAscending)
    expect(rows().map((row) => row.textContent)).toEqual([
      "2Mug2Kitchen",
      "3Notes3Desk",
      "4Pen10Desk",
    ])
    await choose("Actions for Stock", messages.sortDescending)
    expect(rows()[0]!.textContent).toContain("Pen")
    await choose("Actions for Stock", messages.clearSort)
    expect(rows()[0]!.textContent).toContain("Pen")
    expect(rows()[1]!.textContent).toContain("Mug")
    await choose("Actions for Stock", messages.moveEarlier)
    await choose("Actions for Name", messages.moveLater)
    await choose("Actions for Name", messages.renameColumn)
    const header = screen.getByRole("textbox", { name: "Name" })
    fireEvent.change(header, { target: { value: "Product" } })
    fireEvent.keyDown(header, { key: "Enter" })
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Actions for Product" })
      )
    )
    fireEvent.change(
      screen.getByRole("combobox", { name: messages.filterColumn }),
      { target: { value: "2" } }
    )
    const filter = screen.getByRole("textbox", { name: messages.searchRows })
    fireEvent.change(filter, { target: { value: "desk" } })
    expect(screen.getByRole("status").textContent).toBe("2 of 3 rows")

    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})
    const create = vi.spyOn(URL, "createObjectURL")
    fireEvent.click(screen.getByRole("button", { name: "Download TSV" }))
    expect(await (create.mock.calls[0]![0] as Blob).text()).toBe(
      "Stock\tCategory\tProduct\r\n10\tDesk\tPen\r\n2\tKitchen\tMug\r\n3\tDesk\tNotes\r\n"
    )
    await choose(messages.downloadOptions, messages.downloadMatches)
    expect(await (create.mock.calls[1]![0] as Blob).text()).toBe(
      "Stock\tCategory\tProduct\r\n10\tDesk\tPen\r\n3\tDesk\tNotes\r\n"
    )
    await choose(messages.downloadOptions, messages.downloadAll)
    expect(click).toHaveBeenCalledTimes(3)
    expect(click.mock.instances[0]).toHaveProperty(
      "download",
      "Pasted data.tsv"
    )

    fireEvent.change(filter, { target: { value: "not found" } })
    expect(screen.getByText(messages.noMatches)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.clearFilter }))
    expect(screen.getByRole("status").textContent).toBe("3 of 3 rows")
    fireEvent.change(
      screen.getByRole("combobox", { name: messages.filterColumn }),
      { target: { value: "" } }
    )
  })

  it("keeps current data on import failure and ignores older file reads", async () => {
    const { container } = start()
    example()
    const input = container.querySelector("input[type=file]")!
    const older = new File([], "old.csv")
    let complete!: (buffer: ArrayBuffer) => void
    vi.spyOn(older, "arrayBuffer").mockReturnValue(
      new Promise((resolve) => {
        complete = resolve
      })
    )
    fireEvent.change(input, { target: { files: [older] } })
    expect(screen.getByText(messages.readingFile)).toBeTruthy()
    const newer = new File(['"broken'], "bad.csv")
    fireEvent.change(input, { target: { files: [newer] } })
    await screen.findByRole("alert")
    expect(screen.getByText(messages.invalidFile)).toBeTruthy()
    expect(rows()).toHaveLength(6)
    await act(async () => complete(new ArrayBuffer(0)))
    expect(screen.getByText(messages.invalidFile)).toBeTruthy()

    paste("")
    expect(screen.getByText(messages.noData)).toBeTruthy()
    const pasteArea = screen.getByRole("textbox", { name: messages.pasteLabel })
    fireEvent.change(pasteArea, { target: { value: '"unfinished' } })
    fireEvent.click(screen.getByRole("button", { name: messages.loadData }))
    expect(screen.getByText(messages.invalidFile)).toBeTruthy()
    expect(pasteArea).toHaveProperty("value", '"unfinished')
    fireEvent.click(screen.getByRole("button", { name: messages.pasteCsv }))

    const file = new File(["Product;Stock\nPen;001"], "valid.csv")
    const dataTransfer = { types: ["Files"], files: [file] }
    const surface = input.parentElement!
    fireEvent.dragEnter(surface, { dataTransfer })
    expect(screen.getByText(messages.dropReady)).toBeTruthy()
    fireEvent.dragOver(surface, { dataTransfer })
    fireEvent.dragLeave(surface, { dataTransfer })
    expect(screen.queryByText(messages.dropReady)).toBeNull()
    fireEvent.dragEnter(surface, { dataTransfer })
    fireEvent.drop(surface, { dataTransfer })
    await screen.findByText("valid.csv")
    expect(rows()[0]!.textContent).toContain("001")
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("supports header-only, headerless and multi-page files", () => {
    start()
    paste("Name,Name\n")
    expect(screen.getByText(messages.headerOnly)).toBeTruthy()
    expect(screen.getByRole("option", { name: "Column A · Name" })).toBeTruthy()
    expect(screen.getByRole("option", { name: "Column B · Name" })).toBeTruthy()
    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.firstRowHeader })
    )
    expect(rows()[0]!.textContent).toContain("Name")
    paste(
      [
        "Name,Value",
        ...Array.from(
          { length: 51 },
          (_, index) => `Row ${index + 1},${index}`
        ),
      ].join("\n")
    )
    expect(rows()).toHaveLength(50)
    fireEvent.click(screen.getByRole("button", { name: messages.nextPage }))
    expect(rows()).toHaveLength(1)
    expect(rows()[0]!.textContent).toContain("Row 51")
    fireEvent.click(screen.getByRole("button", { name: messages.previousPage }))
    expect(rows()).toHaveLength(50)
  })
})

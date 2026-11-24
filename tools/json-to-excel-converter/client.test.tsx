import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import { downloadWorkbook } from "./core/workbook"
import messages from "./messages/en.json"

vi.mock("./core/workbook", () => ({ downloadWorkbook: vi.fn() }))

const input = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: messages.input })
const download = () =>
  screen.getByRole<HTMLButtonElement>("button", { name: messages.download })
const enter = (value: string) =>
  fireEvent.change(input(), { target: { value } })

function pendingText() {
  let resolve!: (text: string) => void
  const promise = new Promise<string>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

test("loads an example, switches nested columns on and off, and clears the input", () => {
  render(<Client messages={messages} lang="en" />)
  expect(download().disabled).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(
    screen.getByRole("columnheader", { name: "contact.city" })
  ).toBeTruthy()
  expect(download().disabled).toBe(false)
  fireEvent.click(screen.getByRole("switch", { name: messages.flatten }))
  expect(screen.getByRole("columnheader", { name: "contact" })).toBeTruthy()
  expect(screen.getByText('{"city":"Oslo"}')).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.clear }))
  expect(input().value).toBe("")
  expect(document.activeElement).toBe(input())
  expect(download().disabled).toBe(true)
})

test("retains invalid input and exports all rows and columns after correction", async () => {
  render(<Client messages={messages} lang="en" />)
  enter('[{"id":')
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidJson)
  expect(input().value).toBe('[{"id":')
  expect(download().disabled).toBe(true)

  const record = Object.fromEntries(
    Array.from({ length: 20 }, (_, index) => [`field${index}`, index])
  )
  enter(JSON.stringify(Array.from({ length: 12 }, () => record)))
  expect(screen.getByRole("status").textContent).toBe(
    "Showing 10 of 12 rows and 16 of 20 columns."
  )
  fireEvent.click(download())
  await waitFor(() =>
    expect(downloadWorkbook).toHaveBeenCalledWith(
      expect.objectContaining({
        headings: Object.keys(record),
        rows: Array.from({ length: 12 }, () => Object.values(record)),
      }),
      "converted.xlsx"
    )
  )
})

test("imports a file and uses its base name for the download", async () => {
  const { container } = render(<Client messages={messages} lang="en" />)
  const fileInput =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  const filePicker = vi.spyOn(fileInput, "click")
  fireEvent.click(screen.getByRole("button", { name: messages.openFile }))
  expect(filePicker).toHaveBeenCalledOnce()
  fireEvent.change(fileInput, { target: { files: [] } })
  expect(download().disabled).toBe(true)

  const readFile = pendingText()
  const file = Object.assign(new File([], "Report.JSON"), {
    text: () => readFile.promise,
  })
  enter('[{"previous":true}]')
  fireEvent.change(fileInput, { target: { files: [file] } })
  expect(download().disabled).toBe(true)
  await act(async () => readFile.resolve('[{"next":7}]'))
  expect(screen.getByRole("columnheader", { name: "next" })).toBeTruthy()
  fireEvent.click(download())
  await waitFor(() =>
    expect(downloadWorkbook).toHaveBeenCalledWith(
      { headings: ["next"], rows: [[7]] },
      "Report.xlsx"
    )
  )
})

test("keeps the editor usable after a file or download error", async () => {
  const { container } = render(<Client messages={messages} lang="en" />)
  const fileInput =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  const rejected = Object.assign(new File([], "failed.json"), {
    text: () => Promise.reject(new Error()),
  })
  enter('[{"id":42}]')
  fireEvent.change(fileInput, { target: { files: [rejected] } })
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.readError
  )
  expect(input().value).toBe('[{"id":42}]')

  const late = pendingText()
  const file = Object.assign(new File([], "slow.json"), {
    text: () => late.promise,
  })
  fireEvent.change(fileInput, { target: { files: [file] } })
  enter('[{"id":43}]')
  await act(async () => late.resolve('[{"stale":true}]'))
  expect(input().value).toBe('[{"id":43}]')

  vi.mocked(downloadWorkbook).mockImplementationOnce(() => {
    throw new Error()
  })
  fireEvent.click(download())
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.downloadError
  )
  fireEvent.click(download())
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
  expect(downloadWorkbook).toHaveBeenCalledTimes(2)
})

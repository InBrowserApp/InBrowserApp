import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import ProtectPdf from "./client"
import messages from "./messages/en.json"

class MockWorker {
  static instances: MockWorker[] = []
  constructor() {
    MockWorker.instances.push(this)
  }

  onmessage: ((event: { data: Blob | null }) => void) | undefined
  onerror: (() => void) | undefined
  postMessage = vi.fn()
  terminate = vi.fn()
}

const file = new File(["PDF"], "invoice.PDF")
const downloadUrl = "blob:protected-pdf"

beforeEach(() => {
  MockWorker.instances = []
  vi.stubGlobal("Worker", MockWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue(downloadUrl)
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function pick(next: File) {
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [next] },
  })
}

function enterPassword(value: string, confirmation = value) {
  fireEvent.change(screen.getByLabelText(messages.password), {
    target: { value },
  })
  fireEvent.change(screen.getByLabelText(messages.confirmPassword), {
    target: { value: confirmation },
  })
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: messages.protectPdf }))
}

test("checks the passwords and offers a new PDF download after encryption", () => {
  render(<ProtectPdf messages={messages} />)
  const zone = screen.getByRole("button", { name: /Choose PDF/ })
  fireEvent.dragOver(zone)
  fireEvent.dragLeave(zone)
  fireEvent.drop(zone, { dataTransfer: { files: [file] } })
  expect(document.activeElement).toBe(screen.getByLabelText(messages.password))

  enterPassword("密".repeat(43))
  submit()
  expect(screen.getByText(messages.passwordTooLong)).toBeTruthy()
  enterPassword("hidden\0char")
  submit()
  expect(screen.getByText(messages.passwordInvalid)).toBeTruthy()
  enterPassword("@開啟", "@開啟1")
  submit()
  expect(screen.getByText(messages.passwordMismatch)).toBeTruthy()
  expect(MockWorker.instances).toHaveLength(0)
  expect(document.activeElement).toBe(
    screen.getByLabelText(messages.confirmPassword)
  )

  fireEvent.click(screen.getByRole("button", { name: messages.showPasswords }))
  expect(screen.getByLabelText(messages.confirmPassword)).toHaveProperty(
    "type",
    "text"
  )
  fireEvent.click(screen.getByRole("button", { name: messages.hidePasswords }))
  expect(screen.getByLabelText(messages.confirmPassword)).toHaveProperty(
    "type",
    "password"
  )
  enterPassword("@開啟")
  submit()
  const worker = MockWorker.instances[0]!
  expect(worker.postMessage).toHaveBeenCalledWith({ file, password: "@開啟" })
  const working = screen.getByRole("button", { name: messages.protecting })
  expect(working.getAttribute("aria-disabled")).toBe("true")
  expect(document.activeElement).toBe(working)
  fireEvent.click(working)
  expect(MockWorker.instances).toHaveLength(1)
  expect(screen.queryByRole("link")).toBeNull()
  act(() => worker.onmessage?.({ data: new Blob(["encrypted"]) }))
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(document.activeElement).toBe(
    screen.getByRole("heading", { name: messages.protected })
  )
  const download = screen.getByRole("link", { name: messages.downloadPdf })
  expect(download.getAttribute("download")).toBe("invoice-protected.pdf")
  expect(download.getAttribute("href")).toBe(downloadUrl)
  fireEvent.click(screen.getByRole("button", { name: messages.startOver }))
  expect(screen.queryByRole("link")).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith(downloadUrl)
})

test("keeps the input when processing fails and accepts a replacement PDF", () => {
  const { unmount } = render(<ProtectPdf messages={messages} />)
  const zone = screen.getByRole("button", { name: /Choose PDF/ })
  fireEvent.drop(zone, { dataTransfer: { files: [file, file] } })
  expect(screen.getByRole("alert").textContent).toBe(messages.onePdf)
  pick(new File([], "empty.pdf"))
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidPdf)
  pick(new File(["text"], "memo.txt"))
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidPdf)
  pick(file)
  enterPassword("retry passphrase")
  submit()
  act(() => MockWorker.instances[0]?.onerror?.())
  expect(screen.getByRole("alert").textContent).toBe(messages.protectionFailed)
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: messages.protectPdf })
  )
  expect(screen.getByLabelText(messages.password)).toHaveProperty(
    "value",
    "retry passphrase"
  )

  fireEvent.click(screen.getByRole("button", { name: messages.changePdf }))
  pick(new File(["PDF"], "replacement", { type: "application/pdf" }))
  expect(screen.getByText("replacement")).toBeTruthy()
  submit()
  expect(MockWorker.instances).toHaveLength(2)
  unmount()
  expect(MockWorker.instances[1]?.terminate).toHaveBeenCalledOnce()
})

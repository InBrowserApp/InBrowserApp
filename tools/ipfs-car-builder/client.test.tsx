import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { afterEach, expect, it, vi } from "vitest"

import CarBuilder from "./client"
import messages from "./messages/en.json"

vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

it("selects files, builds an archive and waits for the download action", async () => {
  const { container } = render(<CarBuilder language="en" messages={messages} />)
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  const build = screen.getByRole("button", { name: messages.build })
  expect(build).toHaveProperty("disabled", true)
  fireEvent.click(screen.getByRole("button", { name: messages.chooseFiles }))
  fireEvent.change(input, {
    target: { files: [new File(["hello\n"], "hello.txt")] },
  })
  fireEvent.click(build)
  await screen.findByText(
    "bafkreicysg23kiwv34eg2d7qweipxwosdo2py4ldv42nbauguluen5v6am"
  )
  expect(downloadBlob).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: messages.download }))
  expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "hello.txt.car")
})

it("keeps the folder selection when cancelled and can build again", async () => {
  const { container } = render(<CarBuilder language="en" messages={messages} />)
  const input = container.querySelector<HTMLInputElement>(
    "input[webkitdirectory]"
  )!
  const file = new File(["hello\n"], "hello.txt")
  Object.defineProperty(file, "webkitRelativePath", { value: "docs/hello.txt" })
  fireEvent.click(screen.getByRole("button", { name: messages.chooseFolder }))
  fireEvent.change(input, { target: { files: [file] } })
  const build = screen.getByRole("button", { name: messages.build })
  fireEvent.click(build)
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(screen.getByText("docs")).toBeTruthy()
  fireEvent.click(build)
  await screen.findByRole("button", { name: messages.download })
})

it("accepts a dropped selection and reports duplicate paths", async () => {
  render(<CarBuilder language="en" messages={messages} />)
  const area = screen.getByText(messages.drop).parentElement!
  const file = new File(["hello\n"], "hello.txt")
  fireEvent.dragOver(area, { dataTransfer: {} })
  fireEvent.dragLeave(area)
  fireEvent.drop(area, { dataTransfer: { files: [file, file] } })
  await screen.findByText("Files · 2")
  fireEvent.click(screen.getByRole("button", { name: messages.build }))
  await screen.findByText(messages.duplicate)
  fireEvent.drop(area, { dataTransfer: { files: [file] } })
  await screen.findByText("Files · 1")
  fireEvent.click(screen.getByRole("button", { name: messages.build }))
  await screen.findByRole("button", { name: messages.download })
})

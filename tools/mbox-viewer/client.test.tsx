import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type { Email } from "@workspace/email"
import Client from "./client"
import own from "./messages/en.json"
import { archiveMessages } from "@workspace/ui/email-archive-messages"
import type { ArchiveReply } from "@workspace/email/archive"

const m = { ...archiveMessages("en"), ...own }

let instances: TestWorker[]
class TestWorker {
  onmessage?: (event: MessageEvent<ArchiveReply>) => void
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    instances.push(this)
  }
  reply(data: ArchiveReply) {
    this.onmessage?.(new MessageEvent("message", { data }))
  }
}
const entries = Array.from({ length: 51 }, (_, id) => ({
  subject: id === 50 ? "Final survey report" : `Report ${id + 1}`,
  from: "Sam",
  to: id === 50 ? "Avery" : "Noa",
  date: id === 0 ? "Wed, 17 Jun 2026 14:42:00 +0000" : "",
}))
const email: Email = {
  ...entries[50]!,
  format: "EML",
  cc: "",
  bcc: "",
  notices: [],
  attachments: [],
  html: "",
  text: "The final report is ready.",
}

beforeEach(() => {
  instances = []
  vi.stubGlobal("Worker", TestWorker)
  vi.stubGlobal("matchMedia", () => ({ matches: false }))
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function renderTool() {
  render(<Client messages={m} lang="en" title="MBOX Viewer" />)
}
function openSample() {
  fireEvent.click(screen.getByRole("button", { name: m.sample }))
  return instances.at(-1)!
}

test("loads a sample, paginates, and searches by recipient", async () => {
  renderTool()
  const worker = openSample()
  expect(worker.postMessage).toHaveBeenCalledWith({ file: expect.any(File) })
  worker.reply({ messages: entries })
  fireEvent.click(await screen.findByRole("button", { name: m.next }))
  expect(screen.getByText("51–51 of 51")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  expect(screen.getByText("1–50 of 51")).toBeTruthy()

  const search = screen.getByRole("searchbox", { name: m.search })
  fireEvent.change(search, { target: { value: "no messages here" } })
  expect(screen.getByText(m.noResults)).toBeTruthy()
  fireEvent.change(search, { target: { value: "Avery survey" } })
  fireEvent.click(screen.getByRole("button", { name: /Final survey report/ }))
  expect(worker.postMessage).toHaveBeenLastCalledWith({ id: 50 })
  worker.reply({ id: 50, email })
  expect(await screen.findByText(email.text)).toBeTruthy()

  fireEvent.click(screen.getByRole("button", { name: m.back }))
  expect(screen.getByRole("searchbox")).toHaveProperty("value", "Avery survey")
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(screen.getByRole("button", { name: m.sample })).toBeTruthy()
})

test("recovers from an invalid mailbox by choosing an extensionless file", async () => {
  renderTool()
  const first = openSample()
  first.reply({ error: "invalid" })
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  const file = new File(["data"], "Inbox")
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
  expect(first.terminate).toHaveBeenCalledOnce()
  expect(instances[1]!.postMessage).toHaveBeenCalledWith({ file })
})

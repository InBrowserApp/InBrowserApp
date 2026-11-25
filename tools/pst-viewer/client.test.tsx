import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { archiveMessages } from "@workspace/ui/email-archive-messages"
import type { ArchiveReply } from "@workspace/email/archive"
import Client from "./client"
import own from "./messages/en.json"

const m = { ...archiveMessages("en"), ...own }
const workers: TestWorker[] = []
class TestWorker {
  onmessage?: (event: MessageEvent<ArchiveReply>) => void
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    workers.push(this)
  }
  reply(data: ArchiveReply) {
    this.onmessage?.(new MessageEvent("message", { data }))
  }
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  workers.length = 0
})

function chooseArchive() {
  vi.stubGlobal("Worker", TestWorker)
  vi.stubGlobal("matchMedia", () => ({ matches: false }))
  render(<Client messages={m} lang="en" title="PST Viewer" />)
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [new File(["contents"], "backup.pst")] },
  })
  return workers[0]!
}

test("switches PST folders, clears stale message selection and preserves indexed IDs", async () => {
  const worker = chooseArchive()
  worker.reply({
    messages: [
      {
        subject: "Inbox message",
        from: "Avery",
        to: "Sam",
        date: "",
        folder: 0,
      },
      {
        subject: "Sent message",
        from: "Sam",
        to: "Avery",
        date: "",
        folder: 1,
      },
    ],
    folders: ["Inbox", "Sent Items", "Empty folder"],
  })
  const folders = await screen.findByRole("combobox", { name: m.folders })
  fireEvent.change(folders, { target: { value: "2" } })
  expect(screen.getByText(m.emptyFolder)).toBeTruthy()
  fireEvent.change(folders, { target: { value: "1" } })
  expect(screen.queryByText("Inbox message")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: /Sent message/ }))
  expect(worker.postMessage).toHaveBeenLastCalledWith({ id: 1 })
})

test("differentiates a readable archive with no mail from a failed read", async () => {
  const worker = chooseArchive()
  worker.reply({ messages: [], folders: [] })
  expect(await screen.findByText(m.empty)).toBeTruthy()
  expect(screen.queryByText(m.invalid)).toBeNull()
})

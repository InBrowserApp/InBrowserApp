import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { getTorrentMessages } from "@workspace/ui/torrent-messages"
import Client from "./client"
import { exampleTorrent } from "./example"
import messages from "./messages/en.json"
import { readTorrent } from "./read-torrent"
import type { WorkerReply } from "./read-torrent"

const shared = getTorrentMessages("en")

beforeEach(() => {
  vi.stubGlobal(
    "Worker",
    class {
      onmessage?: (event: { data: WorkerReply }) => void
      terminate = vi.fn()

      postMessage(file: Blob) {
        void readTorrent(file).then(
          (data) => this.onmessage?.({ data }),
          () => this.onmessage?.({ data: null })
        )
      }
    }
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function renderViewer() {
  render(<Client language="en" messages={messages} shared={shared} />)
}

test("shows local metadata and filters the file list", async () => {
  renderViewer()
  fireEvent.click(screen.getByRole("button", { name: messages.example }))

  expect(await screen.findByText("Sample torrent")).toBeTruthy()
  expect(screen.getByText("39 B")).toBeTruthy()
  expect(
    screen.getByText("https://tracker.example.com:443/announce")
  ).toBeTruthy()
  const files = screen.getByRole("table", { name: shared.files })
  expect(within(files).getByText("Sample torrent/docs/notes.txt")).toBeTruthy()

  const filter = screen.getByRole("searchbox", { name: shared.filter })
  fireEvent.change(filter, { target: { value: "readme" } })
  expect(within(files).getByText("Sample torrent/README.txt")).toBeTruthy()
  expect(within(files).queryByText("Sample torrent/docs/notes.txt")).toBeNull()
  fireEvent.change(filter, { target: { value: "nothing" } })
  expect(screen.getByText(shared.noMatches)).toBeTruthy()
})

test("accepts a dropped file and reports an invalid replacement", async () => {
  renderViewer()
  const dropZone = screen.getByText(messages.dropFile).parentElement!
  fireEvent.dragOver(dropZone)
  fireEvent.dragLeave(dropZone)
  fireEvent.drop(dropZone, { dataTransfer: { files: [exampleTorrent()] } })
  expect(await screen.findByText("Sample torrent")).toBeTruthy()

  const input = screen.getByLabelText(messages.chooseFile)
  fireEvent.change(input, {
    target: { files: [new File(["invalid"], "bad.torrent")] },
  })
  expect(await screen.findByRole("alert")).toBeTruthy()
  expect(screen.getByText(messages.invalid)).toBeTruthy()
  expect(screen.queryByText("Sample torrent")).toBeNull()
})

test("connects the visible choose button to the file picker", () => {
  renderViewer()
  const input = screen.getByLabelText(messages.chooseFile)
  let opened = false
  input.addEventListener("click", () => {
    opened = true
  })
  fireEvent.click(screen.getByRole("button", { name: messages.chooseFile }))
  expect(opened).toBe(true)
})

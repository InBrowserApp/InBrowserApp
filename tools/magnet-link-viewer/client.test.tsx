import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { getTorrentMessages } from "@workspace/ui/torrent-messages"
import Client from "./client"
import { lookupMetadata } from "./lookup"
import messages from "./messages/en.json"

vi.mock("./lookup", { spy: true })

const shared = getTorrentMessages("en")
const hash = "08ada5a7a6183aae1e09d831df6748d566095a10"
const uri = `magnet:?xt=urn:btih:${hash}&dn=Sintel&tr=wss%3A%2F%2Ftracker.example.org`

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

function renderViewer() {
  render(<Client language="en" messages={messages} shared={shared} />)
  return screen.getByRole("textbox", { name: messages.input })
}

function submit(input: HTMLElement, value: string) {
  fireEvent.change(input, { target: { value } })
  fireEvent.click(screen.getByRole("button", { name: messages.inspect }))
}

test("validates the input before looking up metadata", async () => {
  submit(renderViewer(), "https://example.com")
  expect(await screen.findByText(messages.invalid)).toBeTruthy()
  expect(lookupMetadata).not.toHaveBeenCalled()
})

test("shows torrent files when WebTorrent returns metadata", async () => {
  vi.mocked(lookupMetadata).mockResolvedValue({
    infoHash: hash,
    name: "Sintel",
    files: [{ path: "Sintel/video.mp4", length: 1000 }],
    length: 1000,
    pieceLength: 1024,
    pieceCount: 1,
  })
  submit(renderViewer(), uri)
  expect(await screen.findByText("Sintel/video.mp4")).toBeTruthy()
  expect(screen.getByText(hash)).toBeTruthy()
  expect(screen.queryByText(messages.loading)).toBeNull()
})

test("keeps link details after a failed lookup and clears them when edited", async () => {
  vi.mocked(lookupMetadata).mockRejectedValue(new Error("disconnected"))
  const input = renderViewer()
  submit(input, uri)
  expect(await screen.findByText(messages.unavailable)).toBeTruthy()
  expect(screen.getByText(messages.linkDetails)).toBeTruthy()
  expect(screen.getByText("wss://tracker.example.org")).toBeTruthy()
  fireEvent.change(input, { target: { value: "" } })
  expect(screen.queryByText(messages.unavailable)).toBeNull()
  expect(screen.queryByText(hash)).toBeNull()
})

test("the example starts a lookup and cancel aborts it", async () => {
  vi.mocked(lookupMetadata).mockImplementation(
    (_value, signal) =>
      new Promise((_resolve, reject) =>
        signal.addEventListener("abort", () => reject(signal.reason))
      )
  )
  renderViewer()
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  await waitFor(() => expect(lookupMetadata).toHaveBeenCalled())
  const signal = vi.mocked(lookupMetadata).mock.calls[0]![1]
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  )
  expect(signal.aborted).toBe(true)
  expect(screen.queryByText(messages.loading)).toBeNull()
  expect(screen.getByText(hash)).toBeTruthy()
})

import { getTorrentMessages } from "@workspace/ui/torrent-messages"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"
import { InvalidTorrentError, openTorrent } from "./open-torrent"
import { saveTorrentFile } from "./save-file"
import type { Torrent } from "webtorrent"

vi.mock("./open-torrent", { spy: true })
vi.mock("./save-file", { spy: true })

const trackerMessages = getTorrentMessages("en")
const poster = { name: "poster.jpg", path: "Sintel/poster.jpg", length: 100 }
const captions = {
  name: "Sintel.en.srt",
  path: "Sintel/Sintel.en.srt",
  length: 200,
}
const torrent = {
  name: "Sintel",
  infoHash: "example",
  files: [poster, captions],
} as Torrent

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

test("opens the example, filters its files, then downloads the selected row only", async () => {
  vi.mocked(openTorrent).mockResolvedValue(torrent)
  vi.mocked(saveTorrentFile).mockResolvedValue("saved")
  render(
    <Client
      language="en"
      messages={messages}
      trackerMessages={trackerMessages}
    />
  )
  fireEvent.click(screen.getByRole("button", { name: messages.example }))

  const files = await screen.findByRole("table", { name: messages.files })
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "poster" },
  })
  expect(within(files).queryByText(captions.path)).toBeNull()
  fireEvent.click(
    within(files).getByRole("button", { name: messages.download })
  )
  expect(await screen.findByText(messages.saved)).toBeTruthy()
  expect(saveTorrentFile).toHaveBeenCalledExactlyOnceWith(
    poster,
    expect.any(AbortSignal),
    expect.any(Function),
    expect.any(Function)
  )
})

test("retains invalid text for correction and accepts a selected torrent file", async () => {
  vi.mocked(openTorrent)
    .mockRejectedValueOnce(new InvalidTorrentError())
    .mockResolvedValueOnce(torrent)
  render(
    <Client
      language="en"
      messages={messages}
      trackerMessages={trackerMessages}
    />
  )
  const magnet = screen.getByRole("textbox", { name: messages.magnet })
  fireEvent.change(magnet, { target: { value: "invalid" } })
  fireEvent.click(screen.getByRole("button", { name: messages.open }))
  expect(await screen.findByRole("alert")).toBeTruthy()
  expect(magnet.getAttribute("value")).toBe("invalid")

  const local = new File(["test"], "demo.torrent")
  fireEvent.change(screen.getByLabelText(messages.choose), {
    target: { files: [local] },
  })
  expect(
    await screen.findByRole("table", { name: messages.files })
  ).toBeTruthy()
  expect(openTorrent).toHaveBeenLastCalledWith(
    local,
    expect.any(AbortSignal),
    expect.any(Function),
    true
  )
  const signal = vi.mocked(openTorrent).mock.calls.at(-1)?.[1]
  fireEvent.click(screen.getByRole("button", { name: messages.stop }))
  expect(signal?.aborted).toBe(true)
  expect(screen.queryByRole("table")).toBeNull()
})

test("public trackers are checked by default and can be turned off before opening", async () => {
  vi.mocked(openTorrent).mockResolvedValue(torrent)
  render(
    <Client
      language="en"
      messages={messages}
      trackerMessages={trackerMessages}
    />
  )
  const setting = screen.getByRole<HTMLInputElement>("checkbox", {
    name: trackerMessages.publicTrackers,
  })
  expect(setting.checked).toBe(true)
  fireEvent.click(setting)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  await screen.findByRole("table", { name: messages.files })
  expect(openTorrent).toHaveBeenCalledWith(
    expect.stringContaining("magnet:"),
    expect.any(AbortSignal),
    expect.any(Function),
    false
  )
  expect(setting.disabled).toBe(true)
})

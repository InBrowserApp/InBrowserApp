import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { afterEach, expect, it, vi } from "vitest"

import CarExtractor from "./client"
import messages from "./messages/en.json"

vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: vi.fn() }))

const fixture = new Uint8Array(
  readFileSync(resolve(__dirname, "fixtures/directory.car"))
)
const sample = (bytes: BlobPart = fixture) => new File([bytes], "directory.car")

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

it("opens a CAR, drills into a file, and downloads the folder as ZIP", async () => {
  const { container } = render(
    <CarExtractor messages={messages} language="en" />
  )
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  fireEvent.change(input, { target: { files: [sample()] } })
  const folder = await screen.findByRole("button", { name: "sub" })
  fireEvent.click(folder)
  fireEvent.click(await screen.findByRole("button", { name: "world.txt" }))
  fireEvent.click(
    await screen.findByRole("button", { name: messages.download })
  )
  await waitFor(() =>
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "world.txt")
  )
  fireEvent.click(screen.getByRole("button", { name: messages.back }))
  fireEvent.click(await screen.findByRole("button", { name: messages.zip }))
  await waitFor(() =>
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "sub.zip")
  )
})

it("recovers from a bad drop and retains navigation when a file is missing", async () => {
  render(<CarExtractor messages={messages} language="en" />)
  const drop = screen.getByText(messages.drop).parentElement!
  fireEvent.dragOver(drop, { dataTransfer: {} })
  fireEvent.dragLeave(drop)
  fireEvent.drop(drop, { dataTransfer: { files: [sample("bad")] } })
  await screen.findByText(messages.invalid)
  const truncated = fixture.slice(0, -43)
  fireEvent.drop(drop, { dataTransfer: { files: [sample(truncated)] } })
  fireEvent.click(await screen.findByRole("button", { name: "sub" }))
  fireEvent.click(await screen.findByRole("button", { name: "world.txt" }))
  await screen.findByText(messages.missing)
  expect(screen.getByRole("button", { name: "world.txt" })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.back }))
  await screen.findByRole("button", { name: "hello.txt" })
})

it("cancels and retries an import, then switches between roots", async () => {
  const [{ CarWriter }, { CID }, { sha256 }, { identity }] = await Promise.all([
    import("@ipld/car/writer"),
    import("multiformats/cid"),
    import("multiformats/hashes/sha2"),
    import("multiformats/hashes/identity"),
  ])
  const bytes = new TextEncoder().encode("embedded")
  const inlineCid = CID.createV1(0x55, identity.digest(bytes))
  const emptyDirectory = new Uint8Array([0x0a, 0x02, 0x08, 0x01])
  const directoryCid = CID.createV1(0x70, await sha256.digest(emptyDirectory))
  const { writer, out } = CarWriter.create([inlineCid, directoryCid])
  const car = (async () => {
    const chunks: BlobPart[] = []
    for await (const chunk of out) chunks.push(chunk.slice())
    return new Blob(chunks)
  })()
  await writer.put({ cid: directoryCid, bytes: emptyDirectory })
  await writer.close()

  const { container } = render(
    <CarExtractor messages={messages} language="en" />
  )
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  fireEvent.click(screen.getByRole("button", { name: messages.choose }))
  const file = sample(await car)
  fireEvent.change(input, { target: { files: [file] } })
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(screen.queryByRole("heading", { name: messages.contents })).toBeNull()
  fireEvent.change(input, { target: { files: [file] } })
  await screen.findByRole("button", { name: messages.download })
  fireEvent.change(screen.getByLabelText(messages.roots), {
    target: { value: directoryCid.toString() },
  })
  await screen.findByText(messages.empty)
})

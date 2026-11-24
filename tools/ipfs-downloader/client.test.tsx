import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import { afterEach, expect, it, vi } from "vitest"

import IpfsDownloader from "./client"
import fixture from "./fixtures/blocks.json"
import messages from "./messages/en.json"

vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob: vi.fn() }))

const blocks: Record<string, string> = fixture.blocks
const failedCid = "bafkreihcldjer7njjrrxknqh67cestxa7s7jf4nhnp62y6k4twcbahvtc4"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

function mockGateway(...missing: string[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string) => {
      const cid = new URL(input).pathname.split("/").at(-1)!
      const block = !missing.includes(cid) && blocks[cid]
      return block
        ? new Response(new Uint8Array(Buffer.from(block, "base64")))
        : new Response(null, { status: 404 })
    })
  )
}

function open(input: string) {
  fireEvent.change(screen.getByLabelText(messages.address), {
    target: { value: input },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.open }))
}

it("opens nested files, returns to the parent and downloads the folder", async () => {
  mockGateway()
  render(<IpfsDownloader language="en" messages={messages} />)
  open("not a CID")
  expect(screen.getByText(messages.invalid)).toBeTruthy()
  open(`ipfs://${fixture.root}/sub/world.txt`)
  fireEvent.click(
    await screen.findByRole("button", { name: messages.download })
  )
  await waitFor(() =>
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "world.txt")
  )
  fireEvent.click(screen.getByRole("button", { name: messages.back }))
  await screen.findByRole("button", { name: "world.txt" })
  fireEvent.click(screen.getByRole("button", { name: messages.zip }))
  await waitFor(() =>
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "sub.zip")
  )
})

it("lists failed files and supports an explicit partial export", async () => {
  mockGateway(failedCid)
  render(<IpfsDownloader language="en" messages={messages} />)
  open(fixture.root)
  fireEvent.click(await screen.findByRole("button", { name: messages.zip }))
  await screen.findByText(messages.incomplete)
  expect(screen.getByText("sub/world.txt")).toBeTruthy()
  expect(downloadBlob).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: messages.zip }))
  expect(screen.queryByRole("button", { name: messages.available })).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  fireEvent.click(screen.getByRole("button", { name: messages.available }))
  expect(downloadBlob).toHaveBeenCalledWith(
    expect.any(Blob),
    `${fixture.root}.partial.zip`
  )
})

it("preserves typed input after cancellation and reports missing paths", async () => {
  mockGateway()
  render(<IpfsDownloader language="en" messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(screen.getByLabelText(messages.address)).toHaveProperty(
    "value",
    expect.stringMatching(/^ipfs:\/\//)
  )
  expect(screen.queryByText(messages.opening)).toBeNull()
  open(`ipfs://${fixture.root}/missing`)
  await screen.findByText(messages.pathMissing)
  open(fixture.root)
  const child = await screen.findByRole("button", { name: "hello.txt" })
  fireEvent.click(child)
  await screen.findByRole("button", { name: messages.download })
})

it("reports an unreachable address and never offers an empty partial file download", async () => {
  const hello = "bafkreicysg23kiwv34eg2d7qweipxwosdo2py4ldv42nbauguluen5v6am"
  mockGateway(hello, failedCid)
  render(<IpfsDownloader language="en" messages={messages} />)
  open(hello)
  await screen.findByText(messages.missing)
  open(fixture.root)
  fireEvent.click(await screen.findByRole("button", { name: messages.zip }))
  await screen.findByText(messages.incomplete)
  expect(screen.queryByRole("button", { name: messages.available })).toBeNull()
  expect(downloadBlob).not.toHaveBeenCalled()
})

it("retains available file downloads when a directory contains an unsupported entry", async () => {
  const [{ CID }, { sha256 }] = await Promise.all([
    import("multiformats/cid"),
    import("multiformats/hashes/sha2"),
  ])
  const modified = Buffer.from(blocks[fixture.root]!, "base64")
  const marker = modified.indexOf(Buffer.from([1, 0x55, 0x12, 0x20]))
  expect(marker).toBeGreaterThan(0)
  modified[marker + 1] = 0x78
  const root = CID.createV1(
    0x70,
    await sha256.digest(new Uint8Array(modified))
  ).toString()
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string) => {
      const cid = new URL(input).pathname.split("/").at(-1)!
      const block = cid === root ? modified.toString("base64") : blocks[cid]
      return block
        ? new Response(new Uint8Array(Buffer.from(block, "base64")))
        : new Response(null, { status: 404 })
    })
  )
  render(<IpfsDownloader language="en" messages={messages} />)
  open(root)
  fireEvent.click(await screen.findByRole("button", { name: messages.zip }))
  await screen.findByText(messages.incomplete)
  expect(screen.getAllByText("hello.txt")).toHaveLength(2)
  expect(screen.getByRole("button", { name: messages.available })).toBeTruthy()
})

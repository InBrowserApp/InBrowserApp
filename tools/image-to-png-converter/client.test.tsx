import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type { OpenedImage, Preview } from "@workspace/raster-image/types"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({
  open: vi.fn(),
  render: vi.fn(),
  session: vi.fn(),
}))
vi.mock("@workspace/raster-image", () => ({ imageSession: mock.session }))
const preview: Preview = {
  mime: "image/png",
  bytes: new Uint8Array([137, 80, 78, 71]),
  width: 320,
  height: 200,
  delay: 0,
  depth: 8,
  profile: false,
}
const image: OpenedImage = {
  preview,
  info: { format: "TIFF", count: 3, kind: "page", poster: false },
}
const choose = (file = new File(["image"], "图片.tiff", { lastModified: 1 })) =>
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
const download = () => screen.queryByRole("link", { name: m.downloadPng })
async function load() {
  fireEvent.load(await screen.findByRole("img"))
}
let created: ReturnType<typeof vi.spyOn>
let revoked: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  vi.clearAllMocks()
  mock.open.mockResolvedValue(image)
  mock.render.mockResolvedValue({
    ...preview,
    mime: "image/png",
    bytes: new Uint8Array([5, 6]),
    width: 200,
  })
  mock.session.mockReturnValue({ open: mock.open, render: mock.render })
  let next = 0
  created = vi
    .spyOn(URL, "createObjectURL")
    .mockImplementation(() => `blob:png-${++next}`)
  revoked = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("downloads the displayed PNG bytes at native dimensions, independently of preview controls", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(screen.getByText(m.pngNote)).toBeTruthy()
  expect(download()).toBeNull()
  choose()
  const img = await screen.findByRole("img")
  expect(download()).toBeNull()
  fireEvent.load(img)
  expect(download()?.getAttribute("download")).toBe("图片-page-1.png")
  expect(download()?.getAttribute("href")).toBe(img.getAttribute("src"))
  const blob = created.mock.calls[0]![0] as Blob
  expect(blob.type).toBe("image/png")
  expect(new Uint8Array(await blob.arrayBuffer())).toEqual(preview.bytes)
  const originalUrl = download()?.getAttribute("href")
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  fireEvent.click(screen.getByRole("button", { name: m.dark }))
  expect(download()?.getAttribute("href")).toBe(originalUrl)
  expect(created).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(download()).toBeNull()
  expect(revoked).toHaveBeenCalledWith(originalUrl)
  await load()
  expect(download()?.getAttribute("download")).toBe("图片-page-2.png")
  expect(download()?.getAttribute("href")).not.toBe(originalUrl)
  mock.render.mockRejectedValueOnce(new Error("invalid"))
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByText(m.invalid)
  expect(download()).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  await load()
  expect(download()?.getAttribute("download")).toBe("图片-page-2.png")
  // New File with identical name/time must reset page and download identity.
  choose()
  expect(download()).toBeNull()
  await load()
  expect(download()?.getAttribute("download")).toBe("图片-page-1.png")
  expect(mock.session.mock.calls[0]![1].aborted).toBe(true)
  fireEvent.error(screen.getByRole("img"))
  expect(download()).toBeNull()
  expect(screen.getByText(m.renderError)).toBeTruthy()
  choose()
  await load()
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(download()).toBeNull()
  expect(mock.session.mock.calls.at(-1)![1].aborted).toBe(true)
})

test("cancel and replacement abort work and cannot restore a stale download", async () => {
  let resolve!: (value: OpenedImage) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  const { unmount } = render(<Client messages={m} />)
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(mock.session.mock.calls[0]![1].aborted).toBe(true)
  await act(async () => resolve(image))
  expect(download()).toBeNull()
  expect(screen.queryByRole("img")).toBeNull()
  choose()
  await load()
  let frame!: (value: Preview) => void
  mock.render.mockImplementationOnce(
    () =>
      new Promise((done) => {
        frame = done
      })
  )
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(download()).toBeNull()
  choose(new File(["poster"], "animation.apng"))
  await load()
  const currentUrl = download()?.getAttribute("href")
  await act(async () => frame({ ...preview, width: 1 }))
  expect(download()?.getAttribute("href")).toBe(currentUrl)
  unmount()
  expect(revoked).toHaveBeenCalledWith(currentUrl)
  expect(mock.session.mock.calls.at(-1)![1].aborted).toBe(true)
})

test("empty, unsupported, resource and startup errors offer no download and allow recovery", async () => {
  render(<Client messages={m} />)
  choose(new File([], "empty.png"))
  await screen.findByText(m.emptyFile)
  expect(mock.session).not.toHaveBeenCalled()
  for (const key of [
    "unsupported",
    "sequence",
    "invalid",
    "resourceLimit",
    "engineError",
  ] as const) {
    mock.open.mockRejectedValueOnce(new Error(key))
    choose()
    await screen.findByText(m[key])
    expect(download()).toBeNull()
    expect(mock.session.mock.calls.at(-1)![1].aborted).toBe(true)
  }
  mock.session.mockImplementationOnce(() => {
    throw new Error("engineError")
  })
  choose()
  await screen.findByText(m.engineError)
  mock.open.mockResolvedValue({
    ...image,
    info: { ...image.info, count: 1, poster: true },
  })
  choose()
  await load()
  expect(screen.getByText(m.poster)).toBeTruthy()
  expect(download()?.getAttribute("download")).toBe("图片-poster.png")
})

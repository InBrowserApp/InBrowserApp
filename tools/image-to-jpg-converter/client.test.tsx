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
  mime: "image/jpeg",
  bytes: new Uint8Array([255, 216, 255, 217]),
  fullWidth: 320,
  fullHeight: 200,
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
const download = () =>
  screen.queryByRole("link", { name: m.jpgExport.download })
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
    mime: "image/jpeg",
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

test("downloads the displayed JPG bytes at native dimensions, independently of preview controls", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(screen.getByText(m.jpgExport.note)).toBeTruthy()
  expect(download()).toBeNull()
  choose()
  const img = await screen.findByRole("img")
  expect(download()).toBeNull()
  fireEvent.load(img)
  expect(download()?.getAttribute("download")).toBe("图片-page-1.jpg")
  expect(download()?.getAttribute("href")).toBe(img.getAttribute("src"))
  const blob = created.mock.calls[0]![0] as Blob
  expect(blob.type).toBe("image/jpeg")
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
  expect(download()?.getAttribute("download")).toBe("图片-page-2.jpg")
  expect(download()?.getAttribute("href")).not.toBe(originalUrl)
  mock.render.mockRejectedValueOnce(new Error("invalid"))
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByText(m.invalid)
  expect(download()).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  await load()
  expect(download()?.getAttribute("download")).toBe("图片-page-2.jpg")
  // New File with identical name/time must reset page and download identity.
  choose()
  expect(download()).toBeNull()
  await load()
  expect(download()?.getAttribute("download")).toBe("图片-page-1.jpg")
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
  choose(new File([], "empty.jpg"))
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
  expect(download()?.getAttribute("download")).toBe("图片-poster.jpg")
})

test("quality and background changes keep the selected page and cannot restore stale output", async () => {
  render(<Client messages={m} />)
  choose()
  await load()
  expect(mock.open).toHaveBeenCalledWith({ quality: 90, background: "#ffffff" })
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await load()
  const quality = screen.getByLabelText(m.jpgExport.quality)
  const color = screen.getByLabelText(m.jpgExport.color)
  let oldResult!: (value: Preview) => void
  mock.render.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        oldResult = resolve
      })
  )
  fireEvent.change(quality, { target: { value: "25" } })
  fireEvent.keyDown(quality, { key: "Enter" })
  expect(download()).toBeNull()
  expect(mock.render).toHaveBeenLastCalledWith(1, {
    quality: 25,
    background: "#ffffff",
  })
  fireEvent.change(color, { target: { value: "#102030" } })
  expect(download()).toBeNull()
  await load()
  expect(mock.render).toHaveBeenLastCalledWith(1, {
    quality: 25,
    background: "#102030",
  })
  expect(download()?.getAttribute("download")).toBe("图片-page-2.jpg")
  const currentUrl = download()?.getAttribute("href")
  await act(async () => oldResult({ ...preview, width: 1 }))
  expect(download()?.getAttribute("href")).toBe(currentUrl)
  expect(
    screen.getByRole("spinbutton", { name: m.page }).getAttribute("value")
  ).toBe("2")
  for (const value of ["0", "101", "3.5", ""]) {
    fireEvent.change(quality, { target: { value } })
    fireEvent.blur(quality)
    expect((quality as HTMLInputElement).value).toBe("25")
    expect(download()?.getAttribute("href")).toBe(currentUrl)
  }
  choose()
  await load()
  expect(mock.open).toHaveBeenLastCalledWith({
    quality: 25,
    background: "#102030",
  })
  expect(download()?.getAttribute("download")).toBe("图片-page-1.jpg")
})

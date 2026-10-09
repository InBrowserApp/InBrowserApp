import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import type { OpenedImage, Preview } from "./types"
import m from "./messages/en.json"
const mock = vi.hoisted(() => ({
  open: vi.fn(),
  render: vi.fn(),
  session: vi.fn(),
}))
vi.mock("./session", () => ({ imageSession: mock.session }))
const preview: Preview = {
  png: new Uint8Array([1, 2]),
  width: 960,
  height: 600,
  delay: 0,
  depth: 8,
  profile: false,
}
const image: OpenedImage = {
  preview,
  info: { format: "PNG", count: 1, kind: "image", poster: false },
}
const choose = (file = new File(["bytes"], "image.png")) =>
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
let created: ReturnType<typeof vi.spyOn>
let revoked: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  vi.clearAllMocks()
  mock.open.mockResolvedValue(image)
  mock.render.mockResolvedValue({
    ...preview,
    width: 100,
    delay: 200,
    profile: true,
  })
  mock.session.mockReturnValue({ open: mock.open, render: mock.render })
  created = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview")
  revoked = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("opens, zooms fractionally, resets backgrounds and releases the preview", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  choose()
  const img = await screen.findByRole("img")
  expect(screen.getByText(m.precision)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.actualSize }))
  const input = screen.getByRole("spinbutton", { name: m.zoom })
  expect(input.getAttribute("value")).toBe("100")
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  expect(input.getAttribute("value")).toBe("125")
  fireEvent.click(screen.getByRole("button", { name: m.zoomOut }))
  fireEvent.change(input, { target: { value: "175.5" } })
  fireEvent.keyDown(input, { key: "Enter" })
  expect(img.style.width).toBe("1684.8px")
  fireEvent.change(input, { target: { value: "" } })
  fireEvent.blur(input)
  expect(input.getAttribute("value")).toBe("175.5")
  fireEvent.change(input, { target: { value: "-1" } })
  fireEvent.blur(input)
  fireEvent.change(input, { target: { value: "12" } })
  fireEvent.keyDown(input, { key: "Escape" })
  expect(input.getAttribute("value")).toBe("175.5")
  fireEvent.keyDown(input, { key: "ArrowRight" })
  fireEvent.blur(input)
  expect(fireEvent.keyDown(input, { key: "Escape" })).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: m.dark }))
  expect(screen.getByRole("region").style.backgroundColor).toBe("#17191d")
  fireEvent.click(screen.getByRole("button", { name: m.light }))
  expect(screen.getByRole("region").style.backgroundColor).toBe("#fff")
  fireEvent.click(screen.getByRole("button", { name: m.reset }))
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(revoked).toHaveBeenCalledWith("blob:preview")
  expect(mock.session.mock.calls[0]![1].aborted).toBe(true)
})

test("browses frames with explicit policy and allows recovery past an unreadable item", async () => {
  mock.open.mockResolvedValue({
    ...image,
    info: { ...image.info, count: 3, kind: "frame" },
  })
  render(<Client messages={m} />)
  choose()
  await screen.findByRole("img")
  expect(screen.getByText(m.animation)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.dark }))
  fireEvent.click(screen.getByRole("button", { name: m.actualSize }))
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByText(m.present)
  expect(screen.getByRole("region").style.backgroundColor).toBe("#17191d")
  expect(
    screen.getByRole("spinbutton", { name: m.zoom }).getAttribute("value")
  ).toBe("100")
  expect(screen.getByText("200 ms")).toBeTruthy()
  const input = screen.getByRole("spinbutton", { name: m.frame })
  fireEvent.change(input, { target: { value: "3" } })
  fireEvent.keyDown(input, { key: "Enter" })
  await waitFor(() => expect(mock.render).toHaveBeenCalledWith(2))
  await screen.findByRole("img")
  mock.render.mockRejectedValueOnce(new RangeError("memory"))
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  await screen.findByText(m.resourceLimit)
  expect(screen.queryByRole("img")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  await screen.findByRole("img")
  expect(mock.render).toHaveBeenLastCalledWith(0)
  choose(new File(["different"], "next.png"))
  await screen.findByRole("img")
  expect(
    screen
      .getByRole("button", { name: m.checkerboard })
      .getAttribute("aria-pressed")
  ).toBe("true")
  expect(
    screen.getByRole("button", { name: m.fit }).getAttribute("aria-pressed")
  ).toBe("true")
})

test("labels poster-only content and reports native and object URL failures", async () => {
  mock.open.mockResolvedValue({
    ...image,
    info: { ...image.info, poster: true },
  })
  render(<Client messages={m} />)
  choose()
  const img = await screen.findByRole("img")
  expect(screen.getByText(m.poster)).toBeTruthy()
  fireEvent.error(img)
  expect(screen.getByText(m.renderError)).toBeTruthy()
  created.mockImplementationOnce(() => {
    throw new RangeError("memory")
  })
  choose()
  await screen.findByText(m.renderError)
  choose()
  await screen.findByRole("img")
  expect(revoked).toHaveBeenCalledOnce()
})

test("cancels pending opens and ignores replaced or unmounted frame work", async () => {
  let resolve!: (value: OpenedImage) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  await act(async () => resolve(image))
  expect(screen.queryByRole("img")).toBeNull()
  mock.open.mockResolvedValue({
    ...image,
    info: { ...image.info, count: 2, kind: "page" },
  })
  choose()
  await screen.findByRole("img")
  let frameResolve!: (value: Preview) => void
  mock.render.mockImplementationOnce(
    () =>
      new Promise((done) => {
        frameResolve = done
      })
  )
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(screen.getByText(m.loadingItem)).toBeTruthy()
  choose()
  await screen.findByRole("img")
  await act(async () => frameResolve({ ...preview, width: 99999 }))
  expect(screen.getByRole("img").style.width).not.toContain("99999")
  let frameReject!: (reason: Error) => void
  mock.render.mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        frameReject = fail
      })
  )
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => frameReject(new Error("invalid")))
  expect(screen.queryByText(m.invalid)).toBeNull()
})

test("shows empty, unsupported, resource, startup and decode errors then recovers", async () => {
  render(<Client messages={m} />)
  choose(new File([], "empty.png"))
  await screen.findByText(m.emptyFile)
  expect(mock.open).not.toHaveBeenCalled()
  for (const key of [
    "unsupported",
    "invalid",
    "resourceLimit",
    "engineError",
  ] as const) {
    mock.open.mockRejectedValueOnce(new Error(key))
    choose()
    await screen.findByText(m[key])
  }
  mock.session.mockImplementationOnce(() => {
    throw new Error("engineError")
  })
  choose()
  await screen.findByText(m.engineError)
  choose()
  await screen.findByRole("img")
})

test("pans with a primary pointer and retains native touch scrolling", async () => {
  render(<Client messages={m} />)
  choose()
  await screen.findByRole("img")
  const region = screen.getByRole("region")
  region.setPointerCapture = vi.fn()
  fireEvent.pointerMove(region, { clientX: 20, clientY: 20 })
  fireEvent.pointerDown(region, { button: 1, pointerType: "mouse" })
  fireEvent.pointerDown(region, { button: 0, pointerType: "touch" })
  expect(region.setPointerCapture).not.toHaveBeenCalled()
  fireEvent.pointerDown(region, {
    button: 0,
    pointerType: "mouse",
    pointerId: 1,
    clientX: 100,
    clientY: 80,
  })
  fireEvent.pointerMove(region, { clientX: 30, clientY: 20 })
  expect([region.scrollLeft, region.scrollTop]).toEqual([70, 60])
  fireEvent.pointerUp(region)
  fireEvent.pointerCancel(region)
  fireEvent.lostPointerCapture(region)
  expect(region.setPointerCapture).toHaveBeenCalledWith(1)
})

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
import { prepare } from "./core/prepare"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({ open: vi.fn() }))
vi.mock("./open-document", () => ({ openDocument: mock.open }))
const preview = prepare(
  '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600"><rect width="960" height="600"/></svg>'
)
const choose = (file = new File(["drawing"], "coast.svg")) =>
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
let created: ReturnType<typeof vi.spyOn>
let revoked: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  vi.clearAllMocks()
  mock.open.mockResolvedValue(preview)
  created = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:svg-test")
  revoked = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("opens a vector image, exposes dimensions and releases its URL when closed", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  choose()
  await screen.findByRole("img", { name: m.artwork })
  expect(created).toHaveBeenCalledOnce()
  expect(screen.getByText("960 × 600")).toBeTruthy()
  expect(screen.queryByText(m.fallbackSize)).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.actualSize }))
  expect(
    screen.getByRole("spinbutton", { name: m.zoom }).getAttribute("value")
  ).toBe("100")
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  expect(
    screen.getByRole("spinbutton", { name: m.zoom }).getAttribute("value")
  ).toBe("125")
  fireEvent.click(screen.getByRole("button", { name: m.zoomOut }))
  fireEvent.click(screen.getByRole("button", { name: m.dark }))
  expect(screen.getByRole("region").style.backgroundColor).toBe("#17191d")
  fireEvent.click(screen.getByRole("button", { name: m.light }))
  expect(screen.getByRole("region").style.backgroundColor).toBe("#fff")
  fireEvent.click(screen.getByRole("button", { name: m.reset }))
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(revoked).toHaveBeenCalledWith("blob:svg-test")
  expect(mock.open.mock.calls[0]![1].aborted).toBe(true)
})

test("fractional zoom commits, invalid values revert, and Escape cancels the edit", async () => {
  render(<Client messages={m} />)
  choose()
  await screen.findByRole("img")
  const input = screen.getByRole("spinbutton", { name: m.zoom })
  fireEvent.change(input, { target: { value: "175.5" } })
  fireEvent.keyDown(input, { key: "Enter" })
  expect(screen.getByRole("img").style.width).toBe("1684.8px")
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
})

test("reports omitted and empty artwork, relative sizing and native image failures", async () => {
  mock.open.mockResolvedValue(
    prepare(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -20 100 100"><script>x</script></svg>'
    )
  )
  render(<Client messages={m} />)
  choose()
  const img = await screen.findByRole("img")
  expect(screen.getByText(m.removed)).toBeTruthy()
  expect(screen.getByText(m.emptyArtwork).getAttribute("role")).toBe("status")
  expect(screen.getByText(m.fallbackSize)).toBeTruthy()
  expect(
    screen.getByRole("button", { name: m.actualSize }).hasAttribute("disabled")
  ).toBe(true)
  fireEvent.error(img)
  expect(screen.getByRole("alert").textContent).toBe(m.renderError)
})

test("reports object URL allocation failure and releases each replaced image", async () => {
  created.mockImplementationOnce(() => {
    throw new RangeError("memory")
  })
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.renderError)
  choose(new File(["x"], "next.svg"))
  await screen.findByRole("img")
  choose(new File(["y"], "other.svg"))
  await waitFor(() => expect(created).toHaveBeenCalledTimes(3))
  expect(revoked).toHaveBeenCalledOnce()
})

test("reports unsupported, empty, compression, allocation and generic open failures", async () => {
  render(<Client messages={m} />)
  choose(new File(["x"], "x.pdf"))
  await screen.findByText(m.unsupported)
  choose(new File([], "x.svg"))
  await screen.findByText(m.emptyFile)
  expect(mock.open).not.toHaveBeenCalled()
  for (const [reason, key] of [
    [new Error("compression"), "compression"],
    [new RangeError("memory"), "resourceLimit"],
    [new Error("invalid"), "invalid"],
    [new Error("renderError"), "renderError"],
    [new Error("script load failed"), "renderError"],
    [null, "renderError"],
  ] as const) {
    mock.open.mockRejectedValueOnce(reason)
    choose()
    await screen.findByText(m[key])
  }
})

test("closing or replacing an opening file prevents stale worker results", async () => {
  let resolve!: (value: typeof preview) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  expect(screen.getByText(m.loading).textContent).toContain(m.loading)
  choose(new File(["x"], "new.svg"))
  await screen.findByRole("img")
  await act(async () => resolve({ ...preview, declaredWidth: "old" }))
  expect(screen.queryByText("old")).toBeNull()
  let reject!: (reason: Error) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail
      })
  )
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledTimes(3))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => reject(new Error("bad")))
  expect(screen.queryByText(m.invalid)).toBeNull()
})

test("mouse panning captures its pointer and ignores touch or non-primary buttons", async () => {
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
  expect(region.scrollLeft).toBe(70)
  expect(region.scrollTop).toBe(60)
  fireEvent.pointerUp(region)
  fireEvent.pointerCancel(region)
  fireEvent.lostPointerCapture(region)
  expect(region.setPointerCapture).toHaveBeenCalledWith(1)
})

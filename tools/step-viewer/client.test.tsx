import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { Vector3 } from "three"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({
  loadStep: vi.fn(),
  createViewport: vi.fn(),
  view: {
    fit: vi.fn(),
    view: vi.fn(),
    zoom: vi.fn(),
    rotate: vi.fn(),
    pick: vi.fn(),
    showMeasurement: vi.fn(),
    save: vi.fn(),
    dispose: vi.fn(),
  },
}))
vi.mock("./load-step", () => ({ loadStep: mock.loadStep }))
vi.mock("./viewport", () => ({ createViewport: mock.createViewport }))

beforeEach(() => {
  vi.resetAllMocks()
  mock.loadStep.mockResolvedValue({ size: [60, 36, 36], meshes: [] })
  mock.createViewport.mockReturnValue(mock.view)
  mock.view.save.mockResolvedValue(undefined)
})
afterEach(cleanup)

const button = (name: string) => screen.getByRole("button", { name })
function choose(filename: string) {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [new File([filename], filename)] },
  })
}

test("opens a sample, measures with the keyboard, converts units, and exports the result", async () => {
  render(<Client messages={m} lang="en" />)
  fireEvent.click(button(m.example))
  const viewport = await screen.findByRole("region", { name: m.viewport })
  expect(mock.loadStep.mock.calls[0]?.[0]).toMatchObject({
    name: "mounting-bracket.step",
  })
  expect(await screen.findByText("60 mm")).toBeTruthy()

  fireEvent.change(screen.getByLabelText(m.view), { target: { value: "top" } })
  fireEvent.click(button(m.fit))
  fireEvent.click(button(m.zoomIn))
  fireEvent.click(button(m.zoomOut))
  expect(mock.view.view).toHaveBeenCalledWith("top")
  expect(mock.view.fit).toHaveBeenCalledOnce()
  expect(mock.view.zoom.mock.calls).toEqual([[0.8], [1.25]])

  fireEvent.click(button(m.measure))
  expect(button(m.measure).getAttribute("aria-pressed")).toBe("true")
  expect(screen.getByText(m.firstPoint)).toBeTruthy()
  mock.view.pick
    .mockReturnValueOnce(new Vector3())
    .mockReturnValueOnce(new Vector3(25.4, 0, 0))
  fireEvent.keyDown(viewport, { key: "Enter" })
  expect(screen.getByText(m.secondPoint)).toBeTruthy()
  fireEvent.keyDown(viewport, { key: "ArrowRight" })
  expect(mock.view.rotate).toHaveBeenCalledWith(-0.12, 0)
  fireEvent.keyDown(viewport, { key: "Enter" })
  expect(screen.getByText("≈ 25.4 mm")).toBeTruthy()

  fireEvent.change(screen.getByLabelText(m.unit), { target: { value: "inch" } })
  expect(screen.getByText("≈ 1 in")).toBeTruthy()
  mock.view.save.mockRejectedValueOnce(new Error("PNG unavailable"))
  fireEvent.click(button(m.save))
  expect(mock.view.save).toHaveBeenCalledWith("mounting-bracket.step", "≈ 1 in")
  await screen.findByText(m.exportError)
  fireEvent.click(button(m.save))
  expect(screen.queryByText(m.exportError)).toBeNull()
  fireEvent.click(button(m.clearMeasurement))
  expect(mock.view.showMeasurement).toHaveBeenLastCalledWith([])
  fireEvent.click(button(m.clear))
  expect(mock.view.dispose).toHaveBeenCalledOnce()
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("dismisses a stale parse and can recover from an unreadable model", async () => {
  let complete: (model: unknown) => void = () => undefined
  mock.loadStep.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        complete = resolve
      })
  )
  mock.loadStep.mockResolvedValueOnce(null)
  render(<Client messages={m} lang="en" />)
  choose("slow.step")
  expect(screen.getByText(m.loading)).toBeTruthy()
  choose("invalid.stp")
  await screen.findByText(m.invalid)
  const firstSignal = mock.loadStep.mock.calls[0]?.[1] as AbortSignal
  expect(firstSignal.aborted).toBe(true)
  complete({ size: [1, 1, 1], meshes: [] })
  expect(screen.queryByRole("region", { name: m.viewport })).toBeNull()
  choose("recovered.step")
  expect(await screen.findByText("60 mm")).toBeTruthy()
})

test("shows separate file and WebGL errors with the file available for replacement", async () => {
  mock.loadStep.mockRejectedValueOnce(new Error("reader error"))
  mock.createViewport.mockImplementationOnce(() => {
    throw new Error("WebGL unavailable")
  })
  render(<Client messages={m} lang="en" />)
  choose("open.step")
  await screen.findByText(m.loadError)
  choose("render.step")
  await screen.findByText(m.renderError)
  expect(button(m.replace)).toBeTruthy()
})

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { Thumbnails } from "./thumbnails"
import m from "../messages/en.json"

afterEach(cleanup)
test("renders visible previews in sequence, discards hidden work, and clears canvases", async () => {
  let intersect!: (
    entries: { target: Element; isIntersecting: boolean }[]
  ) => void
  const disconnect = vi.fn()
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: typeof intersect) {
        intersect = callback
      }
      observe() {}
      disconnect = disconnect
    }
  )
  let finish!: () => void
  const thumbnail = vi.fn(async (canvas: HTMLCanvasElement) => {
    await new Promise<void>((resolve) => {
      finish = resolve
    })
    canvas.width = 144
    canvas.height = 81
  })
  const reader = {
    thumbnail,
    page: vi.fn(),
    zoom: vi.fn(),
    fitPage: vi.fn(),
    find: vi.fn(),
    dispose: vi.fn(),
  }
  const state = {
    page: 1,
    total: 3,
    zoom: 100,
    current: 0,
    matches: 0,
    searching: false,
    query: "",
  }
  const result = render(
    <Thumbnails reader={reader} state={state} messages={m} />
  )
  const canvases = Array.from(result.container.querySelectorAll("canvas"))
  expect(thumbnail).not.toHaveBeenCalled()
  fireEvent.click(screen.getByLabelText("Slide 2"))
  expect(reader.page).toHaveBeenCalledWith(2)
  intersect(canvases.map((target) => ({ target, isIntersecting: true })))
  await waitFor(() => expect(thumbnail).toHaveBeenCalledTimes(1))
  intersect([{ target: canvases[1]!, isIntersecting: false }])
  finish()
  await waitFor(() => expect(thumbnail).toHaveBeenCalledTimes(2))
  expect(thumbnail.mock.calls[1]![0]).toBe(canvases[2])
  result.unmount()
  finish()
  await waitFor(() =>
    expect(
      canvases.every((canvas) => canvas.width === 0 && canvas.height === 0)
    ).toBe(true)
  )
  expect(disconnect).toHaveBeenCalledOnce()
})
test("continues after a preview failure and cancels queued work on unmount", async () => {
  let intersect!: (
    entries: { target: Element; isIntersecting: boolean }[]
  ) => void
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: typeof intersect) {
        intersect = callback
      }
      observe() {}
      disconnect() {}
    }
  )
  const thumbnail = vi
    .fn()
    .mockRejectedValue(new Error("optional preview failed"))
  const reader = {
    thumbnail,
    page: vi.fn(),
    zoom: vi.fn(),
    fitPage: vi.fn(),
    find: vi.fn(),
    dispose: vi.fn(),
  }
  const state = {
    page: 1,
    total: 2,
    zoom: 100,
    current: 0,
    matches: 0,
    searching: false,
    query: "",
  }
  const result = render(
    <Thumbnails reader={reader} state={state} messages={m} />
  )
  const canvases = Array.from(result.container.querySelectorAll("canvas"))
  intersect([{ target: canvases[0]!, isIntersecting: true }])
  await waitFor(() => expect(thumbnail).toHaveBeenCalledOnce())
  intersect([{ target: canvases[1]!, isIntersecting: true }])
  result.unmount()
  await Promise.resolve()
  expect(thumbnail).toHaveBeenCalledOnce()
})

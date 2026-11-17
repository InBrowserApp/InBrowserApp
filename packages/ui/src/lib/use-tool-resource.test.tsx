import { act, cleanup, renderHook, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { useToolResource } from "./use-tool-resource"

afterEach(cleanup)

test("loads a resource once and exposes the result", async () => {
  const load = vi.fn<() => Promise<string>>().mockResolvedValue("registry")
  const { result, rerender } = renderHook(() => useToolResource(load))
  expect(result.current.loading).toBe(true)
  await waitFor(() => expect(result.current.data).toBe("registry"))
  rerender()
  expect(result.current.error).toBe(false)
  expect(result.current.loading).toBe(false)
  expect(load).toHaveBeenCalledTimes(1)
})

test("supports retry after a transient load error", async () => {
  const load = vi
    .fn<() => Promise<string>>()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValue("recovered")
  const { result } = renderHook(() => useToolResource(load))
  await waitFor(() => expect(result.current.error).toBe(true))
  expect(result.current.loading).toBe(false)
  act(() => result.current.retry())
  await waitFor(() => expect(result.current.data).toBe("recovered"))
  expect(result.current.error).toBe(false)
})

test.each(["resolve", "reject"] as const)(
  "ignores %s after unmount",
  async (outcome) => {
    let resolve!: (value: string) => void
    let reject!: (reason: Error) => void
    const load = () =>
      new Promise<string>((yes, no) => {
        resolve = yes
        reject = no
      })
    const { result, unmount } = renderHook(() => useToolResource(load))
    unmount()
    await act(async () => {
      if (outcome === "resolve") resolve("late")
      else reject(new Error("late"))
    })
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe(false)
  }
)

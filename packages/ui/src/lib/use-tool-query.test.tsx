import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"
import { useToolQuery } from "./use-tool-query"

const parse = (search: string) => new URLSearchParams(search).get("q") ?? ""
const href = (query: string) =>
  `/tools/example/?${new URLSearchParams({ q: query })}`

afterEach(() => {
  cleanup()
  window.history.replaceState(null, "", "/")
})

test("hydrates URL state without overwriting incoming queries", () => {
  window.history.replaceState(
    { keep: true },
    "",
    "/tools/example/?q=A%26B#result"
  )
  const { result } = renderHook(() => useToolQuery(parse, href))
  expect(result.current.query).toBe("A&B")
  expect(result.current.shareUrl).toContain("?q=A%26B#result")
  expect(window.history.state).toEqual({ keep: true })
})

test("updates the URL on actions, preserving history state and hash", () => {
  window.history.replaceState({ keep: true }, "", "/tools/example/#result")
  const { result } = renderHook(() => useToolQuery(parse, href))
  act(() => result.current.update("Apple + Test / #"))
  expect(result.current.query).toBe("Apple + Test / #")
  expect(parse(window.location.search)).toBe("Apple + Test / #")
  expect(window.location.hash).toBe("#result")
  expect(window.history.state).toEqual({ keep: true })
  expect(result.current.shareUrl).toBe(window.location.href)
})

test("restores state on browser navigation and removes its listener", () => {
  const { result, unmount } = renderHook(() => useToolQuery(parse, href))
  act(() => {
    window.history.replaceState(null, "", "/tools/example/?q=restored")
    window.dispatchEvent(new PopStateEvent("popstate"))
  })
  expect(result.current.query).toBe("restored")
  unmount()
  act(() => window.dispatchEvent(new PopStateEvent("popstate")))
  expect(result.current.query).toBe("restored")
})

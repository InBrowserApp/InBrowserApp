import { act, renderHook } from "@testing-library/react"
import { expect, test } from "vitest"
import { useHistory } from "./use-history"
import { DEFAULT_OPTIONS } from "../types"
import type { WatermarkLayer } from "../types"

const initial: readonly WatermarkLayer[] = [
  { id: "a", options: DEFAULT_OPTIONS, image: null, range: "" },
]
const edit = (value: number) => (layers: readonly WatermarkLayer[]) =>
  layers.map((layer) => ({ ...layer, options: { ...layer.options, x: value } }))

test("undoes and redoes edits, groups a drag into one step, and cancels without creating history", () => {
  const { result } = renderHook(() => useHistory(initial))
  act(() => {
    result.current.undo()
    result.current.redo()
    result.current.end()
    result.current.change((layers) => layers)
  })
  expect(result.current.canUndo).toBe(false)
  act(() => result.current.change(edit(60)))
  act(() => result.current.begin())
  act(() => {
    result.current.change(edit(70))
    result.current.change(edit(80))
    result.current.undo()
    result.current.redo()
  })
  expect(result.current.layers[0]!.options.x).toBe(80)
  act(() => result.current.end())
  act(() => result.current.undo())
  expect(result.current.layers[0]!.options.x).toBe(60)
  act(() => result.current.redo())
  expect(result.current.layers[0]!.options.x).toBe(80)
  act(() => {
    result.current.begin()
    result.current.change(edit(90))
  })
  act(() => result.current.end(true))
  expect(result.current.layers[0]!.options.x).toBe(80)
  act(() => {
    result.current.begin()
    result.current.end()
  })
  act(() => result.current.undo())
  act(() => result.current.change(edit(55)))
  expect(result.current.canRedo).toBe(false)
})

test("bounds history to 50 edits", () => {
  const { result } = renderHook(() => useHistory(initial))
  for (let i = 0; i < 60; i++) act(() => result.current.change(edit(i)))
  for (let i = 0; i < 60; i++) act(() => result.current.undo())
  expect(result.current.layers[0]!.options.x).toBe(9)
  expect(result.current.canUndo).toBe(false)
})

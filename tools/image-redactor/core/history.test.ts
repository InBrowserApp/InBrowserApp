import { describe, expect, it } from "vitest"
import { historyReducer, type History } from "./history"

describe("redaction history", () => {
  const initial: History<readonly number[]> = {
    past: [],
    present: [],
    future: [],
  }
  it("undoes and redoes immutable region snapshots", () => {
    const one = historyReducer(initial, { type: "commit", value: [1] })
    const two = historyReducer(one, { type: "commit", value: [1, 2] })
    const undo = historyReducer(two, { type: "undo" })
    expect(undo.present).toEqual([1])
    expect(undo.future).toEqual([[1, 2]])
    expect(historyReducer(undo, { type: "redo" })).toEqual(two)
    expect(initial.present).toEqual([])
  })
  it("discards redo after branching and resets for a new image", () => {
    const state: History<readonly number[]> = {
      past: [[]],
      present: [1],
      future: [[1, 2]],
    }
    expect(historyReducer(state, { type: "commit", value: [3] })).toEqual({
      past: [[], [1]],
      present: [3],
      future: [],
    })
    expect(historyReducer(state, { type: "reset", value: [] })).toEqual(initial)
  })
  it("ignores unavailable undo/redo and unchanged commits", () => {
    expect(historyReducer(initial, { type: "undo" })).toBe(initial)
    expect(historyReducer(initial, { type: "redo" })).toBe(initial)
    expect(
      historyReducer(initial, { type: "commit", value: initial.present })
    ).toBe(initial)
  })
})

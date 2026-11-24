import { expect, test } from "vitest"
import { emptyHistory, overwrite, redo, undo } from "./history"

test("tracks effective overwrites and restores the original byte when undone", () => {
  expect(overwrite(emptyHistory, 0, 65, 65)).toBe(emptyHistory)
  const first = overwrite(emptyHistory, 0, 65, 66)
  expect(first.edits.get(0)).toBe(66)
  expect(overwrite(first, 0, 65, 66)).toBe(first)

  const reverted = overwrite(first, 0, 65, 65)
  expect(reverted.edits.has(0)).toBe(false)
  const undone = undo(reverted, reverted.past.at(-1)!)
  expect(undone.edits.get(0)).toBe(66)

  const original = undo(undone, undone.past.at(-1)!)
  expect(original.edits.has(0)).toBe(false)
  const redone = redo(original, original.future.at(-1)!)
  expect(redone.edits.get(0)).toBe(66)
  expect(redo(redone, redone.future.at(-1)!).edits.has(0)).toBe(false)
  expect(overwrite(undone, 300, 0, 1).future).toEqual([])
  expect(emptyHistory.edits.size).toBe(0)
})

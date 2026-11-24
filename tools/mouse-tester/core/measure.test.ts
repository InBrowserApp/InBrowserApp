import { expect, test } from "vitest"

import { countPress, endDrag, trackDrag, wheelUnit } from "./measure"

test("counts a button press without changing other counters", () => {
  expect(countPress([0, 0, 1, 0, 0], 3)).toEqual([0, 0, 1, 1, 0])
  expect(countPress([0, 0, 0, 0, 0], -1)).toEqual([0, 0, 0, 0, 0])
})

test("keeps the farthest drag distance and finishes it on release", () => {
  const start = { origin: { x: 2, y: 3 }, distance: 0, active: true }
  expect(trackDrag(null, { x: 10, y: 10 })).toBeNull()
  const drag = trackDrag(start, { x: 5, y: 7 })
  expect(drag?.distance).toBe(5)
  expect(trackDrag(drag, { x: 2, y: 3 })?.distance).toBe(5)
  const ended = endDrag(drag)
  expect(ended?.active).toBe(false)
  expect(trackDrag(ended, { x: 300, y: 500 })).toBe(ended)
  expect(endDrag(start)).toBeNull()
  expect(endDrag(null)).toBeNull()
})

test("labels the unit reported by wheel events", () => {
  expect(wheelUnit(0)).toBe("pixels")
  expect(wheelUnit(1)).toBe("lines")
  expect(wheelUnit(2)).toBe("pages")
})

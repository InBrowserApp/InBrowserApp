import { expect, test } from "vitest"
import { planGif } from "./plan"

const video = { width: 1920, height: 1080, duration: 60000, maxWidth: 1280 }
const settings = { start: "1.25", end: "4.25", fps: 12, width: "480" }

test("samples inside the clip and keeps the GIF timing at fractional frame intervals", () => {
  const plan = planGif(settings, video)
  if ("error" in plan) throw new Error(plan.error)
  expect(plan).toMatchObject({ width: 480, height: 270, duration: 3000 })
  expect(plan.frames).toHaveLength(36)
  expect(plan.frames[0]).toEqual({ time: 1.25, delay: 80 })
  expect(plan.frames.at(-1)?.time).toBeLessThan(4.25)
  expect(plan.frames.reduce((sum, frame) => sum + frame.delay, 0)).toBe(3000)
})

test("does not sample the end of a clip with an integral number of frames", () => {
  const plan = planGif({ ...settings, start: "0", end: "5.25" }, video)
  if ("error" in plan) throw new Error(plan.error)
  expect(plan.frames).toHaveLength(63)
  expect(plan.frames.at(-1)?.time).toBeLessThan(5.25)
  expect(plan.frames.reduce((sum, frame) => sum + frame.delay, 0)).toBe(5250)
})

test("includes a partial final interval at a playable delay", () => {
  expect(planGif({ ...settings, end: "1.351", fps: 10 }, video)).toMatchObject({
    frames: [
      { time: 1.25, delay: 100 },
      { time: 1.35, delay: 20 },
    ],
  })
})

test.each([
  [{ start: "" }, "rangeError"],
  [{ start: "-1" }, "rangeError"],
  [{ end: "1.25" }, "rangeError"],
  [{ end: "61" }, "rangeError"],
  [{ width: "0" }, "widthError"],
  [{ width: "480.5" }, "widthError"],
  [{ width: "1281" }, "widthError"],
  [{ end: "50" }, "workLimit"],
  [{ end: "15", width: "1280", fps: 20 }, "workLimit"],
])("returns a recoverable error for %j", (update, error) => {
  expect(planGif({ ...settings, ...update }, video)).toEqual({ error })
})

test("keeps a narrow or portrait input at its aspect ratio", () => {
  expect(
    planGif(
      { ...settings, width: "300" },
      { ...video, width: 640, height: 1280 }
    )
  ).toMatchObject({ width: 300, height: 600 })
  expect(
    planGif({ ...settings, width: "1" }, { ...video, width: 1920, height: 1 })
  ).toMatchObject({ width: 1, height: 1 })
})

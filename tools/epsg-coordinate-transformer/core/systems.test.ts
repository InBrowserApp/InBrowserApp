import { describe, expect, it } from "vitest"
import { findSystem, project, systemLabel, systems } from "./systems"

const wgs = findSystem("4326")!
const mercator = findSystem("EPSG:3857")!

describe("EPSG coordinate transformation", () => {
  it("looks up the published names and EPSG codes", () => {
    expect(findSystem("wgs 84")).toBe(wgs)
    expect(findSystem(systemLabel(mercator))).toBe(mercator)
    expect(findSystem(" EPSG: 32760 ")?.name).toContain("60S")
    expect(findSystem("4326 wrongly formatted")).toBeUndefined()
    expect(findSystem("99999")).toBeUndefined()
    expect(findSystem("25805")).toBeUndefined()
    expect(findSystem("25833")?.name).toContain("33N")
    expect(new Set(systems.map((system) => system.code)).size).toBe(
      systems.length
    )
  })

  it("projects and reverses longitude, latitude in conventional x/y order", () => {
    expect(project(wgs, mercator, "1", "2")).toEqual([
      "111319.491",
      "222684.209",
    ])
    expect(project(mercator, wgs, "111319.491", "222684.209")).toEqual([
      "1",
      "2",
    ])
    expect(project(wgs, wgs, "١٫٢٥٠", "−2,3")).toEqual(["1.25", "-2.3"])
    expect(project(wgs, findSystem("32756")!, "153", "-30")).toEqual([
      "500000",
      "6681214.647",
    ])
  })

  it("rejects invalid coordinates and Web Mercator limits", () => {
    expect(project(wgs, mercator, "181", "0")).toBeUndefined()
    expect(project(wgs, findSystem("32633")!, "105", "0")).toBeUndefined()
    expect(project(wgs, mercator, "0", "91")).toBeUndefined()
    expect(project(wgs, mercator, "0", "90")).toBeUndefined()
    expect(project(wgs, mercator, "", "0")).toBeUndefined()
    expect(project(wgs, mercator, "0", "a")).toBeUndefined()
    expect(project(mercator, wgs, "0", "20037509")).toBeUndefined()
    expect(project(wgs, { code: 0, name: "Invalid" }, "0", "0")).toBeUndefined()
  })
})

it("can reverse rounded output on the Web Mercator boundary", () => {
  const output = project(wgs, mercator, "180", "0")
  expect(output).toEqual(["20037508.343", "0"])
  expect(project(mercator, wgs, ...output!)).toEqual(["180", "0"])
})

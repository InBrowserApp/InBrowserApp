// @vitest-environment jsdom

import { expect, it } from "vitest"
import { parseGpx } from "./gpx"

it("sums distance within each segment and records elevation without bridging gaps", () => {
  const data = parseGpx(`<gpx xmlns="http://www.topografix.com/GPX/1/1">
    <trk><trkseg><trkpt lat="0" lon="0"><ele>5</ele></trkpt><trkpt lat="0" lon="0.01"><ele>10</ele></trkpt>
    <trkpt lat="0" lon="0.02"/><trkpt lat="0" lon="0.03"><ele>15</ele></trkpt></trkseg>
    <trkseg><trkpt lat="5" lon="4"><ele>8</ele></trkpt><trkpt lat="5" lon="4.01"><ele>6</ele></trkpt></trkseg>
    <trkseg/></trk>
    <rte><rtept lat="10" lon="20"/></rte>
    <wpt lat="10" lon="20"><name> Start </name></wpt>
  </gpx>`)
  expect(data.distance).toBeCloseTo(4443.6, 0)
  expect(data.ascent).toBe(5)
  expect(data.descent).toBe(2)
  expect(
    data.profile.map((line) => line.map(({ elevation }) => elevation))
  ).toEqual([[5, 10], [15], [8, 6]])
  expect(data.features.map(({ geometry }) => geometry.type)).toEqual([
    "LineString",
    "LineString",
    "Point",
    "Point",
  ])
  expect(data.waypoints[0]?.name).toBe("Start")
})

it("fits coordinates crossing the date line and supports waypoint-only files", () => {
  const track = parseGpx(
    '<gpx><rte><rtept lat="0" lon="179"><ele>1</ele></rtept><rtept lat="0" lon="-179"><ele>2</ele></rtept></rte></gpx>'
  )
  expect(track.features[0]?.geometry).toEqual({
    type: "LineString",
    coordinates: [
      [179, 0],
      [181, 0],
    ],
  })
  expect(track.profile[0]?.[1]?.lon).toBe(181)
  expect(parseGpx('<gpx><wpt lat="1" lon="2"/></gpx>').distance).toBe(0)
})

it("rejects malformed, empty and out-of-range coordinates", () => {
  for (const text of [
    "<gpx",
    "<gpx/>",
    '<gpx><wpt lon="0"/></gpx>',
    '<gpx><wpt lat="91" lon="0"/></gpx>',
    '<gpx><wpt lat="0" lon="181"/></gpx>',
  ]) {
    expect(() => parseGpx(text)).toThrow(
      /Invalid XML|Empty GPX|Invalid GPX coordinates/
    )
  }
})

it("unwraps each point relative to the previous one and rejects parser errors", () => {
  const route = parseGpx(
    '<gpx><rte><rtept lat="0" lon="0"/><rtept lat="0" lon="100"/><rtept lat="0" lon="179"/><rtept lat="0" lon="-179"/></rte></gpx>'
  )
  expect(route.features[0]?.geometry).toEqual({
    type: "LineString",
    coordinates: [
      [0, 0],
      [100, 0],
      [179, 0],
      [181, 0],
    ],
  })
  expect(() => parseGpx('<gpx><wpt lat="1" lon="2"/>')).toThrow("Invalid XML")
})

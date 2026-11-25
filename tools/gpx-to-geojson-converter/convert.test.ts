// @vitest-environment jsdom

import { expect, test } from "vitest"
import { convertGpx, readGpxFile } from "./convert"

test("converts prefixed waypoints and single-point routes without losing GPS values", () => {
  const result = JSON.parse(
    convertGpx(`<g:gpx xmlns:g="http://www.topografix.com/GPX/1/1">
    <g:wpt lat="0" lon="-4"><g:ele>0</g:ele><g:name>Coast</g:name><g:time>2026-01-01T00:00:00Z</g:time></g:wpt>
    <g:rte><g:name>Route</g:name><g:rtept lon="120" lat="23"><g:ele>-2</g:ele></g:rtept></g:rte>
  </g:gpx>`)
  )
  expect(result).toMatchObject({
    type: "FeatureCollection",
    features: [
      {
        geometry: { type: "Point", coordinates: [-4, 0, 0] },
        properties: {
          name: "Coast",
          time: "2026-01-01T00:00:00Z",
          gpxType: "waypoint",
        },
      },
      {
        geometry: { type: "Point", coordinates: [120, 23, -2] },
        properties: { name: "Route", gpxType: "route" },
      },
    ],
  })
})

test("keeps separate track segments and timestamps in coordinate order", () => {
  const result = JSON.parse(
    convertGpx(`<gpx><trk><name>Walk</name>
    <trkseg><trkpt lon="5" lat="10"/><trkpt lon="6" lat="11"><time>2026-01-01T00:00:00Z</time></trkpt></trkseg>
    <trkseg><trkpt lon="8" lat="13"/><trkpt lon="9" lat="14"/></trkseg>
    <trkseg><trkpt lon="10" lat="15"/></trkseg>
  </trk></gpx>`)
  )
  expect(result.features).toMatchObject([
    {
      geometry: {
        type: "GeometryCollection",
        geometries: [
          {
            type: "LineString",
            coordinates: [
              [5, 10],
              [6, 11],
            ],
          },
          {
            type: "LineString",
            coordinates: [
              [8, 13],
              [9, 14],
            ],
          },
          { type: "Point", coordinates: [10, 15] },
        ],
      },
      properties: {
        coordinateProperties: {
          times: [[null, "2026-01-01T00:00:00Z"], [null, null], [null]],
        },
      },
    },
  ])
})

test("splits route geometry at the antimeridian and aligns times and elevation", () => {
  const result = JSON.parse(
    convertGpx(`<gpx><rte>
    <rtept lat="50" lon="179"><ele>10</ele><time>2026-01-01T00:00:00Z</time></rtept>
    <rtept lat="52" lon="-179"><ele>30</ele><time>2026-01-01T00:00:10Z</time></rtept>
  </rte></gpx>`)
  )
  expect(result.features).toMatchObject([
    {
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [179, 50, 10],
            [180, 51, 20],
          ],
          [
            [-180, 51, 20],
            [-179, 52, 30],
          ],
        ],
      },
      properties: {
        coordinateProperties: {
          times: [
            ["2026-01-01T00:00:00Z", null],
            [null, "2026-01-01T00:00:10Z"],
          ],
        },
      },
    },
  ])
})

test("reads UTF-16 GPX and distinguishes empty collections from invalid XML or coordinates", async () => {
  const xml = '<gpx><wpt lat="5" lon="6"><name>Québec</name></wpt></gpx>'
  const bytes = new Uint8Array(2 + xml.length * 2)
  bytes.set([0xff, 0xfe])
  const view = new DataView(bytes.buffer)
  for (let index = 0; index < xml.length; index++)
    view.setUint16(2 + index * 2, xml.charCodeAt(index), true)
  expect(await readGpxFile(new File([bytes], "example.gpx"))).toBe(xml)
  expect(JSON.parse(convertGpx("<gpx/>"))).toEqual({
    type: "FeatureCollection",
    features: [],
  })
  expect(() => convertGpx("<foo/>")).toThrow("Invalid XML")
  expect(() => convertGpx('<gpx><wpt lat="" lon="6"/></gpx>')).toThrow(
    "Invalid GPX coordinates"
  )
  expect(() => convertGpx('<gpx><wpt lat="5" lon="181"/></gpx>')).toThrow(
    "Invalid GPX coordinates"
  )
})

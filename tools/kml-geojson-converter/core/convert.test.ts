// @vitest-environment jsdom

import { expect, it } from "vitest"
import { convert } from "./convert"

it("reads KML folders, prefixed KML and placemark metadata", () => {
  const input =
    '<k:kml xmlns:k="http://www.opengis.net/kml/2.2"><k:Folder><k:Placemark><k:name>Station</k:name><k:Point><k:coordinates>139,35,9</k:coordinates></k:Point></k:Placemark></k:Folder></k:kml>'
  const output = JSON.parse(convert(input, false))
  expect(output.features[0]).toMatchObject({
    geometry: { type: "Point", coordinates: [139, 35, 9] },
    properties: { name: "Station" },
  })
})

it("escapes properties and preserves polygon holes and multiple geometries", () => {
  const ring = [
    [0, 0],
    [3, 0],
    [3, 3],
    [0, 3],
    [0, 0],
  ]
  const hole = [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 1],
  ]
  const feature = {
    type: "Feature",
    properties: { name: "A & B", description: "<test>", 'a"b': true },
    geometry: {
      type: "GeometryCollection",
      geometries: [
        {
          type: "MultiPoint",
          coordinates: [
            [1, 1],
            [2, 2],
          ],
        },
        {
          type: "MultiLineString",
          coordinates: [
            [
              [1, 1],
              [2, 2],
            ],
          ],
        },
        { type: "MultiPolygon", coordinates: [[ring, hole]] },
      ],
    },
  }
  const kml = convert(JSON.stringify(feature), true)
  expect(kml).toContain("A &amp; B")
  expect(kml).toContain("&lt;test&gt;")
  expect(kml).toContain('<Data name="a&quot;b"><value>true</value>')
  expect(kml).toContain("<innerBoundaryIs>")
  expect(JSON.parse(convert(kml, false)).features[0].geometry.type).toBe(
    "GeometryCollection"
  )
})

it("allows a placemark with no geometry and rejects malformed input", () => {
  const feature = { type: "Feature", geometry: null, properties: null }
  expect(
    JSON.parse(convert(convert(JSON.stringify(feature), true), false))
      .features[0].geometry
  ).toBeNull()
  expect(() => convert("<kml", false)).toThrow("Invalid XML")
  expect(() => convert("<gpx/>", false)).toThrow("Invalid XML")
  expect(() => convert("{}", true)).toThrow("Invalid GeoJSON")
})

it("rejects malformed coordinate tuples and writes valid XML for user metadata", () => {
  for (const tuple of ["1", "1,garbage,3", "1,2,,", "1,"]) {
    expect(() =>
      convert(
        `<kml><Placemark><Point><coordinates>${tuple}</coordinates></Point></Placemark></kml>`,
        false
      )
    ).toThrow("Invalid KML coordinates")
  }
  const feature = {
    type: "Feature",
    geometry: null,
    properties: {
      name: "a\u0000b✨🌱",
      description: { "@type": "html", value: "<b>Trail</b>" },
    },
  }
  const kml = convert(JSON.stringify(feature), true)
  expect(kml).toContain("<name>a�b✨🌱</name>")
  expect(kml).toContain("<description><![CDATA[<b>Trail</b>]]></description>")
})

it("accepts a KML document with no geometries", () => {
  expect(
    JSON.parse(convert("<kml><coordinates> </coordinates></kml>", false))
      .features
  ).toEqual([])
})

it("reads a rich description as XML character data and preserves it on export", () => {
  const input =
    '<kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><description><![CDATA[<b>Trail</b>]]></description><Point><coordinates>1,2</coordinates></Point></Placemark></kml>'
  const plain = convert(input, false)
  expect(JSON.parse(plain).features[0].properties.description).toEqual({
    "@type": "html",
    value: "<b>Trail</b>",
  })
  expect(convert(plain, true)).toContain("<![CDATA[<b>Trail</b>]]>")
  expect(() => convert("<kml><Placemark/>", false)).toThrow("Invalid XML")
})

import { kml } from "@tmcw/togeojson"
import {
  featuresOf,
  geoJsonValue,
  parseGeoJson,
  positionsOf,
} from "@workspace/geospatial/geojson"
import { parseXml } from "@workspace/geospatial/xml"
import type { Feature, Geometry, Position } from "geojson"

const xmlEntities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
}

function xmlText(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value)
  return Array.from(text, (char) => {
    const code = char.codePointAt(0)!
    return code === 9 ||
      code === 10 ||
      code === 13 ||
      (code >= 32 && code <= 0xd7ff) ||
      (code >= 0xe000 && code <= 0xfffd) ||
      code >= 0x10000
      ? char
      : "�"
  }).join("")
}

function escapeXml(value: unknown) {
  return xmlText(value).replace(
    /[&<>"']/g,
    (char) => xmlEntities[char as keyof typeof xmlEntities]
  )
}

function descriptionXml(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "@type" in value &&
    value["@type"] === "html" &&
    "value" in value &&
    typeof value.value === "string"
  ) {
    return `<description><![CDATA[${xmlText(value.value).replaceAll("]]>", "]]]]><![CDATA[>")}]]></description>`
  }
  return value == null ? "" : `<description>${escapeXml(value)}</description>`
}

function coordinates(points: Position[]) {
  return `<coordinates>${points.map((point) => point.slice(0, 3).join(",")).join(" ")}</coordinates>`
}

function multi(parts: string[]): string {
  return `<MultiGeometry>${parts.join("")}</MultiGeometry>`
}

function geometryXml(geometry: Geometry): string {
  switch (geometry.type) {
    case "Point":
      return `<Point>${coordinates([geometry.coordinates])}</Point>`
    case "LineString":
      return `<LineString>${coordinates(geometry.coordinates)}</LineString>`
    case "Polygon":
      return `<Polygon>${geometry.coordinates
        .map((ring, index) => {
          const boundary = index === 0 ? "outerBoundaryIs" : "innerBoundaryIs"
          return `<${boundary}><LinearRing>${coordinates(ring)}</LinearRing></${boundary}>`
        })
        .join("")}</Polygon>`
    case "MultiPoint":
      return multi(
        geometry.coordinates.map((part) =>
          geometryXml({ type: "Point", coordinates: part })
        )
      )
    case "MultiLineString":
      return multi(
        geometry.coordinates.map((part) =>
          geometryXml({ type: "LineString", coordinates: part })
        )
      )
    case "MultiPolygon":
      return multi(
        geometry.coordinates.map((part) =>
          geometryXml({ type: "Polygon", coordinates: part })
        )
      )
    case "GeometryCollection":
      return multi(geometry.geometries.map(geometryXml))
  }
}

function placemark({ geometry, properties }: Feature<Geometry | null>) {
  const { name, description, ...fields } = properties ?? {}
  const fieldsXml = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<Data name="${escapeXml(key)}"><value>${escapeXml(value)}</value></Data>`
    )
    .join("")
  const lines = [
    name == null ? "" : `<name>${escapeXml(name)}</name>`,
    descriptionXml(description),
    fieldsXml ? `<ExtendedData>${fieldsXml}</ExtendedData>` : "",
  ]
  if (geometry && positionsOf(geometry).length)
    lines.push(geometryXml(geometry))
  return [
    "    <Placemark>",
    ...lines.filter(Boolean).map((line) => `      ${line}`),
    "    </Placemark>",
  ].join("\n")
}

function readKml(input: string) {
  const xml = parseXml(input, "kml")
  const root = xml.documentElement
  for (const element of xml.getElementsByTagNameNS(
    root.namespaceURI,
    "coordinates"
  )) {
    const text = element.textContent?.trim()
    if (!text) continue
    for (const tuple of text.split(/\s+/)) {
      const parts = tuple.split(",")
      if (
        parts.length < 2 ||
        parts.length > 3 ||
        !parts.every((part) => part.trim() && Number.isFinite(Number(part)))
      ) {
        throw new Error("Invalid KML coordinates")
      }
    }
  }

  // toGeoJSON looks up the standard KML tags by unqualified name.
  const standard = Array.from(
    xml.getElementsByTagNameNS(root.namespaceURI, "*")
  )
  for (const element of standard) {
    if (!element.prefix) continue
    const unqualified = xml.createElementNS(
      element.namespaceURI,
      element.localName
    )
    for (const attribute of Array.from(element.attributes)) {
      unqualified.setAttributeNS(
        attribute.namespaceURI,
        attribute.name,
        attribute.value
      )
    }
    unqualified.append(...Array.from(element.childNodes))
    element.replaceWith(unqualified)
  }
  return JSON.stringify(geoJsonValue(kml(xml)), null, 2)
}

function convert(input: string, reverse: boolean) {
  if (!reverse) return readKml(input)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<kml xmlns="http://www.opengis.net/kml/2.2">',
    "  <Document>",
    ...featuresOf(parseGeoJson(input)).map(placemark),
    "  </Document>",
    "</kml>",
  ].join("\n")
}

export { convert }

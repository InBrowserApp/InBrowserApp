export type GpxPoint = Readonly<{
  lon: number
  lat: number
  elevation?: number
}>

export function gpxChildren(element: Element, name: string) {
  return Array.from(element.children).filter(
    (child) =>
      child.localName === name && child.namespaceURI === element.namespaceURI
  )
}

function numeric(text: string | null | undefined) {
  return text?.trim() ? Number(text) : Number.NaN
}

export function readGpxPosition(element: Element): GpxPoint {
  const lat = numeric(element.getAttribute("lat"))
  const lon = numeric(element.getAttribute("lon"))
  if (
    !Number.isFinite(lat) ||
    Math.abs(lat) > 90 ||
    !Number.isFinite(lon) ||
    Math.abs(lon) > 180
  ) {
    throw new Error("Invalid GPX coordinates")
  }
  const elevation = numeric(gpxChildren(element, "ele")[0]?.textContent)
  return Number.isFinite(elevation) ? { lat, lon, elevation } : { lat, lon }
}

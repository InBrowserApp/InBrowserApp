import proj4 from "proj4"

type System = Readonly<{
  code: number
  name: string
  definition?: string
  geographic?: boolean
}>

const wgs84 = { code: 4326, name: "WGS 84", geographic: true } as const
const webMercator = {
  code: 3857,
  name: "Web Mercator",
} as const

const systems: readonly System[] = [
  wgs84,
  webMercator,
  {
    code: 4269,
    name: "NAD83",
    geographic: true,
    definition: "+proj=longlat +datum=NAD83",
  },
  {
    code: 4258,
    name: "ETRS89",
    geographic: true,
    definition: "+proj=longlat +ellps=GRS80",
  },
  {
    code: 4490,
    name: "CGCS2000",
    geographic: true,
    definition: "+proj=longlat +ellps=GRS80",
  },
  {
    code: 4612,
    name: "JGD2000",
    geographic: true,
    definition: "+proj=longlat +ellps=GRS80",
  },
  {
    code: 6668,
    name: "JGD2011",
    geographic: true,
    definition: "+proj=longlat +ellps=GRS80",
  },
  {
    code: 3395,
    name: "WGS 84 / World Mercator",
    definition: "+proj=merc +datum=WGS84 +units=m",
  },
  {
    code: 2154,
    name: "RGF93 v1 / Lambert-93",
    definition:
      "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +units=m",
  },
  {
    code: 3035,
    name: "ETRS89-extended / LAEA Europe",
    definition:
      "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m",
  },
  {
    code: 2193,
    name: "NZGD2000 / New Zealand Transverse Mercator 2000",
    definition:
      "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +units=m",
  },
  ...Array.from({ length: 60 }, (_, i) => i + 1).flatMap((zone) => [
    {
      code: 32600 + zone,
      name: `WGS 84 / UTM zone ${zone}N`,
      definition: `+proj=utm +zone=${zone} +datum=WGS84 +units=m`,
    },
    {
      code: 32700 + zone,
      name: `WGS 84 / UTM zone ${zone}S`,
      definition: `+proj=utm +zone=${zone} +south +datum=WGS84 +units=m`,
    },
  ]),
  ...Array.from({ length: 10 }, (_, i) => i + 28).map((zone) => ({
    code: 25800 + zone,
    name: `ETRS89 / UTM zone ${zone}N`,
    definition: `+proj=utm +zone=${zone} +ellps=GRS80 +units=m`,
  })),
]

const byCode = new Map(systems.map((system) => [system.code, system]))
const mercatorLatitudeLimit = 85.0511287798066
const mercatorXYLimit = 20_037_508.342789244

function systemLabel(system: System) {
  return `EPSG:${system.code} — ${system.name}`
}

function findSystem(value: string) {
  const query = value.trim()
  const code = /^(?:EPSG:\s*)?(\d+)(?:\s+—.*)?$/i.exec(query)?.[1]
  if (code) return byCode.get(Number(code))
  return systems.find(
    (system) => system.name.toLowerCase() === query.toLowerCase()
  )
}

function parseCoordinate(value: string) {
  const text = value
    .trim()
    .replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) % 16))
    .replace(/[,٫]/g, ".")
    .replace("−", "-")
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)
    ? Number(text)
    : Number.NaN
}

function project(source: System, target: System, xText: string, yText: string) {
  const x = parseCoordinate(xText)
  const y = parseCoordinate(yText)
  if (!Number.isFinite(x) || !Number.isFinite(y)) return
  if (source.geographic && (Math.abs(x) > 180 || Math.abs(y) > 90)) return
  if (
    source.code === 3857 &&
    Math.max(Math.abs(x), Math.abs(y)) > mercatorXYLimit + 0.0005
  )
    return

  try {
    const from = source.definition ?? `EPSG:${source.code}`
    const to = target.definition ?? `EPSG:${target.code}`
    const clampMercator = (value: number) =>
      Math.max(-mercatorXYLimit, Math.min(mercatorXYLimit, value))
    const input: [number, number] =
      source.code === 3857 ? [clampMercator(x), clampMercator(y)] : [x, y]
    if (
      target.code === 3857 &&
      Math.abs(proj4(from, "EPSG:4326", input)[1]) >
        mercatorLatitudeLimit + 5e-9
    )
      return

    const output = source.code === target.code ? input : proj4(from, to, input)
    if (!output.every(Number.isFinite)) return
    return output.map((value) =>
      String(Number(value.toFixed(target.geographic ? 8 : 3)))
    ) as [string, string]
  } catch {
    return
  }
}

export { findSystem, project, systemLabel, systems, webMercator, wgs84 }
export type { System }

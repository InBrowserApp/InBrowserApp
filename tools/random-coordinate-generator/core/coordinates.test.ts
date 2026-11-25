import { describe, expect, it } from "vitest"
import { generateCoordinates } from "./coordinates"

type Coordinate = [latitude: number, longitude: number]

function fromPair(pair: string): Coordinate {
  const [latitude, longitude] = pair.split(", ")
  return [Number(latitude), Number(longitude)]
}

function isCoordinate([latitude, longitude]: Coordinate) {
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
}

function distanceKm(
  [fromLat, fromLon]: Coordinate,
  [toLat, toLon]: Coordinate
) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180
  const chord =
    Math.sin(radians(toLat - fromLat) / 2) ** 2 +
    Math.cos(radians(fromLat)) *
      Math.cos(radians(toLat)) *
      Math.sin(radians(toLon - fromLon) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(chord)))
}

describe("generateCoordinates", () => {
  it("outputs valid worldwide coordinates in latitude-longitude order with six decimals", async () => {
    const points = await generateCoordinates({ area: "worldwide" }, 1000)

    expect(points).toHaveLength(1000)
    expect(
      points.every(
        (point) =>
          /^-?\d{1,3}\.\d{6}, -?\d{1,3}\.\d{6}$/.test(point) &&
          isCoordinate(fromPair(point))
      )
    ).toBe(true)
  })

  const nearbyOrigins: Coordinate[] = [
    [37.7749, -122.4194],
    [0, 179.99],
    [90, 0],
    [-90, 0],
  ]

  it.each(nearbyOrigins)(
    "keeps nearby points in range around %s, %s",
    async (latitude, longitude) => {
      const radius = 25
      const points = await generateCoordinates(
        { area: "nearby", latitude, longitude, radius },
        100
      )

      expect(points).toHaveLength(100)
      expect(
        points.every((point) => {
          const coordinate = fromPair(point)
          // Allow for six-place rounding in the exported text.
          return (
            isCoordinate(coordinate) &&
            distanceKm([latitude, longitude], coordinate) <= radius + 0.001
          )
        })
      ).toBe(true)
    }
  )
})

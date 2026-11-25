export type CoordinateRequest =
  | Readonly<{ area: "worldwide" }>
  | Readonly<{
      area: "nearby"
      latitude: number
      longitude: number
      radius: number
    }>

const precision = 6

export async function generateCoordinates(
  request: CoordinateRequest,
  count: number
) {
  const { faker } = await import("@faker-js/faker/locale/en_US")

  return Array.from({ length: count }, () => {
    const [latitude, longitude]: [number, number] =
      request.area === "worldwide"
        ? [
            faker.location.latitude({ precision }),
            faker.location.longitude({ precision }),
          ]
        : faker.location.nearbyGPSCoordinate({
            origin: [request.latitude, request.longitude],
            radius: request.radius,
            isMetric: true,
          })

    return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`
  })
}

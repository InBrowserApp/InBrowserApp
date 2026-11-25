export async function generateVins(quantity: number) {
  const { faker } = await import("@faker-js/faker/locale/en_US")

  return Array.from({ length: quantity }, () => faker.vehicle.vin())
}

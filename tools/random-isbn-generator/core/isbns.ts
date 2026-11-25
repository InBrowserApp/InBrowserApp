export type IsbnFormat = Readonly<{ variant: 10 | 13; separator: "-" | "" }>

export async function generateIsbns(format: IsbnFormat, quantity: number) {
  const { faker } = await import("@faker-js/faker/locale/en_US")

  return Array.from({ length: quantity }, () => faker.commerce.isbn(format))
}

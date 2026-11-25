export const EXAMPLE_DOMAINS = [
  "example.com",
  "example.net",
  "example.org",
] as const
export const MAX_EMAIL_ADDRESSES = 1000
export type EmailDomain = "any" | (typeof EXAMPLE_DOMAINS)[number]

export async function generateEmailAddresses(
  domain: EmailDomain,
  count: number
) {
  const { faker } = await import("@faker-js/faker/locale/en_US")
  const generateEmail =
    domain === "any"
      ? () => faker.internet.exampleEmail()
      : () => faker.internet.email({ provider: domain })

  return faker.helpers.uniqueArray(generateEmail, count)
}

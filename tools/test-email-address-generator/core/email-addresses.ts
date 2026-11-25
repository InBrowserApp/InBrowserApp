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
  return faker.helpers.uniqueArray(
    () =>
      faker.internet.email({
        provider:
          domain === "any"
            ? faker.helpers.arrayElement(EXAMPLE_DOMAINS)
            : domain,
      }),
    count
  )
}

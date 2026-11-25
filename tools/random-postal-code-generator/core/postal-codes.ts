const localeLoaders = {
  AU: () => import("@faker-js/faker/locale/en_AU"),
  BR: () => import("@faker-js/faker/locale/pt_BR"),
  CA: () => import("@faker-js/faker/locale/en_CA"),
  CN: () => import("@faker-js/faker/locale/zh_CN"),
  DE: () => import("@faker-js/faker/locale/de"),
  FR: () => import("@faker-js/faker/locale/fr"),
  GB: () => import("@faker-js/faker/locale/en_GB"),
  IN: () => import("@faker-js/faker/locale/en_IN"),
  JP: () => import("@faker-js/faker/locale/ja"),
  KR: () => import("@faker-js/faker/locale/ko"),
  TW: () => import("@faker-js/faker/locale/zh_TW"),
  US: () => import("@faker-js/faker/locale/en_US"),
}

export type PostalCountry = keyof typeof localeLoaders
export type ZipFormat = "zip5" | "zip4"

export const POSTAL_COUNTRIES = Object.keys(localeLoaders) as PostalCountry[]
export const MAX_POSTAL_CODES = 1000

export function getDefaultPostalCountry(lang: string): PostalCountry {
  const region = new Intl.Locale(lang).maximize().region
  return POSTAL_COUNTRIES.find((country) => country === region) ?? "US"
}

export async function generatePostalCodes(
  country: PostalCountry,
  count: number,
  zipFormat: ZipFormat
) {
  const { faker } = await localeLoaders[country]()
  const { location } = faker

  return Array.from({ length: count }, () => {
    switch (country) {
      case "US":
        return location.zipCode(zipFormat === "zip4" ? "#####-####" : "#####")
      case "GB": {
        // Keep Faker's postcode area and generate the digit-letter-letter suffix.
        const [outward] = location.zipCode().split(" ")
        const inward = faker.helpers.fromRegExp(/[0-9][ABD-HJLNP-UW-Z]{2}/)
        return `${outward} ${inward}`
      }
      case "IN":
        return location.zipCode(`${faker.number.int({ min: 1, max: 9 })}#####`)
      case "KR":
        return location.zipCode("#####")
      default:
        return location.zipCode()
    }
  })
}

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

export type PhoneCountry = keyof typeof localeLoaders
export const PHONE_COUNTRIES = Object.keys(localeLoaders) as PhoneCountry[]
export const PHONE_FORMATS = ["national", "international"] as const
export type PhoneFormat = (typeof PHONE_FORMATS)[number]
export const MAX_PHONE_NUMBERS = 1000

// Sample geographic area codes from the Canadian and North American numbering administrators.
const areaCodesByCountry: Partial<Record<PhoneCountry, readonly string[]>> = {
  CA: ["204", "403", "416", "514", "604", "613", "709", "902"],
  US: ["202", "206", "212", "213", "312", "404", "415", "617", "702", "713"],
}

export function getDefaultPhoneCountry(lang: string): PhoneCountry {
  const region = new Intl.Locale(lang).maximize().region
  return PHONE_COUNTRIES.find((country) => country === region) ?? "US"
}

export async function generatePhoneNumbers(
  country: PhoneCountry,
  format: PhoneFormat,
  count: number
) {
  const { faker } = await localeLoaders[country]()
  const areaCodes = areaCodesByCountry[country]

  return Array.from({ length: count }, () => {
    const number = faker.phone.number({ style: format })
    if (!areaCodes) return number

    // Faker's national and international masks randomize the shared +1 area code.
    const areaCode = faker.helpers.arrayElement(areaCodes)
    return format === "international"
      ? number.replace(/^\+1\d{3}/, `+1${areaCode}`)
      : number.replace(/\d{3}/, areaCode)
  })
}

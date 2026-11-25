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
  return Array.from({ length: count }, () =>
    faker.phone.number({ style: format })
  )
}

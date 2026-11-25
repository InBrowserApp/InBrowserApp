import { describe, expect, it } from "vitest"
import {
  generatePhoneNumbers,
  getDefaultPhoneCountry,
  PHONE_COUNTRIES,
} from "./phone-numbers"
import type { PhoneCountry } from "./phone-numbers"

const callingCodes: Record<PhoneCountry, string> = {
  AU: "+61",
  BR: "+55",
  CA: "+1",
  CN: "+86",
  DE: "+49",
  FR: "+33",
  GB: "+44",
  IN: "+91",
  JP: "+81",
  KR: "+82",
  TW: "+886",
  US: "+1",
}

describe("random phone numbers", () => {
  it.each(PHONE_COUNTRIES)(
    "uses national and international formats for %s",
    async (country) => {
      const national = await generatePhoneNumbers(country, "national", 50)
      const international = await generatePhoneNumbers(
        country,
        "international",
        50
      )

      expect(national).toHaveLength(50)
      expect(national.every((number) => /^[0-9(). -]+$/.test(number))).toBe(
        true
      )
      expect(international).toHaveLength(50)
      expect(
        international.every(
          (number) =>
            /^\+[1-9]\d{6,14}$/.test(number) &&
            number.startsWith(callingCodes[country])
        )
      ).toBe(true)
    }
  )

  it("chooses a supported default region from the interface language", () => {
    expect(getDefaultPhoneCountry("en-GB")).toBe("GB")
    expect(getDefaultPhoneCountry("zh-TW")).toBe("TW")
    expect(getDefaultPhoneCountry("ja")).toBe("JP")
    expect(getDefaultPhoneCountry("nl")).toBe("US")
  })
})

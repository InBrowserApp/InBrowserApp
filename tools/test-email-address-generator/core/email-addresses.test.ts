import { describe, expect, it } from "vitest"
import {
  EXAMPLE_DOMAINS,
  generateEmailAddresses,
  MAX_EMAIL_ADDRESSES,
} from "./email-addresses"

const sampleAddress =
  /^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*@example\.(?:com|net|org)$/i

describe("generateEmailAddresses", () => {
  it("makes a full, unique batch on reserved example domains", async () => {
    const addresses = await generateEmailAddresses("any", MAX_EMAIL_ADDRESSES)

    expect(addresses).toHaveLength(MAX_EMAIL_ADDRESSES)
    expect(new Set(addresses).size).toBe(addresses.length)
    expect(addresses.every((address) => sampleAddress.test(address))).toBe(true)
  })

  it.each(EXAMPLE_DOMAINS)(
    "uses only %s for a fixed-domain batch",
    async (domain) => {
      const addresses = await generateEmailAddresses(domain, 100)

      expect(addresses).toHaveLength(100)
      expect(
        addresses.every(
          (address) =>
            sampleAddress.test(address) && address.endsWith(`@${domain}`)
        )
      ).toBe(true)
    }
  )
})

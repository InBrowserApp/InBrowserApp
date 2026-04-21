import { describe, expect, test } from "vitest"

import { formatMd4Digest, hashMd4 } from "./md4"

describe("hashMd4", () => {
  test("hashes a blob with MD4", async () => {
    const digest = await hashMd4(new Blob(["abc"]))

    expect(digest).toEqual({
      hex: "a448017aaf21d8525fc10ae87aa6729d",
      base64: "pEgBeq8h2FJfwQroeqZynQ==",
      decimal: "218367266684986933958873955756159693469",
      binary:
        "1010010001001000000000010111101010101111001000011101100001010010" +
        "0101111111000001000010101110100001111010101001100111001010011101",
    })
  })
})

describe("formatMd4Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatMd4Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})

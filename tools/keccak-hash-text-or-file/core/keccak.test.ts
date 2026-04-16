import { describe, expect, test } from "vitest"

import {
  INVALID_KECCAK_OUTPUT_LENGTH_ERROR,
  formatKeccakDigest,
  hashKeccak,
} from "./keccak"

const HELLO_KECCAK_HEX = {
  224: "45524ec454bcc7d4b8f74350c4a4e62809fcb49bc29df62e61b69fa4",
  256: "1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8",
  384: "dcef6fb7908fd52ba26aaba75121526abbf1217f1c0a31024652d134d3e32fb4cd8e9c703b8f43e7277b59a5cd402175",
  512: "52fa80662e64c128f8389c9ea6c73d4c02368004bf4463491900d11aaadca39d47de1b01361f207c512cfa79f0f92c3395c67ff7928e3f5ce3e3c852b392f976",
} as const

describe("hashKeccak", () => {
  test("hashes a blob with Keccak-256 by default", async () => {
    const digest = await hashKeccak(new Blob(["hello"]))

    expect(digest.hex).toBe(HELLO_KECCAK_HEX[256])
    expect(digest.base64).toBe(
      Buffer.from(HELLO_KECCAK_HEX[256], "hex").toString("base64")
    )
  })

  test.each([
    [224, HELLO_KECCAK_HEX[224]],
    [384, HELLO_KECCAK_HEX[384]],
    [512, HELLO_KECCAK_HEX[512]],
  ] as const)(
    "hashes a blob with Keccak-%i",
    async (outputLength, expectedHex) => {
      const digest = await hashKeccak(new Blob(["hello"]), { outputLength })

      expect(digest.hex).toBe(expectedHex)
    }
  )

  test("hashes binary file data", async () => {
    const input = Uint8Array.from([0, 255, 1, 128, 64])
    const digest = await hashKeccak(new Blob([input]))

    expect(digest.hex).toBe(
      "268c2dbebe4e0ed9d9ef3c2e23198fba3a30767167022c598717d3917f997087"
    )
  })

  test("rejects unsupported output lengths", async () => {
    await expect(
      hashKeccak(new Blob(["hello"]), {
        outputLength: 128 as never,
      })
    ).rejects.toThrow(INVALID_KECCAK_OUTPUT_LENGTH_ERROR)
  })
})

describe("formatKeccakDigest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatKeccakDigest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})

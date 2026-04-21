import { describe, expect, test } from "vitest"

import { formatRipemd256Digest, hashRipemd256 } from "./ripemd256"

describe("hashRipemd256", () => {
  test("hashes a known RIPEMD-256 vector", async () => {
    const digest = await hashRipemd256(new Blob(["abc"]))

    expect(digest.hex).toBe(
      "afbd6e228b9d8cbbcef5ca2d03e6dba10ac0bc7dcbe4680e1e42d2e975459b65"
    )
    expect(digest.base64).toBe("r71uIoudjLvO9cotA+bboQrAvH3L5GgOHkLS6XVFm2U=")
  })

  test("hashes binary file data", async () => {
    const input = Uint8Array.from([0, 255, 1, 128, 64])
    const digest = await hashRipemd256(new Blob([input]))

    expect(digest.hex).toBe(
      "960218501bf041fa6f1713112f1223b6bec3ee01bc78def1939cf33cbe1bb47e"
    )
  })

  test("hashes a message that uses the long finalize padding path", async () => {
    const digest = await hashRipemd256(new Blob(["a".repeat(56)]))

    expect(digest.hex).toBe(
      "d210e3e343f73334320d4b8f28fc8079ca06f30f0ba6f7baa8928a707ac45593"
    )
  })
})

describe("formatRipemd256Digest", () => {
  test("formats a digest into every supported representation", () => {
    const digest = Uint8Array.from([0, 1, 2, 255]).buffer

    expect(formatRipemd256Digest(digest)).toEqual({
      hex: "000102ff",
      base64: "AAEC/w==",
      decimal: "66303",
      binary: "00000000000000010000001011111111",
    })
  })
})

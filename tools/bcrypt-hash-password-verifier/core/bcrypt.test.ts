import { describe, expect, it } from "vitest"

import { parseBcryptHash, verifyBcryptPassword } from "./bcrypt"

const PASSWORD = "correct horse battery staple"
const HASH = "$2b$10$9goojv/JvRhQvBIMI6yJNu9mziiWggh4.5/rpJAIhx66y28hq4Ybe"

describe("parseBcryptHash", () => {
  it("extracts version and cost from a bcrypt hash", () => {
    expect(parseBcryptHash(HASH)).toEqual({
      ok: true,
      details: {
        version: "2b",
        cost: 10,
        hash: HASH,
      },
    })
  })

  it("trims pasted hashes", () => {
    expect(parseBcryptHash(`\n${HASH}\n`)).toEqual({
      ok: true,
      details: {
        version: "2b",
        cost: 10,
        hash: HASH,
      },
    })
  })

  it("accepts bcrypt prefixes supported by the verifier runtime", () => {
    const hashBody = HASH.slice(3)

    expect(parseBcryptHash(`$2a${hashBody}`)).toMatchObject({
      ok: true,
      details: { version: "2a" },
    })
    expect(parseBcryptHash(`$2y${hashBody}`)).toMatchObject({
      ok: true,
      details: { version: "2y" },
    })
  })

  it("rejects empty and malformed hashes", () => {
    expect(parseBcryptHash("")).toEqual({ ok: false, code: "empty" })
    expect(parseBcryptHash("$2b$03$short")).toEqual({
      ok: false,
      code: "invalid-format",
    })
    expect(
      parseBcryptHash(
        "$2z$10$9goojv/JvRhQvBIMI6yJNu9mziiWggh4.5/rpJAIhx66y28hq4Ybe"
      )
    ).toEqual({
      ok: false,
      code: "invalid-format",
    })
    expect(
      parseBcryptHash(
        "$2x$10$9goojv/JvRhQvBIMI6yJNu9mziiWggh4.5/rpJAIhx66y28hq4Ybe"
      )
    ).toEqual({
      ok: false,
      code: "invalid-format",
    })
  })
})

describe("verifyBcryptPassword", () => {
  it("returns match for the correct password", async () => {
    await expect(verifyBcryptPassword(PASSWORD, HASH)).resolves.toMatchObject({
      status: "match",
      details: {
        version: "2b",
        cost: 10,
      },
    })
  })

  it("returns mismatch for the wrong password", async () => {
    await expect(
      verifyBcryptPassword("wrong password", HASH)
    ).resolves.toMatchObject({
      status: "mismatch",
      details: {
        version: "2b",
        cost: 10,
      },
    })
  })

  it("reports invalid hash input before comparing", async () => {
    await expect(verifyBcryptPassword(PASSWORD, "not bcrypt")).resolves.toEqual(
      {
        status: "invalid-hash",
        code: "invalid-format",
      }
    )
  })

  it("maps comparison runtime errors to invalid hash results", async () => {
    await expect(
      verifyBcryptPassword(PASSWORD, HASH, async () => {
        throw new Error("comparison failed")
      })
    ).resolves.toEqual({
      status: "invalid-hash",
      code: "invalid-format",
    })
  })
})

type BcryptVersion = "2a" | "2b" | "2y"

type BcryptHashDetails = Readonly<{
  version: BcryptVersion
  cost: number
  hash: string
}>

type ParseBcryptHashResult =
  | Readonly<{ ok: true; details: BcryptHashDetails }>
  | Readonly<{ ok: false; code: "empty" | "invalid-format" }>

type VerifyBcryptPasswordResult =
  | Readonly<{ status: "match"; details: BcryptHashDetails }>
  | Readonly<{ status: "mismatch"; details: BcryptHashDetails }>
  | Readonly<{ status: "invalid-hash"; code: "empty" | "invalid-format" }>

type BcryptCompare = (password: string, hash: string) => Promise<boolean>

const BCRYPT_HASH_PATTERN =
  /^\$(2[aby])\$(0[4-9]|[12]\d|3[01])\$([./A-Za-z0-9]{53})$/

function parseBcryptHash(hash: string): ParseBcryptHashResult {
  const normalizedHash = hash.trim()

  if (normalizedHash.length === 0) {
    return { ok: false, code: "empty" }
  }

  const match = BCRYPT_HASH_PATTERN.exec(normalizedHash)

  if (!match?.[1] || !match[2]) {
    return { ok: false, code: "invalid-format" }
  }

  return {
    ok: true,
    details: {
      version: match[1] as BcryptVersion,
      cost: Number.parseInt(match[2], 10),
      hash: normalizedHash,
    },
  }
}

async function verifyBcryptPassword(
  password: string,
  hash: string,
  compareBcrypt?: BcryptCompare
): Promise<VerifyBcryptPasswordResult> {
  const parsedHash = parseBcryptHash(hash)

  if (!parsedHash.ok) {
    return { status: "invalid-hash", code: parsedHash.code }
  }

  try {
    const compare = compareBcrypt ?? (await loadBcryptCompare())
    const matches = await compare(password, parsedHash.details.hash)

    return {
      status: matches ? "match" : "mismatch",
      details: parsedHash.details,
    }
  } catch {
    return { status: "invalid-hash", code: "invalid-format" }
  }
}

async function loadBcryptCompare(): Promise<BcryptCompare> {
  const { compare } = await import("bcrypt-ts")

  return compare
}

export { parseBcryptHash, verifyBcryptPassword, type BcryptHashDetails }

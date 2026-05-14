import { hash } from "bcrypt-ts"

import { DEFAULT_COST, MAX_COST, MIN_COST } from "./constants"

type BcryptParts = Readonly<{
  version: string
  cost: number
  salt: string
  checksum: string
}>

type BcryptHashResult = Readonly<{
  hash: string
  parts: BcryptParts
}>

type CostValidation = Readonly<{
  value: number
  isValid: boolean
}>

type BcryptHashFunction = (
  password: string,
  cost: number
) => string | Promise<string>

const BCRYPT_HASH_PATTERN =
  /^\$(2[abxy])\$(\d{2})\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/

function parseCostInput(
  value: string,
  fallback = DEFAULT_COST
): CostValidation {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return { value: fallback, isValid: false }
  }

  if (!/^\d+$/.test(trimmed)) {
    return { value: fallback, isValid: false }
  }

  const parsed = Number.parseInt(trimmed, 10)

  if (!Number.isSafeInteger(parsed) || parsed < MIN_COST || parsed > MAX_COST) {
    return { value: fallback, isValid: false }
  }

  return { value: parsed, isValid: true }
}

function parseBcryptHash(value: string): BcryptParts | null {
  const match = BCRYPT_HASH_PATTERN.exec(value)

  if (!match) {
    return null
  }

  return {
    version: match[1]!,
    cost: Number.parseInt(match[2]!, 10),
    salt: match[3]!,
    checksum: match[4]!,
  }
}

async function generateBcryptHash(
  password: string,
  cost: number,
  hashFunction: BcryptHashFunction = hash
): Promise<BcryptHashResult> {
  if (password.length === 0) {
    throw new Error("Enter a password before generating a bcrypt hash.")
  }

  if (!Number.isSafeInteger(cost) || cost < MIN_COST || cost > MAX_COST) {
    throw new Error(`Cost must be between ${MIN_COST} and ${MAX_COST}.`)
  }

  const nextHash = await hashFunction(password, cost)
  const parts = parseBcryptHash(nextHash)

  if (!parts) {
    throw new Error("The generated value is not a valid bcrypt hash.")
  }

  return {
    hash: nextHash,
    parts,
  }
}

export { generateBcryptHash, parseBcryptHash, parseCostInput }
export type { BcryptHashResult }

import { HOTP, Secret, TOTP, URI } from "otpauth"
import { z } from "zod"

const algorithms = ["SHA1", "SHA256", "SHA512"] as const

const settings = {
  label: z.string(),
  issuer: z.string(),
  secret: z.string(),
  algorithm: z.enum(algorithms),
  digits: z.number().int().min(1).max(10),
}

const setupSchema = z.discriminatedUnion("type", [
  z.object({
    ...settings,
    type: z.literal("totp"),
    period: z.number().int().min(1),
  }),
  z.object({
    ...settings,
    type: z.literal("hotp"),
    counter: z.number().int().min(0),
  }),
])

type Setup = z.infer<typeof setupSchema>
type Account = Setup & { id: string }

function readSetup(value: unknown): Setup {
  const setup = setupSchema.parse(value)
  const key = setup.secret.replace(/\s/g, "").replace(/=+$/, "").toUpperCase()

  if (!/^[A-Z2-7]+$/.test(key) || Secret.fromBase32(key).base32 !== key) {
    throw new Error("Invalid Base32 setup key")
  }

  return { ...setup, secret: key }
}

function parseSetupLink(link: string): Setup {
  const uri = link.trim()
  const otp = URI.parse(uri)
  const { label, issuer, algorithm, digits } = otp
  // Use the supplied key so a non-canonical Base32 suffix cannot be discarded.
  const secret = [...new URL(uri).searchParams]
    .reverse()
    .find(([name]) => name.toLowerCase() === "secret")?.[1]
  const settings = { label, issuer, secret, algorithm, digits }

  return otp instanceof HOTP
    ? readSetup({ ...settings, type: "hotp", counter: otp.counter })
    : readSetup({ ...settings, type: "totp", period: otp.period })
}

function setupLink(account: Setup) {
  const settings = {
    ...account,
    label: account.label || account.issuer || "OTP",
    secret: Secret.fromBase32(account.secret),
  }
  return (
    account.type === "hotp" ? new HOTP(settings) : new TOTP(settings)
  ).toString()
}

function getCode(account: Setup, counter: number) {
  return HOTP.generate({
    ...account,
    secret: Secret.fromBase32(account.secret),
    counter,
  })
}

function mergeAccounts(
  accounts: readonly Account[],
  incoming: readonly Setup[]
) {
  const next = [...accounts]
  for (const setup of incoming) {
    const exists = next.some(
      (account) =>
        account.secret === setup.secret &&
        account.label === setup.label &&
        account.issuer === setup.issuer &&
        account.type === setup.type &&
        account.algorithm === setup.algorithm &&
        account.digits === setup.digits &&
        (account.type === "hotp" ||
          (setup.type === "totp" && account.period === setup.period))
    )
    if (!exists) {
      next.push({ ...setup, id: crypto.randomUUID() })
    }
  }

  return next.length === accounts.length ? accounts : next
}

export {
  algorithms,
  getCode,
  mergeAccounts,
  parseSetupLink,
  readSetup,
  setupLink,
}
export type { Account, Setup }

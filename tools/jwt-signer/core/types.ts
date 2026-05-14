const JWT_ALGORITHMS = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES384",
  "ES512",
] as const

type JwtAlgorithm = (typeof JWT_ALGORITHMS)[number]
type JwtKeyFormat = "secret" | "pem" | "jwk"
type JwtSignerCrypto = Pick<SubtleCrypto, "importKey" | "sign">

type SignJwtOptions = Readonly<{
  payloadText: string
  headerText?: string
  algorithm: JwtAlgorithm
  key: string
  keyFormat: JwtKeyFormat
  subtle?: JwtSignerCrypto
}>

type SignJwtResult = Readonly<{
  token: string
  headerJson: string
  payloadJson: string
  signingInput: string
  signature: string
  algorithm: JwtAlgorithm
}>

export { JWT_ALGORITHMS }
export type {
  JwtAlgorithm,
  JwtKeyFormat,
  JwtSignerCrypto,
  SignJwtOptions,
  SignJwtResult,
}

const RSA_KEY_SIZES = [2048, 3072, 4096] as const
const RSA_HASH_ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"] as const
const EC_CURVES = ["P-256", "P-384", "P-521"] as const

const EC_CURVE_HASH = {
  "P-256": "SHA-256",
  "P-384": "SHA-384",
  "P-521": "SHA-512",
} as const satisfies Readonly<Record<EcCurve, HashAlgorithm>>

type KeySource = "generate" | "import"
type KeyAlgorithm = "rsa" | "ecdsa"
type RsaKeySize = (typeof RSA_KEY_SIZES)[number]
type HashAlgorithm = (typeof RSA_HASH_ALGORITHMS)[number]
type EcCurve = (typeof EC_CURVES)[number]

type SubjectInput = Readonly<{
  commonName: string
  organization: string
  organizationalUnit: string
  country: string
  state: string
  locality: string
  emailAddress: string
}>

type SanInput = Readonly<{
  dns: readonly string[]
  ip: readonly string[]
  email: readonly string[]
  uri: readonly string[]
}>

type CsrCreateInput = Readonly<{
  keySource: KeySource
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  rsaHash: HashAlgorithm
  ecCurve: EcCurve
  keyPem: string
  subject: SubjectInput
  san: SanInput
}>

type CsrOutput = Readonly<{
  csrPem: string
  privateKeyPem?: string
  keyAlgorithmLabel: string
}>

type ImportedKeyAlgorithm =
  | Readonly<{ type: "rsa" }>
  | Readonly<{ type: "ecdsa"; curve: EcCurve }>

type ParsedPemKey = Readonly<{
  pkcs8: ArrayBuffer
  algorithm: ImportedKeyAlgorithm
}>

type GeneratedKeyResult = Readonly<{
  keys: CryptoKeyPair
  signingAlgorithm: Algorithm | EcdsaParams
  keyAlgorithmLabel: string
}>

type ImportedKeyResult = Readonly<{
  keys: CryptoKeyPair
  signingAlgorithm: Algorithm | EcdsaParams
  keyAlgorithmLabel: string
}>

export { EC_CURVE_HASH, EC_CURVES, RSA_HASH_ALGORITHMS, RSA_KEY_SIZES }
export type {
  CsrCreateInput,
  CsrOutput,
  EcCurve,
  GeneratedKeyResult,
  HashAlgorithm,
  ImportedKeyAlgorithm,
  ImportedKeyResult,
  KeyAlgorithm,
  KeySource,
  ParsedPemKey,
  RsaKeySize,
  SanInput,
  SubjectInput,
}

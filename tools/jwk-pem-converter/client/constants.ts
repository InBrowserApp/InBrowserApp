import type { ConversionMode } from "./types"

const DEFAULT_MODE = "jwk" satisfies ConversionMode
const DEFAULT_JWK_INPUT = `{
  "crv": "Ed25519",
  "d": "IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4",
  "x": "cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE",
  "kty": "OKP"
}`
const DEFAULT_PEM_INPUT = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`
const JWK_FILE_ACCEPT = ".json,.jwk,.txt,application/json,text/plain"
const PEM_FILE_ACCEPT = ".pem,.key,.pub,.txt,application/x-pem-file,text/plain"
const STORAGE_KEYS = {
  mode: "tools:jwk-pem-converter:tab",
  jwkInput: "tools:jwk-pem-converter:jwk-input",
  pemInput: "tools:jwk-pem-converter:pem-input",
  outputType: "tools:jwk-pem-converter:output-type",
  prettyJson: "tools:jwk-pem-converter:pretty-json",
} as const

export {
  DEFAULT_JWK_INPUT,
  DEFAULT_MODE,
  DEFAULT_PEM_INPUT,
  JWK_FILE_ACCEPT,
  PEM_FILE_ACCEPT,
  STORAGE_KEYS,
}

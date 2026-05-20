const STORAGE_KEYS = {
  keySource: "tools:csr-generator:key-source",
  algorithm: "tools:csr-generator:algorithm",
  rsaKeySize: "tools:csr-generator:rsa-key-size",
  rsaHash: "tools:csr-generator:rsa-hash",
  ecCurve: "tools:csr-generator:ec-curve",
  subject: "tools:csr-generator:subject",
  sanDns: "tools:csr-generator:san-dns",
  sanIp: "tools:csr-generator:san-ip",
  sanEmail: "tools:csr-generator:san-email",
  sanUri: "tools:csr-generator:san-uri",
} as const

const DEFAULT_SUBJECT = {
  commonName: "example.com",
  organization: "",
  organizationalUnit: "",
  country: "",
  state: "",
  locality: "",
  emailAddress: "",
} as const

export { DEFAULT_SUBJECT, STORAGE_KEYS }

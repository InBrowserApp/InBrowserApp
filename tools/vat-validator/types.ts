export type VatMessagesCatalog = Readonly<{
  vat: string
  placeholder: string
  valid: string
  invalid: string
  invalidCountryCode: string
  unsupportedCountry: string
  invalidFormat: string
  invalidChecksum: string
  result: string
  status: string
  country: string
  countryStatus: string
  format: string
  formatStatus: string
  checksum: string
  normalized: string
  number: string
  pass: string
  fail: string
  notChecked: string
  notAvailable: string
  supported: string
  unsupported: string
  unknown: string
  copyLabel: string
  copiedLabel: string
}>

export type VatMessages = VatMessagesCatalog &
  Readonly<{
    meta: { name: string; description: string }
    locale: string
  }>

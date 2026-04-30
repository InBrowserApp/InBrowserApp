type CidrParserMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputTitle: string
  inputDescription: string
  inputLabel: string
  inputPlaceholder: string
  inputHint: string
  resultTitle: string
  resultDescription: string
  emptyTitle: string
  emptyDescription: string
  invalidTitle: string
  invalidDescription: string
  overviewTitle: string
  overviewDescription: string
  rangeTitle: string
  rangeDescription: string
  routingTitle: string
  routingDescription: string
  familyLabel: string
  prefixLabel: string
  hostBitsLabel: string
  totalAddressesLabel: string
  usableAddressesLabel: string
  canonicalLabel: string
  originalAddressLabel: string
  networkAddressLabel: string
  rangeStartLabel: string
  rangeEndLabel: string
  firstUsableLabel: string
  lastUsableLabel: string
  broadcastAddressLabel: string
  netmaskLabel: string
  wildcardMaskLabel: string
  startIntegerLabel: string
  endIntegerLabel: string
  ipv4Label: string
  ipv6Label: string
  notApplicableLabel: string
  copyLabel: string
  copiedLabel: string
}>

type CidrParserClientProps = Readonly<{
  language: string
  messages: CidrParserMessages
}>

type DetailItem = Readonly<{
  label: string
  value: string
  copyValue?: string | null
}>

export type { CidrParserClientProps, CidrParserMessages, DetailItem }

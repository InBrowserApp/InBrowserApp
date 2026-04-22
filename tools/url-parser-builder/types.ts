type UrlQueryEntry = Readonly<{
  key: string
  value: string
}>

type UrlBuilderDraft = Readonly<{
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  fragment: string
  queryEntries: readonly UrlQueryEntry[]
}>

type UrlParseResult =
  | Readonly<{
      ok: true
      draft: UrlBuilderDraft
    }>
  | Readonly<{
      ok: false
      error: "invalid-url"
    }>

type UrlBuildError =
  | "missing-protocol"
  | "missing-hostname"
  | "invalid-port"
  | "invalid-url"

type UrlBuildResult =
  | Readonly<{
      ok: true
      url: string
    }>
  | Readonly<{
      ok: false
      error: UrlBuildError
    }>

type UrlQueryRow = Readonly<{
  id: string
  key: string
  value: string
}>

type UrlParserBuilderLocalizedCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  urlLabel: string
  urlPlaceholder: string
  validBadge: string
  invalidBadge: string
  parseErrorTitle: string
  parseErrorDescription: string
  originLabel: string
  hostLabel: string
  segmentsLabel: string
  paramsLabel: string
  authorityTitle: string
  authorityDescription: string
  protocolLabel: string
  protocolPlaceholder: string
  usernameLabel: string
  usernamePlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  hostnameLabel: string
  hostnamePlaceholder: string
  portLabel: string
  portPlaceholder: string
  locationTitle: string
  locationDescription: string
  pathLabel: string
  pathPlaceholder: string
  fragmentLabel: string
  fragmentPlaceholder: string
  queryTitle: string
  queryDescription: string
  queryEmptyTitle: string
  queryEmptyDescription: string
  addParamLabel: string
  paramKeyLabel: string
  paramKeyPlaceholder: string
  paramValueLabel: string
  paramValuePlaceholder: string
  removeParamLabel: string
  previewTitle: string
  previewDescription: string
  finalUrlLabel: string
  buildErrorTitle: string
  missingProtocolDescription: string
  missingHostnameDescription: string
  invalidPortDescription: string
  invalidBuildDescription: string
  copyUrlLabel: string
  copiedLabel: string
  loadSampleLabel: string
  resetLabel: string
}>

type UrlParserBuilderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  UrlParserBuilderLocalizedCatalog

export type {
  UrlBuildError,
  UrlBuildResult,
  UrlBuilderDraft,
  UrlParseResult,
  UrlParserBuilderLocalizedCatalog,
  UrlParserBuilderMessages,
  UrlQueryEntry,
  UrlQueryRow,
}

import type { UrlDraft } from "./core/url"

type UrlQueryRow = Readonly<{
  id: string
  key: string
  value: string
}>

type EditableUrlDraft = Omit<UrlDraft, "queryParams"> & {
  queryParams: readonly UrlQueryRow[]
}

type UrlParserBuilderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  rawUrlLabel: string
  rawUrlDescription: string
  rawUrlPlaceholder: string
  presetApiLabel: string
  presetAuthLabel: string
  presetCampaignLabel: string
  copyUrlLabel: string
  copiedLabel: string
  resetLabel: string
  invalidUrlTitle: string
  invalidUrlEmptyDescription: string
  invalidUrlRelativeDescription: string
  invalidUrlMalformedDescription: string
  builderErrorTitle: string
  missingProtocolError: string
  invalidProtocolError: string
  missingHostnameError: string
  invalidPortError: string
  authorityCardLabel: string
  routeCardLabel: string
  queryCardLabel: string
  diagnosticsLabel: string
  protocolLabel: string
  usernameLabel: string
  passwordLabel: string
  hostnameLabel: string
  portLabel: string
  pathLabel: string
  hashLabel: string
  queryKeyLabel: string
  queryValueLabel: string
  addQueryParameterLabel: string
  removeQueryParameterLabel: string
  emptyQueryState: string
  originLabel: string
  authorityLabel: string
  pathSegmentsLabel: string
  queryCountLabel: string
  noneLabel: string
}>

export type { EditableUrlDraft, UrlParserBuilderMessages, UrlQueryRow }

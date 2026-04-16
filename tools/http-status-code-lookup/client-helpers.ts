import {
  statusCodes,
  type HttpStatusCodeCategory,
  type HttpStatusCodeInfo,
} from "./data/status-codes"
import {
  filterStatusCodes,
  type HttpStatusCodeFilter,
} from "./core/http-status-code-lookup"

export type HttpStatusCodeLookupLocaleMessages = Readonly<{
  searchPlaceholder: string
  all: string
  common: string
  informationalFilter: string
  successFilter: string
  redirectionFilter: string
  clientErrorFilter: string
  serverErrorFilter: string
  code: string
  name: string
  category: string
  description: string
  informational: string
  success: string
  redirection: string
  clientError: string
  serverError: string
  noResultsTitle: string
  noResultsDescription: string
}>

export type HttpStatusCodeLookupMessages = HttpStatusCodeLookupLocaleMessages &
  Readonly<{
    meta: {
      name: string
      description: string
    }
  }>

export type HttpStatusCodeDescriptions = Readonly<Record<string, string>>

export const CATEGORY_FILTERS = [
  "all",
  "common",
  "informational",
  "success",
  "redirection",
  "client-error",
  "server-error",
] as const satisfies readonly HttpStatusCodeFilter[]

export function getFilterLabel(
  filter: HttpStatusCodeFilter,
  messages: HttpStatusCodeLookupMessages
) {
  if (filter === "common") return messages.common
  if (filter === "informational") return messages.informationalFilter
  if (filter === "success") return messages.successFilter
  if (filter === "redirection") return messages.redirectionFilter
  if (filter === "client-error") return messages.clientErrorFilter
  if (filter === "server-error") return messages.serverErrorFilter
  return messages.all
}

export function getCategoryLabel(
  category: HttpStatusCodeCategory,
  messages: HttpStatusCodeLookupMessages
) {
  if (category === "informational") return messages.informational
  if (category === "success") return messages.success
  if (category === "redirection") return messages.redirection
  if (category === "client-error") return messages.clientError
  return messages.serverError
}

export function getCategoryVariant(category: HttpStatusCodeCategory) {
  if (category === "success") return "default"
  if (category === "redirection") return "secondary"
  if (category === "client-error" || category === "server-error") {
    return "destructive"
  }

  return "outline"
}

export function getVisibleRows(
  descriptions: HttpStatusCodeDescriptions,
  query: string,
  filter: HttpStatusCodeFilter
): readonly HttpStatusCodeInfo[] {
  return filterStatusCodes(getLocalizedRows(descriptions), query, filter)
}

export function formatCount(value: number, language: string) {
  return new Intl.NumberFormat(language).format(value)
}

function getLocalizedRows(
  descriptions: HttpStatusCodeDescriptions
): readonly HttpStatusCodeInfo[] {
  return statusCodes.map((statusCode) => ({
    ...statusCode,
    description:
      descriptions[String(statusCode.code)] ?? statusCode.description,
  }))
}

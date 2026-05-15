import { CHECKSUM_HASH_TOOLS } from "./catalog/checksum"
import { CRYPTOGRAPHIC_HASH_TOOLS } from "./catalog/cryptographic"
import { HASH_TOOL_GROUPS } from "./catalog/groups"
import { KEYED_HASH_TOOLS } from "./catalog/keyed"
import { PASSWORD_HASH_TOOLS } from "./catalog/password"

import type {
  HashTool,
  HashToolFilter,
  HashToolGroupId,
  HashToolSearchOptions,
} from "./types"

const HASH_TOOLS = [
  ...CRYPTOGRAPHIC_HASH_TOOLS,
  ...PASSWORD_HASH_TOOLS,
  ...KEYED_HASH_TOOLS,
  ...CHECKSUM_HASH_TOOLS,
] as const satisfies readonly HashTool[]

function normalizeSearchQuery(query: string) {
  return query.trim().toLocaleLowerCase()
}

function isHashToolGroupFilter(value: string): value is HashToolFilter {
  return value === "all" || HASH_TOOL_GROUPS.some((group) => group.id === value)
}

function filterHashTools(
  tools: readonly HashTool[],
  { query, group }: HashToolSearchOptions
) {
  const normalizedQuery = normalizeSearchQuery(query)
  const terms = normalizedQuery.split(/\s+/).filter(Boolean)

  return tools.filter((tool) => {
    const inGroup = group === "all" || tool.group === group

    if (!inGroup) {
      return false
    }

    if (terms.length === 0) {
      return true
    }

    const searchableText = [
      tool.label,
      tool.slug,
      tool.group,
      tool.kind,
      ...tool.tags,
    ]
      .join(" ")
      .toLocaleLowerCase()

    return terms.every((term) => searchableText.includes(term))
  })
}

function groupHashTools(tools: readonly HashTool[]) {
  return HASH_TOOL_GROUPS.map((group) => ({
    group: group.id,
    tools: tools.filter((tool) => tool.group === group.id),
  })).filter((entry) => entry.tools.length > 0)
}

function countHashToolsByGroup(tools: readonly HashTool[]) {
  return HASH_TOOL_GROUPS.reduce(
    (counts, group) => ({
      ...counts,
      [group.id]: tools.filter((tool) => tool.group === group.id).length,
    }),
    {} as Record<HashToolGroupId, number>
  )
}

function getHashToolHref(slug: string, lang: string) {
  const path = `/tools/${slug}`
  return lang === "en" ? path : `/${lang}${path}`
}

export {
  HASH_TOOL_GROUPS,
  HASH_TOOLS,
  countHashToolsByGroup,
  filterHashTools,
  getHashToolHref,
  groupHashTools,
  isHashToolGroupFilter,
  normalizeSearchQuery,
}
export type {
  HashTool,
  HashToolFilter,
  HashToolGroupId,
  HashToolKindId,
} from "./types"

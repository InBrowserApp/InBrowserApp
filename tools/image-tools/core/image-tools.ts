type ImageToolGroup = "convert" | "create" | "inspect" | "optimize" | "scan"
type ImageToolGroupFilter = ImageToolGroup | "all"

type ImageToolSummary = Readonly<{
  slug: string
  tags: readonly string[]
  meta: Readonly<{
    name: string
    description: string
  }>
}>

const IMAGE_TOOL_GROUPS = [
  "convert",
  "optimize",
  "inspect",
  "create",
  "scan",
] as const satisfies readonly ImageToolGroup[]

function normalizeImageToolQuery(query: string) {
  return query.trim().replace(/\s+/g, " ").toLowerCase()
}

function hasAnyToken(tags: ReadonlySet<string>, tokens: readonly string[]) {
  return tokens.some((token) => tags.has(token))
}

function resolveImageToolGroups(tool: ImageToolSummary) {
  const tags = new Set(tool.tags.map((tag) => tag.toLowerCase()))
  const slug = tool.slug.toLowerCase()
  const groups: ImageToolGroup[] = []

  if (
    slug.includes("to-") ||
    slug.includes("converter") ||
    hasAnyToken(tags, ["avif", "webp", "ico", "svg"])
  ) {
    groups.push("convert")
  }

  if (
    slug.includes("optimizer") ||
    slug.includes("resizer") ||
    slug.includes("metadata-cleaner") ||
    hasAnyToken(tags, ["compress", "compression", "resize", "lossless"])
  ) {
    groups.push("optimize")
  }

  if (
    slug.includes("exif") ||
    slug.includes("palette") ||
    hasAnyToken(tags, ["metadata", "color", "palette", "privacy"])
  ) {
    groups.push("inspect")
  }

  if (
    slug.includes("generator") ||
    slug.includes("placeholder") ||
    hasAnyToken(tags, ["generate", "generator", "placeholder"])
  ) {
    groups.push("create")
  }

  if (
    slug.includes("reader") ||
    hasAnyToken(tags, ["read", "reader", "scan", "scanner"])
  ) {
    groups.push("scan")
  }

  return groups.length > 0 ? groups : (["inspect"] satisfies ImageToolGroup[])
}

function imageToolMatchesQuery(tool: ImageToolSummary, query: string) {
  const normalizedQuery = normalizeImageToolQuery(query)

  if (!normalizedQuery) {
    return true
  }

  const searchableText = [
    tool.slug,
    tool.meta.name,
    tool.meta.description,
    ...tool.tags,
  ]
    .join(" ")
    .toLowerCase()

  return normalizedQuery
    .split(" ")
    .every((token) => searchableText.includes(token))
}

function filterImageTools<TTool extends ImageToolSummary>(
  tools: readonly TTool[],
  options: Readonly<{
    group: ImageToolGroupFilter
    query: string
  }>
) {
  return tools.filter((tool) => {
    const groups = resolveImageToolGroups(tool)
    const matchesGroup =
      options.group === "all" || groups.includes(options.group)

    return matchesGroup && imageToolMatchesQuery(tool, options.query)
  })
}

function countImageToolsByGroup(tools: readonly ImageToolSummary[]) {
  return Object.fromEntries(
    IMAGE_TOOL_GROUPS.map((group) => [
      group,
      tools.filter((tool) => resolveImageToolGroups(tool).includes(group))
        .length,
    ])
  ) as Record<ImageToolGroup, number>
}

export {
  IMAGE_TOOL_GROUPS,
  countImageToolsByGroup,
  filterImageTools,
  imageToolMatchesQuery,
  normalizeImageToolQuery,
  resolveImageToolGroups,
}
export type { ImageToolGroup, ImageToolGroupFilter, ImageToolSummary }

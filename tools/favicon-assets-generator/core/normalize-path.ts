function normalizeAssetPath(rawPath: string): string {
  const trimmed = rawPath.trim()

  if (trimmed === "" || trimmed === "/") {
    return "/"
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/")

  return collapsed.endsWith("/") ? collapsed : `${collapsed}/`
}

function normalizeStartUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim()

  if (trimmed === "") {
    return "/"
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/{2,}/g, "/")
}

export { normalizeAssetPath, normalizeStartUrl }

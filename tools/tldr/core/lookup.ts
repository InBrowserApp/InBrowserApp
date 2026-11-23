export type Command = readonly [
  name: string,
  platforms: Readonly<Record<string, readonly string[]>>,
]

export type Catalog = Readonly<{
  revision: string
  commands: readonly Command[]
}>

export type Lookup = Readonly<{ q: string; os: string; lang: string }>
export type Variant = Readonly<{ q: string; os: string; locale: string }>

export function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, "-")
}

export function search(commands: readonly Command[], query: string) {
  if (!query) return []

  const exact: Command[] = []
  const prefix: Command[] = []
  const contains: Command[] = []
  for (const command of commands) {
    const [name] = command
    if (name === query) exact.push(command)
    else if (name.startsWith(query)) prefix.push(command)
    else if (name.includes(query)) contains.push(command)
  }
  return exact.concat(prefix, contains).slice(0, 12)
}

export function publicLanguage(locale: string) {
  return locale === "zh" ? "zh-CN" : locale.replace("_", "-")
}

export function publicPlatform(os: string) {
  return os === "osx" ? "macos" : os
}

function preferredLocale(language: string) {
  const locale = language.toLowerCase()
  return locale === "pt" ? "pt-br" : locale
}

export function selectVariant(
  [q, platforms]: Command,
  os: string,
  language: string
): Variant | undefined {
  const keys = Object.keys(platforms)
  const preferred = preferredLocale(language)
  const candidates = [os === "macos" ? "osx" : os, "common"]

  if (!os && keys.length === 1) candidates.push(keys[0]!)
  for (const platform of new Set(candidates)) {
    if (!Object.hasOwn(platforms, platform)) continue
    const locales = platforms[platform]!
    const locale =
      locales.find(
        (item) => publicLanguage(item).toLowerCase() === preferred
      ) ?? locales.find((item) => item === "en")
    if (locale) return { q, os: platform, locale }
  }

  const platform = candidates.find((key) => Object.hasOwn(platforms, key))
  const locale = platform && platforms[platform]?.[0]
  return platform && locale ? { q, os: platform, locale } : undefined
}

export function catalogOptions(commands: readonly Command[]) {
  const os = new Set<string>()
  const languages = new Set<string>()
  for (const [, platforms] of commands) {
    for (const [platform, locales] of Object.entries(platforms)) {
      os.add(publicPlatform(platform))
      locales.forEach((locale) => languages.add(publicLanguage(locale)))
    }
  }
  return { os: [...os].sort(), languages: [...languages].sort() }
}

export function readLookup(parameters: URLSearchParams): Lookup {
  const os = parameters.get("os")?.trim().toLowerCase() ?? ""
  const lang = parameters.get("lang")?.trim().replace("_", "-") ?? ""
  return { q: parameters.get("q") ?? "", os: publicPlatform(os), lang }
}

export function lookupHref(pathname: string, lookup: Lookup) {
  const query = new URLSearchParams()
  const q = lookup.q.trim()
  if (q) query.set("q", q)
  if (lookup.os) query.set("os", lookup.os)
  if (lookup.lang) query.set("lang", lookup.lang)
  return query.size ? `${pathname}?${query}` : pathname
}

const platformNames: Record<string, string> = {
  android: "Android",
  "cisco-ios": "Cisco IOS",
  dos: "DOS",
  freebsd: "FreeBSD",
  linux: "Linux",
  macos: "macOS",
  netbsd: "NetBSD",
  openbsd: "OpenBSD",
  osx: "macOS",
  sunos: "SunOS",
  windows: "Windows",
}

export function platformName(os: string, common: string) {
  return os === "common" ? common : (platformNames[os] ?? os)
}

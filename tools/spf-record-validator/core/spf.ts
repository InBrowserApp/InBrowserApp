type ErrorCode =
  | "version"
  | "spacing"
  | "unknown"
  | "unexpectedArgument"
  | "domain"
  | "address"
  | "prefix"
  | "invalidModifier"
  | "duplicateModifier"

type Warning = "unreachable" | "deprecatedPtr" | "overLimit"
type Issue = { code: ErrorCode; term?: string }
type Term = {
  raw: string
  kind: "mechanism" | "modifier" | "extension"
  qualifier?: string
}

const LOOKUP_MECHANISMS = new Set(["a", "mx", "ptr", "exists", "include"])
const KNOWN_MODIFIERS = new Set(["redirect", "exp"])
const QUALIFIER = /^[+~?-]/
const MODIFIER = /^([a-z][a-z0-9._-]*)=(.*)$/i
const MECHANISM = /^([a-z][a-z0-9]*)(.*)$/i
const DOMAIN_MACRO = /%(?:[%_-]|\{[slodipvh]\d*r?[.\-+,/_=]*\})/gi
const MACRO = /%(?:[%_-]|\{[slodipvhcrt]\d*r?[.\-+,/_=]*\})/gi
const MACRO_LITERALS = /^[\x21-\x24\x26-\x7e]*$/
const TOP_LABEL = /^(?:[a-z0-9]*[a-z][a-z0-9]*|[a-z0-9]+-[a-z0-9-]*[a-z0-9])$/i
const PREFIX = /^(?:0|[1-9]\d*)$/
const IPV4 = /^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/

function validMacroString(value: string, syntax: RegExp) {
  return MACRO_LITERALS.test(value.replace(syntax, ""))
}

function validDomain(value: string) {
  if (!validMacroString(value, DOMAIN_MACRO)) return false

  const macros = [...value.matchAll(DOMAIN_MACRO)]
  const lastMacro = macros.at(-1)
  if (lastMacro && lastMacro.index + lastMacro[0].length === value.length)
    return true

  const suffix = value.match(/\.([^.]+)\.?$/)?.[1]
  return suffix !== undefined && TOP_LABEL.test(suffix)
}

function validPrefix(length: string | undefined, max: number) {
  return length === undefined || (PREFIX.test(length) && Number(length) <= max)
}

function validIp(value: string, family: "ip4" | "ip6") {
  if (family === "ip4") {
    return (
      IPV4.test(value) &&
      value.split(".").every((octet) => Number(octet) <= 255)
    )
  }
  return /^[0-9a-f:.]+$/i.test(value) && URL.canParse(`http://[${value}]/`)
}

function checkAddress(
  tail: string,
  family: "ip4" | "ip6"
): ErrorCode | undefined {
  const match = /^:([^/]+)(?:\/([^/]+))?$/.exec(tail)
  if (!match) return "address"
  const [, ip, prefix] = match
  if (
    !validIp(ip!, family) ||
    !validPrefix(prefix, family === "ip4" ? 32 : 128)
  ) {
    return "address"
  }
}

function checkDnsAddress(tail: string): ErrorCode | undefined {
  const argument = /^(?:%\{[^}]*\}|[^/])*/.exec(tail)![0]
  const lengths = tail.slice(argument.length)
  if (
    argument &&
    (!argument.startsWith(":") || !validDomain(argument.slice(1)))
  ) {
    return "domain"
  }

  const prefixes = /^(?:\/(\d+))?(?:\/\/(\d+))?$/.exec(lengths)
  if (
    !prefixes ||
    !validPrefix(prefixes[1], 32) ||
    !validPrefix(prefixes[2], 128)
  ) {
    return "prefix"
  }
}

function checkMechanism(name: string, tail: string): ErrorCode | undefined {
  switch (name) {
    case "all":
      return tail ? "unexpectedArgument" : undefined
    case "include":
    case "exists":
      return tail.startsWith(":") && validDomain(tail.slice(1))
        ? undefined
        : "domain"
    case "ptr":
      return !tail || (tail.startsWith(":") && validDomain(tail.slice(1)))
        ? undefined
        : "domain"
    case "a":
    case "mx":
      return checkDnsAddress(tail)
    case "ip4":
    case "ip6":
      return checkAddress(tail, name)
    default:
      return "unknown"
  }
}

function readSpf(source: string) {
  const text = source.trim()
  const terms: Term[] = []
  const errors: Issue[] = []
  const warnings = new Set<Warning>()
  let lookupCount = 0

  function result() {
    return { terms, errors, warnings: [...warnings], lookupCount }
  }

  if (/[\t\r\n\v\f]/.test(text)) {
    errors.push({ code: "spacing" })
    return result()
  }

  const [version, ...items] = text.split(/ +/)
  if (version?.toLowerCase() !== "v=spf1") {
    errors.push({ code: "version" })
    return result()
  }

  const modifiers = new Set<string>()
  let hasAll = false
  for (const raw of items) {
    const qualified = QUALIFIER.test(raw)
    const body = qualified ? raw.slice(1) : raw
    const modifier = MODIFIER.exec(body)
    if (modifier) {
      const name = modifier[1]!.toLowerCase()
      const value = modifier[2]!
      const known = KNOWN_MODIFIERS.has(name)
      if (
        qualified ||
        !(known ? validDomain(value) : validMacroString(value, MACRO))
      ) {
        errors.push({ code: "invalidModifier", term: raw })
      } else if (known && modifiers.has(name)) {
        errors.push({ code: "duplicateModifier", term: raw })
      } else {
        if (known) modifiers.add(name)
        terms.push({ raw, kind: known ? "modifier" : "extension" })
      }
      continue
    }

    const mechanism = MECHANISM.exec(body)
    const name = mechanism?.[1]?.toLowerCase() ?? ""
    const code = checkMechanism(name, mechanism?.[2] ?? "")
    if (code) {
      errors.push({ code, term: raw })
      continue
    }

    const qualifier = qualified ? raw[0]! : "+"
    terms.push({ raw, kind: "mechanism", qualifier })
    if (hasAll) warnings.add("unreachable")
    else if (LOOKUP_MECHANISMS.has(name)) lookupCount++
    if (name === "all") hasAll = true
    if (name === "ptr") warnings.add("deprecatedPtr")
  }

  if (modifiers.has("redirect")) {
    if (hasAll) warnings.add("unreachable")
    else lookupCount++
  }
  if (lookupCount > 10) warnings.add("overLimit")
  return result()
}

export { readSpf }

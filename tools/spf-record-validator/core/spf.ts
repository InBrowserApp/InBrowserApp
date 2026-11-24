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
const MACRO = /%(?:[%_-]|\{[slodipvh](?:0*[1-9]\d*)?r?[.\-+,/_=]*\})/gi
const MACRO_PLACEHOLDER = " "
const MACRO_TEMPLATE = /^[\x20-\x24\x26-\x7e]*$/
const TOP_LABEL = /^(?:[a-z0-9]*[a-z][a-z0-9]*|[a-z0-9]+-[a-z0-9-]*[a-z0-9])$/i
const PREFIX = /^(?:0|[1-9]\d*)$/
const IPV4 = /^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/

function macroTemplate(value: string) {
  // Terms have no literal spaces, so a space represents one valid macro here.
  const template = value.replace(MACRO, MACRO_PLACEHOLDER)
  return MACRO_TEMPLATE.test(template) ? template : null
}

function validDomain(value: string) {
  const template = macroTemplate(value)
  if (template === null) return false
  const labels = template.replace(/\.$/, "").split(".")
  if (
    labels.some(
      (label) =>
        !label ||
        label.split(MACRO_PLACEHOLDER).some((literal) => literal.length > 63)
    )
  ) {
    return false
  }
  return (
    template.endsWith(MACRO_PLACEHOLDER) ||
    (labels.length > 1 && TOP_LABEL.test(labels.at(-1)!))
  )
}

function validDomainArgument(tail: string) {
  return tail.startsWith(":") && validDomain(tail.slice(1))
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
  return validIp(ip!, family) &&
    validPrefix(prefix, family === "ip4" ? 32 : 128)
    ? undefined
    : "address"
}

function checkDnsAddress(tail: string): ErrorCode | undefined {
  // Only a numeric suffix can be a CIDR length. Slashes can be domain literals.
  const prefixes = /(?:\/(\d+))?(?:\/\/(\d+))?$/.exec(tail)!
  const argument = tail.slice(0, prefixes.index)
  if (argument && !validDomainArgument(argument)) {
    return tail.startsWith("/") ? "prefix" : "domain"
  }

  return validPrefix(prefixes[1], 32) && validPrefix(prefixes[2], 128)
    ? undefined
    : "prefix"
}

function checkMechanism(name: string, tail: string): ErrorCode | undefined {
  switch (name) {
    case "all":
      return tail ? "unexpectedArgument" : undefined
    case "include":
    case "exists":
      return validDomainArgument(tail) ? undefined : "domain"
    case "ptr":
      return !tail || validDomainArgument(tail) ? undefined : "domain"
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
  const text = source.replace(/ +$/, "")
  const terms: Term[] = []
  const errors: Issue[] = []
  const warnings = new Set<Warning>()
  let lookupCount = 0

  function result() {
    return { terms, errors, warnings: [...warnings], lookupCount }
  }

  if (/[^\S ]/.test(text)) {
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
        !(known ? validDomain(value) : macroTemplate(value) !== null)
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

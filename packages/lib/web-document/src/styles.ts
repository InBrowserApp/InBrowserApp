export type ResourceNotes = { local: boolean; remote: boolean; active: boolean }

export function noteResource(value: string, notes: ResourceNotes) {
  if (/^(?:https?:)?\/\//i.test(value.trim())) notes.remote = true
  else notes.local = true
}

const resourceValue = /url\s*\(|image(?:-set)?\s*\(|\\|\/\*/i
const embeddedResource =
  /^data:(?:image\/(?:png|jpeg|gif|webp|avif|bmp)|font\/(?:woff2?|ttf|otf)|application\/(?:font-woff|vnd\.ms-fontobject|x-font-ttf));base64,[a-z\d+/=\s]+$/i

function embeddedUrls(value: string) {
  let found = false
  let safe = true
  const remainder = value.replace(
    /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/gi,
    (_match, double, single, bare) => {
      found = true
      if (!embeddedResource.test(double ?? single ?? bare)) safe = false
      return ""
    }
  )
  return found && safe && !resourceValue.test(remainder)
}

function cleanDeclaration(style: CSSStyleDeclaration, notes: ResourceNotes) {
  for (const property of Array.from(style)) {
    const value = style.getPropertyValue(property)
    if (!resourceValue.test(value)) continue
    if (embeddedUrls(value)) continue
    if (/https?:|\/\//i.test(value)) notes.remote = true
    else notes.local = true
    style.removeProperty(property)
  }
}

export function cleanStyle(value: string, notes: ResourceNotes) {
  const element = document.createElement("span")
  element.style.cssText = value
  cleanDeclaration(element.style, notes)
  return element.style.cssText
}

export function cleanStylesheet(value: string, notes: ResourceNotes) {
  // CSSOM parses escaped resource tokens before the declaration filter. Imports
  // are discarded by replaceSync; classify them before handing off to CSSOM.
  const tokens = value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(
      /\\([a-f\d]{1,6})\s?|\\([^\r\n\f])/gi,
      (_match, code, character) => {
        const point = code ? Number.parseInt(code, 16) : 0
        return (
          character ??
          String.fromCodePoint(point > 0 && point <= 0x10ffff ? point : 0xfffd)
        )
      }
    )
  if (/@import\b/i.test(tokens)) {
    if (/https?:|\/\//i.test(value)) notes.remote = true
    else notes.local = true
  }
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(value)
  function clean(rules: CSSRuleList): string {
    return Array.from(rules, (rule) => {
      if (rule instanceof CSSImportRule) {
        noteResource(rule.href, notes)
        return ""
      }
      if ("style" in rule) cleanDeclaration((rule as CSSStyleRule).style, notes)
      if ("cssRules" in rule && (rule as CSSGroupingRule).cssRules.length) {
        const group = rule as CSSGroupingRule
        const prefix = rule.cssText.slice(0, rule.cssText.indexOf("{"))
        const declarations =
          "style" in rule ? (rule as CSSStyleRule).style.cssText : ""
        return `${prefix}{${declarations}${clean(group.cssRules)}}`
      }
      if (!("style" in rule) && resourceValue.test(rule.cssText)) {
        if (/https?:|\/\//i.test(rule.cssText)) notes.remote = true
        else notes.local = true
        return ""
      }
      return rule.cssText
    }).join("\n")
  }
  return clean(sheet.cssRules)
}

export const readerStyle = `
  :root { color-scheme: light; }
  html { min-width: 0 !important; }
  body { box-sizing: border-box; margin: 0 auto !important; padding: 28px !important;
    min-width: 0 !important; max-width: 90ch; width: auto !important;
    color: #202124; background: white; font: 17px/1.65 system-ui,sans-serif;
    overflow-wrap: anywhere; }
  h1,h2,h3,h4,h5,h6 { line-height: 1.3; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; }
  td,th { border: 1px solid #ccc; padding: .4em .6em; }
  pre { white-space: pre; }
  [data-web-wide] { max-width: 100%; overflow: auto; }
  [data-web-link] { color: LinkText; text-decoration: underline; cursor: pointer; }
  :focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
  @media(max-width:480px) { body { padding: 20px 16px !important; } }
`

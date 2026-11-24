import type { Contact } from "./index"

type Field = { value: string; charset?: string }

const contentLine = /^(?:[\w-]+\.)?([\w-]+)((?:;(?:"[^"]*"|[^:"])*)?):(.*)$/
const quotedPrintable =
  /;ENCODING=(?:"QUOTED-PRINTABLE"|QUOTED-PRINTABLE)(?:;|$)/i
const charset = /;CHARSET=(?:"([^"]+)"|([^;]+))/i

function decode(value: string, encoding?: string): string {
  if (encoding) {
    const decoder = new TextDecoder(encoding)
    value = value.replace(/(?:=[\da-f]{2})+/gi, (encoded) => {
      const bytes = encoded.slice(1).split("=")
      return decoder.decode(
        Uint8Array.from(bytes, (byte) => parseInt(byte, 16))
      )
    })
  }
  return value.replace(/\\([\\;,nN])/g, (_, character: string) =>
    character.toLowerCase() === "n" ? "\n" : character
  )
}

function structured(field: Field): string[] {
  const parts = [""]
  for (const token of field.value.match(/\\.|[^;\\]+|[;\\]/gs) ?? []) {
    if (token === ";") parts.push("")
    else parts[parts.length - 1] += token
  }
  return parts.map((part) => decode(part, field.charset))
}

function unfold(source: string): string[] {
  const lines: string[] = []
  let softWrap = false
  for (const line of source.replace(/^\uFEFF/, "").split(/\r\n?|\n/)) {
    const previous = lines.at(-1)
    if (previous !== undefined && (softWrap || /^[ \t]/.test(line))) {
      lines[lines.length - 1] =
        (softWrap ? previous.slice(0, -1) : previous) +
        line.replace(/^[ \t]/, "")
    } else {
      lines.push(line)
    }
    const current = lines.at(-1)!
    softWrap =
      current.endsWith("=") &&
      quotedPrintable.test(contentLine.exec(current)?.[2] ?? "")
  }
  return lines
}

function readContact(fields: Map<string, Field>): Contact {
  const get = (name: string) => fields.get(name) ?? { value: "" }
  const text = (name: string) => {
    const field = get(name)
    return decode(field.value, field.charset)
  }
  const [lastName = "", firstName = ""] = structured(get("N"))
  const contact = {
    firstName,
    lastName,
    fullName: text("FN"),
    email: text("EMAIL"),
    phone: text("TEL").replace(/^tel:/i, ""),
    company: structured(get("ORG")).filter(Boolean).join(" / "),
    jobTitle: text("TITLE"),
    website: text("URL"),
    address: structured(get("ADR")).filter(Boolean).join(", "),
    notes: text("NOTE"),
  }
  if (!Object.values(contact).some((value) => value.trim())) {
    throw new Error("The vCard contains no contact fields")
  }
  return contact
}

export function readVcards(source: string): Contact[] {
  const cards: Contact[] = []
  let fields: Map<string, Field> | undefined
  for (const line of unfold(source)) {
    const boundary = line.trim().toUpperCase()
    if (boundary === "BEGIN:VCARD") {
      if (fields) throw new Error("Unexpected nested vCard")
      fields = new Map()
    } else if (boundary === "END:VCARD") {
      if (!fields) throw new Error("Expected a vCard beginning")
      cards.push(readContact(fields))
      fields = undefined
    } else if (fields) {
      const match = contentLine.exec(line)
      if (!match) continue
      const [, name, parameters, value] = match
      const field = name!.toUpperCase()
      if (fields.has(field)) continue
      if (quotedPrintable.test(parameters!)) {
        const encoding = charset.exec(parameters!)
        fields.set(field, {
          value: value!,
          charset: encoding?.[1] ?? encoding?.[2] ?? "utf-8",
        })
      } else {
        fields.set(field, { value: value! })
      }
    }
  }
  if (!cards.length || fields) throw new Error("Expected a complete vCard")
  return cards
}

export type ContactField =
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "company"
  | "jobTitle"
  | "website"
  | "address"
  | "notes"
export type Contact = Partial<Record<ContactField | "fullName", string>>

export function contactName(contact: Contact): string {
  return (
    contact.fullName?.trim() ||
    [contact.firstName?.trim(), contact.lastName?.trim()]
      .filter(Boolean)
      .join(" ")
  )
}

const bytes = new TextEncoder()

function fold(line: string): string {
  if (bytes.encode(line).length <= 75) return line
  let size = 0
  let output = ""
  for (const character of line) {
    const length = bytes.encode(character).length
    if (size + length > 75) {
      output += "\r\n "
      size = 1
    }
    output += character
    size += length
  }
  return output
}

function text(value = ""): string {
  return value
    .trim()
    .replace(/\r\n?/g, "\n")
    .replace(/[\\;,\n]/g, (character) =>
      character === "\n" ? "\\n" : "\\" + character
    )
}

function website(value = "") {
  const url = value.trim().replace(/[\r\n]/g, "")
  return url && (/^[a-z][a-z\d+.-]*:/i.test(url) ? url : "https://" + url)
}

export function writeVcards(contacts: readonly Contact[]): string {
  return contacts
    .map((contact) => {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:" +
          [text(contact.lastName), text(contact.firstName), "", "", ""].join(
            ";"
          ),
        "FN:" + text(contactName(contact)),
      ]
      const properties = [
        ["TEL", text(contact.phone)],
        ["EMAIL", text(contact.email)],
        ["ORG", text(contact.company)],
        ["TITLE", text(contact.jobTitle)],
        ["URL", website(contact.website)],
        [
          "ADR",
          contact.address?.trim() && ";;" + text(contact.address) + ";;;;",
        ],
        ["NOTE", text(contact.notes)],
      ]
      for (const [name, value] of properties) {
        if (value) lines.push(name + ":" + value)
      }
      lines.push("END:VCARD")
      return lines.map(fold).join("\r\n") + "\r\n"
    })
    .join("")
}

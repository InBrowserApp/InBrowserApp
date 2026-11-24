import { contactName, writeVcards, type Contact } from "@workspace/vcard"
import { readVcards } from "@workspace/vcard/read"
import {
  CsvRowError,
  readCsv,
  writeCsv,
  type CsvColumn,
} from "@workspace/record-csv"

const fields = {
  fullName: ["Full Name", "Name", "Display Name", "Formatted Name"],
  firstName: ["First Name", "Given Name", "First"],
  lastName: ["Last Name", "Family Name", "Surname", "Last"],
  email: [
    "Email",
    "E-mail",
    "Email Address",
    "E-mail Address",
    "Email 1 - Value",
    "E-mail 1 - Value",
    "E-mail 1 - Address",
  ],
  phone: [
    "Phone",
    "Phone Number",
    "Mobile",
    "Mobile Phone",
    "Home Phone",
    "Business Phone",
    "Phone 1 - Value",
    "Primary Phone",
  ],
  company: [
    "Company",
    "Organization",
    "Organization Name",
    "Organization 1 - Name",
  ],
  jobTitle: [
    "Job Title",
    "Title",
    "Organization Title",
    "Organization 1 - Title",
  ],
  website: ["Website", "Web Page", "URL", "Website 1 - Value"],
  address: ["Address", "Address 1 - Formatted"],
  notes: ["Notes", "Note"],
} as const satisfies Record<string, CsvColumn>

const addressLayouts: readonly (readonly CsvColumn[])[] = [
  [
    "Address 1 - PO Box",
    "Address 1 - Street",
    "Address 1 - Extended Address",
    "Address 1 - City",
    "Address 1 - Region",
    "Address 1 - Postal Code",
    "Address 1 - Country",
  ],
  [
    "Home Street",
    "Home Street 2",
    "Home Street 3",
    "Home City",
    "Home State",
    "Home Postal Code",
    ["Home Country", "Home Country/Region"],
  ],
  [
    "Business Street",
    "Business Street 2",
    "Business Street 3",
    "Business City",
    "Business State",
    "Business Postal Code",
    ["Business Country", "Business Country/Region"],
  ],
  [
    ["Street Address", "Street"],
    "City",
    ["Region", "State", "Province"],
    ["Postal Code", "Zip Code", "ZIP"],
    "Country",
  ],
]

type Field = keyof typeof fields
const keys = Object.keys(fields) as Field[]
const columns = [...Object.values(fields), ...addressLayouts.flat()]
const previewFields = ["fullName", "email", "phone", "company"] as const

function headers(selection: readonly Field[]) {
  return selection.map((key) => fields[key][0])
}

function records(contacts: Contact[], selection: readonly Field[]) {
  return contacts.map((contact) =>
    selection.map((key) =>
      key === "fullName" ? contactName(contact) : (contact[key] ?? "")
    )
  )
}

function preview(contacts: Contact[]) {
  return {
    headers: headers(previewFields),
    rows: records(contacts, previewFields),
  }
}

function structuredAddress(values: string[]) {
  let offset = keys.length
  for (const layout of addressLayouts) {
    const next = offset + layout.length
    const address = values.slice(offset, next).filter(Boolean).join(", ")
    if (address) return address
    offset = next
  }
  return ""
}

export function vcardToCsv(source: string) {
  const contacts = readVcards(source)
  return {
    ...preview(contacts),
    output: writeCsv(headers(keys), records(contacts, keys)),
  }
}

export function csvToVcard(source: string) {
  const contacts = readCsv(source, columns).map(({ row, values }) => {
    const contact: Contact = Object.fromEntries(
      keys.map((key, index) => [key, values[index]])
    )
    if (!contactName(contact)) throw new CsvRowError(row)
    contact.address ||= structuredAddress(values)
    return contact
  })
  return { ...preview(contacts), output: writeVcards(contacts) }
}

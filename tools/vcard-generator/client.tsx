import { useId, useMemo, useState } from "react"
import { writeVcards, type Contact, type ContactField } from "@workspace/vcard"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Building2,
  ChevronDown,
  ContactRound,
  Globe,
  Mail,
  MapPin,
  Phone,
  Text,
} from "@workspace/ui/icons"
import type catalog from "./messages/en.json"

export type Messages = typeof catalog

const autocomplete = {
  firstName: "given-name",
  lastName: "family-name",
  phone: "tel",
  email: "email",
  company: "organization",
  jobTitle: "organization-title",
  website: "url",
  address: "street-address",
  notes: "off",
} satisfies Record<ContactField, string>

const details = [
  ["phone", Phone],
  ["email", Mail],
  ["company", Building2],
  ["website", Globe],
  ["address", MapPin],
  ["notes", Text],
] as const

export default function Client({
  messages: m,
  language,
}: {
  messages: Messages
  language: string
}) {
  const id = useId()
  const [contact, setContact] = useState<Contact>({})
  const names: readonly ContactField[] = /^(zh|ja|ko|vi)(-|$)/.test(language)
    ? ["lastName", "firstName"]
    : ["firstName", "lastName"]
  const name = names
    .map((key) => contact[key]?.trim())
    .filter(Boolean)
    .join(" ")
  const value = name ? writeVcards([{ ...contact, fullName: name }]) : ""
  const file = useMemo(
    () => new Blob([value], { type: "text/vcard;charset=utf-8" }),
    [value]
  )
  const filename =
    (name.replace(/[<>:"/\\|?*]/g, "-").trim() || "contact") + ".vcf"

  function field(key: ContactField) {
    const fieldId = id + key
    const props = {
      id: fieldId,
      value: contact[key] ?? "",
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setContact({ ...contact, [key]: event.currentTarget.value }),
      autoComplete: autocomplete[key],
      dir: "auto",
    }
    return (
      <div key={key} className="grid gap-2">
        <Label htmlFor={fieldId}>{m[key]}</Label>
        {key === "notes" ? (
          <Textarea {...props} />
        ) : (
          <Input
            {...props}
            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
            inputMode={key === "website" ? "url" : undefined}
          />
        )}
      </div>
    )
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{m.details}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">{names.map(field)}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("phone")}
              {field("email")}
            </div>
          </div>
          <details className="group border-t pt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              {m.more}
              <ChevronDown
                className="size-4 shrink-0 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {field("company")}
                {field("jobTitle")}
              </div>
              {field("website")}
              {field("address")}
              {field("notes")}
            </div>
          </details>
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{m.preview}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-40 items-start gap-4 rounded-lg border bg-muted/40 p-4 sm:p-5">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-background text-muted-foreground">
              <ContactRound className="size-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              {name ? (
                <>
                  <p dir="auto" className="text-lg font-semibold wrap-anywhere">
                    {name}
                  </p>
                  {contact.jobTitle?.trim() && (
                    <p
                      dir="auto"
                      className="text-sm wrap-anywhere text-muted-foreground"
                    >
                      {contact.jobTitle}
                    </p>
                  )}
                  <ul className="mt-2 grid gap-1.5 text-sm">
                    {details.map(
                      ([key, Icon]) =>
                        contact[key]?.trim() && (
                          <li key={key} className="flex items-start gap-2">
                            <Icon
                              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <span
                              dir="auto"
                              className="min-w-0 wrap-anywhere whitespace-pre-wrap"
                            >
                              {contact[key]}
                            </span>
                          </li>
                        )
                    )}
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">{m.empty}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          {name && (
            <DocumentDownload
              file={file}
              filename={filename}
              label={m.download}
            />
          )}
          <ToolCopyButton
            value={value}
            copyLabel={m.copy}
            copiedLabel={m.copied}
            failedLabel={m.copyFailed}
            size="default"
          />
        </CardFooter>
      </Card>
    </div>
  )
}

import { useId } from "react"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import type { SubjectInput } from "../core/csr"
import type { CsrGeneratorMessages } from "../client/types"

type CsrSubjectFieldsProps = Readonly<{
  messages: CsrGeneratorMessages
  subject: SubjectInput
  onChange: (next: SubjectInput) => void
}>

function CsrSubjectFields({
  messages,
  subject,
  onChange,
}: CsrSubjectFieldsProps) {
  const commonNameId = useId()
  const organizationId = useId()
  const organizationalUnitId = useId()
  const countryId = useId()
  const stateId = useId()
  const localityId = useId()
  const emailId = useId()

  function update<K extends keyof SubjectInput>(
    key: K,
    value: SubjectInput[K]
  ) {
    onChange({ ...subject, [key]: value })
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={commonNameId}>
          {messages.subjectCommonNameLabel}
        </FieldLabel>
        <Input
          id={commonNameId}
          name="subject-cn"
          value={subject.commonName}
          placeholder={messages.subjectCommonNamePlaceholder}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => update("commonName", event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={organizationId}>
          {messages.subjectOrganizationLabel}
        </FieldLabel>
        <Input
          id={organizationId}
          name="subject-o"
          value={subject.organization}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => update("organization", event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={organizationalUnitId}>
          {messages.subjectOrganizationalUnitLabel}
        </FieldLabel>
        <Input
          id={organizationalUnitId}
          name="subject-ou"
          value={subject.organizationalUnit}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) =>
            update("organizationalUnit", event.target.value)
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={countryId}>
          {messages.subjectCountryLabel}
        </FieldLabel>
        <Input
          id={countryId}
          name="subject-c"
          value={subject.country}
          placeholder={messages.subjectCountryPlaceholder}
          maxLength={2}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) =>
            update("country", event.target.value.toUpperCase())
          }
        />
        <FieldDescription>
          {messages.subjectCountryPlaceholder}
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={stateId}>{messages.subjectStateLabel}</FieldLabel>
        <Input
          id={stateId}
          name="subject-st"
          value={subject.state}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => update("state", event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={localityId}>
          {messages.subjectLocalityLabel}
        </FieldLabel>
        <Input
          id={localityId}
          name="subject-l"
          value={subject.locality}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => update("locality", event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={emailId}>{messages.subjectEmailLabel}</FieldLabel>
        <Input
          id={emailId}
          name="subject-email"
          type="email"
          value={subject.emailAddress}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => update("emailAddress", event.target.value)}
        />
      </Field>
    </FieldGroup>
  )
}

export { CsrSubjectFields }

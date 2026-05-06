import { useId } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw } from "@workspace/ui/icons"

import type { IcalEventGeneratorMessages } from "../types"
import type { IcalEventFormState } from "../core/form-state"

type EventDetailsCardProps = Readonly<{
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
  onFieldChange: (
    key: keyof Pick<
      IcalEventFormState,
      "title" | "location" | "url" | "description" | "uid"
    >,
    value: string
  ) => void
  onRegenerateUid: () => void
}>

function getPlaceholder(value: string) {
  return value.endsWith("…") ? value : `${value}…`
}

function EventDetailsCard({
  messages,
  formState,
  onFieldChange,
  onRegenerateUid,
}: EventDetailsCardProps) {
  const titleId = useId()
  const locationId = useId()
  const urlId = useId()
  const descriptionId = useId()
  const uidId = useId()

  return (
    <>
      <CardHeader className="border-b">
        <div>
          <CardTitle>{messages.details.title}</CardTitle>
          <CardDescription>{messages.details.description}</CardDescription>
        </div>
        <CardAction>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRegenerateUid}
          >
            <RefreshCcw data-icon="inline-start" />
            {messages.actions.regenerateUid}
          </Button>
        </CardAction>
      </CardHeader>
      <div className="px-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={titleId}>
              {messages.details.summaryLabel}
            </FieldLabel>
            <Input
              id={titleId}
              name="ical-title"
              autoComplete="off"
              value={formState.title}
              placeholder={getPlaceholder(messages.details.summaryPlaceholder)}
              onChange={(event) => {
                onFieldChange("title", event.target.value)
              }}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={locationId}>
                {messages.details.locationLabel}
              </FieldLabel>
              <Input
                id={locationId}
                name="ical-location"
                autoComplete="off"
                value={formState.location}
                onChange={(event) => {
                  onFieldChange("location", event.target.value)
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={urlId}>
                {messages.details.urlLabel}
              </FieldLabel>
              <Input
                id={urlId}
                type="url"
                inputMode="url"
                name="ical-url"
                autoComplete="off"
                spellCheck={false}
                value={formState.url}
                onChange={(event) => {
                  onFieldChange("url", event.target.value)
                }}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor={descriptionId}>
              {messages.details.notesLabel}
            </FieldLabel>
            <Textarea
              id={descriptionId}
              name="ical-description"
              autoComplete="off"
              rows={5}
              value={formState.description}
              placeholder={getPlaceholder(messages.details.notesPlaceholder)}
              onChange={(event) => {
                onFieldChange("description", event.target.value)
              }}
              className="min-h-28 resize-y"
            />
          </Field>

          <Field orientation="responsive">
            <FieldLabel htmlFor={uidId}>{messages.details.uidLabel}</FieldLabel>
            <FieldContent>
              <Input
                id={uidId}
                name="ical-uid"
                autoComplete="off"
                spellCheck={false}
                translate="no"
                value={formState.uid}
                onChange={(event) => {
                  onFieldChange("uid", event.target.value)
                }}
                className="font-mono text-xs sm:text-sm"
              />
            </FieldContent>
          </Field>
        </FieldGroup>
      </div>
    </>
  )
}

export { EventDetailsCard }

import type { Dispatch, SetStateAction } from "react"

import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"

import {
  clampIndentSize,
  type JsonToXmlOptions,
} from "../core/convert-json-to-xml"
import type { JsonToXmlConverterMessages } from "../client/types"

type OptionsCardProps = Readonly<{
  arrayItemTagId: string
  expandEmptyElementsId: string
  hasArrayItemTagError: boolean
  hasRootElementError: boolean
  includeDeclarationId: string
  indentSizeId: string
  messages: JsonToXmlConverterMessages
  options: JsonToXmlOptions
  rootElementId: string
  setOptions: Dispatch<SetStateAction<JsonToXmlOptions>>
}>

function OptionsCard({
  arrayItemTagId,
  expandEmptyElementsId,
  hasArrayItemTagError,
  hasRootElementError,
  includeDeclarationId,
  indentSizeId,
  messages,
  options,
  rootElementId,
  setOptions,
}: OptionsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsLabel}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field>
              <FieldLabel htmlFor={rootElementId}>
                {messages.rootElementLabel}
              </FieldLabel>
              <Input
                id={rootElementId}
                value={options.rootElementName}
                aria-invalid={hasRootElementError}
                onChange={(event) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    rootElementName: event.target.value,
                  }))
                }}
              />
              <FieldDescription>
                {messages.rootElementDescription}
              </FieldDescription>
              <FieldError>
                {hasRootElementError
                  ? messages.invalidRootElementNameMessage
                  : undefined}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={arrayItemTagId}>
                {messages.arrayItemTagLabel}
              </FieldLabel>
              <Input
                id={arrayItemTagId}
                value={options.arrayItemTag}
                aria-invalid={hasArrayItemTagError}
                onChange={(event) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    arrayItemTag: event.target.value,
                  }))
                }}
              />
              <FieldDescription>
                {messages.arrayItemTagDescription}
              </FieldDescription>
              <FieldError>
                {hasArrayItemTagError
                  ? messages.invalidArrayItemTagMessage
                  : undefined}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={indentSizeId}>
                {messages.indentSizeLabel}
              </FieldLabel>
              <Input
                id={indentSizeId}
                type="number"
                min={0}
                max={8}
                value={options.indentSize}
                onChange={(event) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    indentSize: clampIndentSize(
                      Number(event.target.value || 0)
                    ),
                  }))
                }}
              />
              <FieldDescription>
                {messages.indentSizeDescription}
              </FieldDescription>
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Field orientation="horizontal">
              <Checkbox
                id={includeDeclarationId}
                checked={options.includeXmlDeclaration}
                onCheckedChange={(checked) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    includeXmlDeclaration: Boolean(checked),
                  }))
                }}
              />
              <FieldContent>
                <FieldLabel htmlFor={includeDeclarationId}>
                  {messages.includeDeclarationLabel}
                </FieldLabel>
                <FieldDescription>
                  {messages.includeDeclarationDescription}
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id={expandEmptyElementsId}
                checked={options.fullTagEmptyElement}
                onCheckedChange={(checked) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    fullTagEmptyElement: Boolean(checked),
                  }))
                }}
              />
              <FieldContent>
                <FieldLabel htmlFor={expandEmptyElementsId}>
                  {messages.expandEmptyElementsLabel}
                </FieldLabel>
                <FieldDescription>
                  {messages.expandEmptyElementsDescription}
                </FieldDescription>
              </FieldContent>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { OptionsCard }

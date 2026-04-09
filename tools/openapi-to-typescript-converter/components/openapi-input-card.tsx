import { useId, type ChangeEvent, type RefObject } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  Braces,
  FileText,
  FileJson2,
  Globe,
  LoaderCircle,
  RefreshCcw,
} from "@workspace/ui/icons"

import type { OpenApiToTypescriptConverterMessages } from "../client/types"

type OpenApiInputCardProps = Readonly<{
  fileInputRef: RefObject<HTMLInputElement | null>
  hasInputError: boolean
  importUrl: string
  importUrlError: string
  isFetchingUrl: boolean
  messages: OpenApiToTypescriptConverterMessages
  openApiText: string
  pendingLargeGenerate: boolean
  showUrlImport: boolean
  onClear: () => void
  onFetchUrl: () => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onGenerateNow: () => void
  onImportUrlChange: (value: string) => void
  onOpenApiChange: (value: string) => void
  onToggleUrlImport: () => void
  onUseSample: () => void
}>

function OpenApiInputCard({
  fileInputRef,
  hasInputError,
  importUrl,
  importUrlError,
  isFetchingUrl,
  messages,
  openApiText,
  pendingLargeGenerate,
  showUrlImport,
  onClear,
  onFetchUrl,
  onFileChange,
  onGenerateNow,
  onImportUrlChange,
  onOpenApiChange,
  onToggleUrlImport,
  onUseSample,
}: OpenApiInputCardProps) {
  const openApiTextId = useId()
  const importUrlId = useId()

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.openApiLabel}</CardTitle>
        <CardDescription>{messages.openApiDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <FieldGroup className="flex-1">
          {showUrlImport ? (
            <Field data-invalid={Boolean(importUrlError) || undefined}>
              <FieldLabel htmlFor={importUrlId}>
                {messages.importUrlFieldLabel}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id={importUrlId}
                  type="url"
                  value={importUrl}
                  aria-invalid={Boolean(importUrlError)}
                  placeholder={messages.importUrlPlaceholder}
                  onChange={(event) => {
                    onImportUrlChange(event.target.value)
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault()
                      onFetchUrl()
                    }
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    disabled={isFetchingUrl}
                    onClick={onFetchUrl}
                  >
                    {isFetchingUrl ? (
                      <LoaderCircle
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                    ) : (
                      <Globe data-icon="inline-start" />
                    )}
                    {isFetchingUrl
                      ? messages.fetchingUrlLabel
                      : messages.fetchUrlLabel}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                {messages.importUrlDescription}
              </FieldDescription>
              <FieldError>{importUrlError}</FieldError>
            </Field>
          ) : null}

          {pendingLargeGenerate ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {messages.generationPausedHint}
            </p>
          ) : null}

          <Field className="flex-1" data-invalid={hasInputError || undefined}>
            <Textarea
              id={openApiTextId}
              aria-label={messages.openApiLabel}
              aria-invalid={hasInputError}
              spellCheck={false}
              value={openApiText}
              onChange={(event) => {
                onOpenApiChange(event.target.value)
              }}
              placeholder={messages.openApiPlaceholder}
              className="[field-sizing:fixed] h-[16em] resize-y font-mono text-sm"
            />
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="flex flex-wrap justify-between gap-3 border-t">
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
            <FileJson2 data-icon="inline-start" />
            {messages.useSampleLabel}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <RefreshCcw data-icon="inline-start" />
            {messages.clearLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <FileText data-icon="inline-start" />
            {messages.importFromFileLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleUrlImport}
          >
            <Globe data-icon="inline-start" />
            {showUrlImport
              ? messages.hideUrlImportLabel
              : messages.importFromUrlLabel}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.yaml,.yml,.txt,application/json,text/plain"
            aria-label={messages.importFromFileLabel}
            className="sr-only"
            onChange={onFileChange}
          />
        </div>

        {pendingLargeGenerate ? (
          <Button type="button" size="sm" onClick={onGenerateNow}>
            <Braces data-icon="inline-start" />
            {messages.generateNowLabel}
          </Button>
        ) : null}
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { OpenApiInputCard }

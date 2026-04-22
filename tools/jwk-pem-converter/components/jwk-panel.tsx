import { type ChangeEvent, type RefObject } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import type { PemOutputType } from "../core/jwk-pem"
import { DEFAULT_JWK_INPUT, JWK_FILE_ACCEPT } from "../client/constants"
import { formatKeyLabel, type JwkParseState } from "../client/helpers"
import type { JwkPemConverterMessages } from "../client/types"
import { InputCard } from "./input-card"

type JwkPanelProps = Readonly<{
  error: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  input: string
  messages: JwkPemConverterMessages
  outputType: PemOutputType
  parseState: JwkParseState
  selectedJwkIndex: number
  setInput: (value: string) => void
  setOutputType: (value: PemOutputType) => void
  setSelectedJwkIndex: (value: number) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}>

function JwkPanel({
  error,
  fileInputRef,
  input,
  messages,
  outputType,
  parseState,
  selectedJwkIndex,
  setInput,
  setOutputType,
  setSelectedJwkIndex,
  onFileChange,
}: JwkPanelProps) {
  return (
    <InputCard
      accept={JWK_FILE_ACCEPT}
      ariaLabel={messages.jwkInputTitle}
      clearLabel={messages.clearLabel}
      description={messages.jwkInputHint}
      fileInputRef={fileInputRef}
      importFromFileLabel={messages.importFromFileLabel}
      invalid={error}
      placeholder={messages.jwkInputPlaceholder}
      title={messages.jwkInputTitle}
      useSampleLabel={messages.useSampleLabel}
      value={input}
      onChange={setInput}
      onClear={() => {
        setInput("")
      }}
      onFileChange={onFileChange}
      onUseSample={() => {
        setInput(DEFAULT_JWK_INPUT)
      }}
    >
      <FieldGroup>
        {parseState.state === "parsed" && parseState.keys.length > 1 ? (
          <Field>
            <FieldTitle>{messages.keySelectLabel}</FieldTitle>
            <FieldDescription>{messages.keySelectHint}</FieldDescription>
            <Select
              value={String(selectedJwkIndex)}
              onValueChange={(value) => {
                setSelectedJwkIndex(Number(value))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {parseState.keys.map((key, index) => (
                  <SelectItem
                    key={formatKeyLabel(messages, key, index)}
                    value={String(index)}
                  >
                    {formatKeyLabel(messages, key, index)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}

        <Field>
          <FieldTitle>{messages.outputTypeLabel}</FieldTitle>
          <ToggleGroup
            type="single"
            value={outputType}
            onValueChange={(value) => {
              if (value === "public" || value === "private") {
                setOutputType(value)
              }
            }}
            variant="outline"
            className="grid w-full grid-cols-2"
          >
            <ToggleGroupItem value="public" className="w-full">
              {messages.outputTypePublic}
            </ToggleGroupItem>
            <ToggleGroupItem value="private" className="w-full">
              {messages.outputTypePrivate}
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
      </FieldGroup>
    </InputCard>
  )
}

export { JwkPanel }

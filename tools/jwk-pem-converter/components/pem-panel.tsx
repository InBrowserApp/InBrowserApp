import { type ChangeEvent, type RefObject } from "react"

import { Field, FieldTitle } from "@workspace/ui/components/ui/field"
import { Switch } from "@workspace/ui/components/ui/switch"

import { DEFAULT_PEM_INPUT, PEM_FILE_ACCEPT } from "../client/constants"
import type { JwkPemConverterMessages } from "../client/types"
import { InputCard } from "./input-card"

type PemPanelProps = Readonly<{
  error: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  input: string
  messages: JwkPemConverterMessages
  prettyJson: boolean
  setInput: (value: string) => void
  setPrettyJson: (value: boolean) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}>

function PemPanel({
  error,
  fileInputRef,
  input,
  messages,
  prettyJson,
  setInput,
  setPrettyJson,
  onFileChange,
}: PemPanelProps) {
  return (
    <InputCard
      accept={PEM_FILE_ACCEPT}
      ariaLabel={messages.pemInputTitle}
      clearLabel={messages.clearLabel}
      description={messages.pemInputHint}
      fileInputRef={fileInputRef}
      importFromFileLabel={messages.importFromFileLabel}
      invalid={error}
      placeholder={messages.pemInputPlaceholder}
      title={messages.pemInputTitle}
      useSampleLabel={messages.useSampleLabel}
      value={input}
      onChange={setInput}
      onClear={() => {
        setInput("")
      }}
      onFileChange={onFileChange}
      onUseSample={() => {
        setInput(DEFAULT_PEM_INPUT)
      }}
    >
      <Field orientation="horizontal">
        <FieldTitle>{messages.prettyJson}</FieldTitle>
        <Switch
          aria-label={messages.prettyJson}
          checked={prettyJson}
          onCheckedChange={setPrettyJson}
        />
      </Field>
    </InputCard>
  )
}

export { PemPanel }

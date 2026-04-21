import { useId } from "react"

import { CustomBaseCard } from "./components/custom-base-card"
import { ExtendedBasesCard } from "./components/extended-bases-card"
import { StandardBasesCard } from "./components/standard-bases-card"
import { useNumberBaseConverter } from "./use-number-base-converter"

import type { NumberBaseConverterMessages } from "./types"

type NumberBaseConverterClientProps = Readonly<{
  messages: NumberBaseConverterMessages
}>

function NumberBaseConverterClient({
  messages,
}: NumberBaseConverterClientProps) {
  const binaryId = useId()
  const octalId = useId()
  const decimalId = useId()
  const hexId = useId()
  const base32Id = useId()
  const base36Id = useId()
  const base62Id = useId()
  const base64Id = useId()
  const customBaseId = useId()
  const customId = useId()
  const state = useNumberBaseConverter()

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.92fr)]">
      <StandardBasesCard
        binaryId={binaryId}
        copiedLabel={messages.copiedLabel}
        decimalId={decimalId}
        fields={state.fields}
        hexId={hexId}
        invalidStates={state.invalidStates}
        messages={messages}
        octalId={octalId}
        onBinaryChange={state.setBinary}
        onDecimalChange={state.setDecimal}
        onHexChange={state.setHex}
        onOctalChange={state.setOctal}
        onReset={state.reset}
      />

      <ExtendedBasesCard
        base32Id={base32Id}
        base36Id={base36Id}
        base62Id={base62Id}
        base64Id={base64Id}
        fields={state.fields}
        invalidStates={state.invalidStates}
        messages={messages}
        onBase32Change={state.setBase32}
        onBase36Change={state.setBase36}
        onBase62Change={state.setBase62}
        onBase64Change={state.setBase64}
      />

      <CustomBaseCard
        customBase={state.customBase}
        customBaseId={customBaseId}
        customId={customId}
        customValue={state.fields.custom}
        isInvalid={state.invalidStates.custom}
        messages={messages}
        onCustomBaseChange={state.setCustomBase}
        onCustomChange={state.setCustom}
      />
    </div>
  )
}

export default NumberBaseConverterClient

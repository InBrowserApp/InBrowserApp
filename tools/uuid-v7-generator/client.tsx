import { UuidV7OptionsCard } from "./components/options-card"
import { UuidV7ResultsCard } from "./components/results-card"
import { useUuidV7Generator } from "./use-uuid-v7-generator"

import type { UuidV7Messages } from "./types"

type UuidV7GeneratorClientProps = Readonly<{
  messages: UuidV7Messages
  language: string
}>

function UuidV7GeneratorClient({
  messages,
  language,
}: UuidV7GeneratorClientProps) {
  const state = useUuidV7Generator(messages, language)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <UuidV7OptionsCard
        className="min-w-0 xl:sticky xl:top-6 xl:self-start"
        messages={messages}
        countId={state.countId}
        customDateTimeId={state.customDateTimeId}
        customUnixMillisecondsId={state.customUnixMillisecondsId}
        timestampErrorId={state.timestampErrorId}
        mode={state.mode}
        count={state.count}
        timestampMode={state.timestampMode}
        customDateTimeInput={state.customDateTimeInput}
        customUnixMillisecondsInput={state.customUnixMillisecondsInput}
        timestampError={state.timestampError}
        onModeChange={state.setMode}
        onCountChange={state.setCount}
        onTimestampModeChange={state.setTimestampMode}
        onCustomDateTimeChange={state.setCustomDateTimeInput}
        onCustomUnixMillisecondsChange={state.setCustomUnixMillisecondsInput}
        onSetNow={state.setCustomTimestampToNow}
      />

      <UuidV7ResultsCard
        downloadFilename={state.downloadFilename}
        downloadUrl={state.downloadUrl}
        generatedAtLabel={state.generatedAtLabel}
        generatedAtMs={state.generatedAtMs}
        messages={messages}
        output={state.output}
        count={state.generatedCount}
        isBatchMode={state.mode === "batch"}
        timestampErrorId={state.timestampErrorId}
        timestampError={state.timestampError}
        onRegenerate={state.regenerate}
      />
    </div>
  )
}

export default UuidV7GeneratorClient

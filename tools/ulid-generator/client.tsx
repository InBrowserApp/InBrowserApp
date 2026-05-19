import { UlidOptionsCard } from "./components/options-card"
import { UlidResultsCard } from "./components/results-card"
import { useUlidGenerator } from "./use-ulid-generator"

import type { UlidMessages } from "./types"

type UlidGeneratorClientProps = Readonly<{
  messages: UlidMessages
  language: string
}>

function UlidGeneratorClient({ messages, language }: UlidGeneratorClientProps) {
  const state = useUlidGenerator(messages, language)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <UlidOptionsCard
        messages={messages}
        generationModeId={state.generationModeId}
        countId={state.countId}
        customDateTimeId={state.customDateTimeId}
        customUnixMillisecondsId={state.customUnixMillisecondsId}
        monotonicBatchId={state.monotonicBatchId}
        generationMode={state.generationMode}
        count={state.count}
        timestampMode={state.timestampMode}
        customDateTimeInput={state.customDateTimeInput}
        customUnixMillisecondsInput={state.customUnixMillisecondsInput}
        monotonicBatch={state.monotonicBatch}
        onGenerationModeChange={state.setGenerationMode}
        onCountChange={state.setCount}
        onTimestampModeChange={state.setTimestampMode}
        onCustomDateTimeChange={state.setCustomDateTimeInput}
        onCustomUnixMillisecondsChange={state.setCustomUnixMillisecondsInput}
        onMonotonicBatchChange={state.setMonotonicBatch}
        onSetNow={state.setCustomTimestampToNow}
      />

      <UlidResultsCard
        messages={messages}
        output={state.output}
        timestampError={state.timestampError}
        generatedAtText={state.generatedAtText}
        downloadFilename={state.downloadFilename}
        downloadUrl={state.downloadUrl}
        isBatchMode={state.generationMode === "batch"}
        onRegenerate={state.regenerate}
      />
    </div>
  )
}

export default UlidGeneratorClient

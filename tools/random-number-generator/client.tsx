import { useId } from "react"

import { FullscreenOverlay } from "./components/fullscreen-overlay"
import { HistoryCard } from "./components/history-card"
import { OptionsCard } from "./components/options-card"
import { ResultsCard } from "./components/results-card"
import { useRandomNumberGenerator } from "./use-random-number-generator"

import type { RandomNumberGeneratorMessages } from "./types"

type RandomNumberGeneratorClientProps = Readonly<{
  messages: RandomNumberGeneratorMessages
}>

function RandomNumberGeneratorClient({
  messages,
}: RandomNumberGeneratorClientProps) {
  const minId = useId()
  const maxId = useId()
  const countId = useId()
  const decimalPlacesId = useId()
  const state = useRandomNumberGenerator(messages)

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <OptionsCard
          messages={messages}
          minId={minId}
          maxId={maxId}
          countId={countId}
          decimalPlacesId={decimalPlacesId}
          minValue={state.minValue}
          maxValue={state.maxValue}
          count={state.count}
          allowRepeat={state.allowRepeat}
          numberType={state.numberType}
          decimalPlaces={state.decimalPlaces}
          inputStep={state.inputStep}
          rangeError={state.rangeError}
          countError={state.countError}
          onMinValueChange={state.setMinValue}
          onMaxValueChange={state.setMaxValue}
          onCountChange={state.setCount}
          onAllowRepeatChange={state.setAllowRepeat}
          onNumberTypeChange={state.setNumberType}
          onDecimalPlacesChange={state.setDecimalPlaces}
          onPresetChange={state.applyPreset}
        />

        <ResultsCard
          messages={messages}
          formattedNumbers={state.formattedNumbers}
          outputText={state.outputText}
          canRoll={state.canRoll}
          isRolling={state.isRolling}
          downloadUrl={state.downloadUrl}
          onToggleRolling={state.toggleRolling}
          onOpenFullscreen={state.openFullscreen}
        />
      </div>

      <div className="mt-6">
        <HistoryCard
          messages={messages}
          historyEntries={state.historyEntries}
          onClearHistory={state.clearHistory}
        />
      </div>

      {state.isFullscreen ? (
        <FullscreenOverlay
          messages={messages}
          formattedNumbers={state.formattedNumbers}
          canRoll={state.canRoll}
          isRolling={state.isRolling}
          onToggleRolling={state.toggleRolling}
          onClose={state.closeFullscreen}
        />
      ) : null}
    </>
  )
}

export default RandomNumberGeneratorClient

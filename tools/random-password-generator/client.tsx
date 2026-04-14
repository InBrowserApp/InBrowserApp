import { useId } from "react"

import { FullscreenOverlay } from "./components/fullscreen-overlay"
import { HistoryCard } from "./components/history-card"
import { OptionsCard } from "./components/options-card"
import { ResultsCard } from "./components/results-card"
import { useRandomPasswordGenerator } from "./use-random-password-generator"

import type { RandomPasswordGeneratorMessages } from "./types"

type RandomPasswordGeneratorClientProps = Readonly<{
  messages: RandomPasswordGeneratorMessages
}>

function RandomPasswordGeneratorClient({
  messages,
}: RandomPasswordGeneratorClientProps) {
  const randomLengthId = useId()
  const wordsCountId = useId()
  const wordsSeparatorId = useId()
  const separatorBlockLengthId = useId()
  const separatorBlockCountId = useId()
  const separatorBlockSeparatorId = useId()
  const pinLengthId = useId()
  const state = useRandomPasswordGenerator()

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <OptionsCard
          messages={messages}
          mode={state.mode}
          result={state.result}
          randomLengthId={randomLengthId}
          wordsCountId={wordsCountId}
          wordsSeparatorId={wordsSeparatorId}
          separatorBlockLengthId={separatorBlockLengthId}
          separatorBlockCountId={separatorBlockCountId}
          separatorBlockSeparatorId={separatorBlockSeparatorId}
          pinLengthId={pinLengthId}
          randomLength={state.randomLength}
          randomCharsets={state.randomCharsets}
          randomExcludeSimilar={state.randomExcludeSimilar}
          wordsCount={state.wordsCount}
          wordsSeparator={state.wordsSeparator}
          wordsCapitalize={state.wordsCapitalize}
          wordsIncludeNumber={state.wordsIncludeNumber}
          separatorCharsets={state.separatorCharsets}
          separatorExcludeSimilar={state.separatorExcludeSimilar}
          separatorBlockLength={state.separatorBlockLength}
          separatorBlockCount={state.separatorBlockCount}
          separatorBlockSeparator={state.separatorBlockSeparator}
          pinLength={state.pinLength}
          pinAllowLeadingZero={state.pinAllowLeadingZero}
          onModeChange={state.setMode}
          onRandomLengthChange={state.setRandomLength}
          onRandomCharsetToggle={state.toggleRandomCharset}
          onRandomExcludeSimilarChange={state.setRandomExcludeSimilar}
          onWordsCountChange={state.setWordsCount}
          onWordsSeparatorChange={state.setWordsSeparator}
          onWordsCapitalizeChange={state.setWordsCapitalize}
          onWordsIncludeNumberChange={state.setWordsIncludeNumber}
          onSeparatorCharsetToggle={state.toggleSeparatorCharset}
          onSeparatorExcludeSimilarChange={state.setSeparatorExcludeSimilar}
          onSeparatorBlockLengthChange={state.setSeparatorBlockLength}
          onSeparatorBlockCountChange={state.setSeparatorBlockCount}
          onSeparatorBlockSeparatorChange={state.setSeparatorBlockSeparator}
          onPinLengthChange={state.setPinLength}
          onPinAllowLeadingZeroChange={state.setPinAllowLeadingZero}
        />

        <ResultsCard
          messages={messages}
          mode={state.mode}
          result={state.result}
          downloadUrl={state.downloadUrl}
          onRegenerate={state.regenerate}
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
          result={state.result}
          onRegenerate={state.regenerate}
          onClose={state.closeFullscreen}
        />
      ) : null}
    </>
  )
}

export default RandomPasswordGeneratorClient

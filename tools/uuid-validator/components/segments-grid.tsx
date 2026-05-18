import { MetricTile, MonoValue } from "./result-tiles"

import type {
  UuidValidationAnalysis,
  UuidValidatorMessages,
} from "../client/types"

function SegmentsGrid({
  analysis,
  messages,
}: Readonly<{
  analysis: UuidValidationAnalysis
  messages: UuidValidatorMessages
}>) {
  const segments = analysis.segments

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{messages.segmentsTitle}</h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricTile
          label={messages.timeLowLabel}
          value={<MonoValue value={segments?.timeLow} messages={messages} />}
        />
        <MetricTile
          label={messages.timeMidLabel}
          value={<MonoValue value={segments?.timeMid} messages={messages} />}
        />
        <MetricTile
          label={messages.timeHighAndVersionLabel}
          value={
            <MonoValue
              value={segments?.timeHighAndVersion}
              messages={messages}
            />
          }
        />
        <MetricTile
          label={messages.clockSequenceLabel}
          value={
            <MonoValue value={segments?.clockSequence} messages={messages} />
          }
        />
        <MetricTile
          label={messages.nodeLabel}
          value={<MonoValue value={segments?.node} messages={messages} />}
        />
      </div>
    </section>
  )
}

export { SegmentsGrid }

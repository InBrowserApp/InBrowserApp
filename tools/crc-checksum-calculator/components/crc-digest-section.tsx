import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Binary, TriangleAlert } from "@workspace/ui/icons"

import type { CrcDigestState } from "../client/state"
import type { CrcChecksumCalculatorPageMessages } from "../client/types"
import type { CrcResult } from "../core/crc"
import { CrcResultsGrid } from "./crc-results-grid"

type CrcDigestSectionProps = Readonly<{
  state: CrcDigestState
  results: readonly CrcResult[]
  messages: CrcChecksumCalculatorPageMessages
}>

function CrcDigestSection({ state, results, messages }: CrcDigestSectionProps) {
  if (state.status === "idle") {
    return (
      <Empty className="min-h-64 border-border/80 bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Binary />
          </EmptyMedia>
          <EmptyTitle>{messages.emptyInputTitle}</EmptyTitle>
          <EmptyDescription>{messages.emptyInputDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <section className="grid gap-4">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <CrcResultsGrid
        messages={messages}
        results={results}
        loading={state.status === "loading"}
      />
    </section>
  )
}

export { CrcDigestSection }

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/ui/alert"
import { Shield, TriangleAlert } from "@workspace/ui/icons"
import { ImportCard } from "./components/import-card"
import { Summary } from "./components/summary"
import { Requests } from "./components/requests"
import { useHarImport } from "./use-har-import"
import type { Messages } from "./types"

export default function HarAnalyzer({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const state = useHarImport()
  return (
    <div className="har-analyzer flex min-w-0 flex-col gap-6">
      <ImportCard
        messages={m}
        name={state.name}
        loading={state.loading}
        onOpen={state.open}
        onExample={() => state.example(m.exampleName)}
        onClear={state.clear}
      />
      <div
        aria-live="polite"
        aria-atomic="true"
        className={
          state.error || state.capture?.skipped
            ? "flex flex-col gap-3"
            : "sr-only"
        }
      >
        {state.error ? (
          <Alert variant="destructive">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>{m.errors[state.error]}</AlertTitle>
          </Alert>
        ) : null}
        {state.capture?.skipped ? (
          <Alert>
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>
              {m.skipped}:{" "}
              {new Intl.NumberFormat(lang).format(state.capture.skipped)}
            </AlertTitle>
          </Alert>
        ) : null}
      </div>
      {state.capture ? (
        <>
          <Summary capture={state.capture} messages={m} lang={lang} />
          <Requests
            key={state.revision}
            capture={state.capture}
            messages={m}
            lang={lang}
          />
          <Alert>
            <Shield aria-hidden="true" />
            <AlertDescription>{m.sensitive}</AlertDescription>
          </Alert>
        </>
      ) : null}
    </div>
  )
}

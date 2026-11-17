import { Shield } from "@workspace/ui/icons"
import type { Messages } from "./client/types"
import { useImageCropper } from "./client/use-image-cropper"
import { OptionsCard } from "./components/options-card"
import { ResultCard } from "./components/result-card"
import { SourceCard } from "./components/source-card"

export default function ImageCropperClient({
  messages: m,
}: {
  messages: Messages
}) {
  const state = useImageCropper(m)
  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <SourceCard state={state} m={m} />
        <OptionsCard state={state} m={m} />
      </div>
      <div aria-live="polite" aria-atomic="true">
        {state.result && state.resultUrl ? (
          <ResultCard result={state.result} url={state.resultUrl} m={m} />
        ) : null}
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="size-4 shrink-0" aria-hidden="true" />
        {m.privacy}
      </p>
    </div>
  )
}

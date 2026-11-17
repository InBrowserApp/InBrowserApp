import { useRef } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  LoaderCircle,
  Scissors,
  TriangleAlert,
  Undo2,
} from "@workspace/ui/icons"
import { ClipCard } from "./components/clip-card"
import { ExportCard } from "./components/export-card"
import { UploadCard } from "./components/upload-card"
import { useAudioEditor } from "./client/use-audio-editor"
import type { AudioEditorMessages } from "./types"

export default function AudioEditorClient({
  messages: m,
  language = "en",
}: {
  messages: AudioEditorMessages
  language?: string
}) {
  const state = useAudioEditor(m)
  const outputAudio = useRef<HTMLAudioElement>(null)
  return (
    <div className="flex flex-col gap-6" data-tool="audio-trimmer-merger">
      <UploadCard
        messages={m}
        disabled={!!state.busy}
        onFiles={(files) => void state.addFiles(files)}
      />
      <div role="status" aria-live="polite" className="empty:hidden">
        {state.busy ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle
              className="size-4 motion-safe:animate-spin"
              aria-hidden="true"
            />
            {state.busy === "reading" ? m.loading : m.exporting}
          </p>
        ) : null}
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{m.errorTitle}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          className="flex min-w-0 flex-col gap-4"
          aria-label={m.clipsTitle}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{m.clipsTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {m.clipsDescription}
              </p>
            </div>
            {state.removed ? (
              <Button
                type="button"
                variant="outline"
                disabled={!!state.busy}
                onClick={state.undo}
              >
                <Undo2 data-icon="inline-start" aria-hidden="true" />
                {m.undoButton}
              </Button>
            ) : null}
          </div>
          {state.clips.length ? (
            state.clips.map((clip, index) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                index={index}
                count={state.clips.length}
                messages={m}
                disabled={!!state.busy}
                playing={state.preview.playing === clip.id}
                onRange={(range) => state.update(clip.id, range)}
                onMove={(direction) => state.move(index, direction)}
                onRemove={() => state.remove(index)}
                onDuplicate={() => state.duplicate(index)}
                onPlay={() => {
                  outputAudio.current?.pause()
                  void state.preview.play(clip)
                }}
                onStop={state.preview.stop}
              />
            ))
          ) : (
            <Empty className="min-h-64 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Scissors aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>{m.emptyTitle}</EmptyTitle>
                <EmptyDescription>{m.emptyDescription}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>
        <div className="min-w-0">
          <ExportCard
            audioRef={outputAudio}
            messages={m}
            disabled={!state.valid || !!state.busy}
            exporting={state.busy === "exporting"}
            duration={state.duration}
            count={state.clips.length}
            name={state.name}
            settings={state.settings}
            onSettings={state.setSettings}
            progress={state.progress}
            onCancel={state.cancelExport}
            estimatedBytes={state.estimatedBytes}
            language={language}
            result={state.result}
            onName={state.setName}
            onExport={state.exportAudio}
            onPlay={state.preview.stop}
          />
        </div>
      </div>
    </div>
  )
}

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { TriangleAlert } from "@workspace/ui/icons"

import { AddCard } from "./components/add-card"
import { ContentsCard } from "./components/contents-card"
import { CreateCard } from "./components/create-card"
import { useZipCreator } from "./use-zip-creator"
import { useZipDrag } from "./use-zip-drag"

import type { Messages } from "./types"

export default function ZipCreator({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  const creator = useZipCreator(m)
  const drag = useZipDrag(creator)
  return (
    <div className="flex flex-col gap-6">
      <AddCard creator={creator} messages={m} drag={drag} />
      {creator.error && creator.error !== m.createError ? (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{m.errorTitle}</AlertTitle>
          <AlertDescription>{creator.error}</AlertDescription>
        </Alert>
      ) : null}
      <div aria-live="polite" aria-atomic="true" className="empty:hidden">
        {creator.notice ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm">
            <p className="min-w-0 flex-1">{creator.notice}</p>
            {creator.canUndo ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-11"
                disabled={creator.status !== null}
                onClick={creator.undo}
              >
                {m.undo}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      <ContentsCard creator={creator} messages={m} lang={lang} drag={drag} />
      <CreateCard creator={creator} messages={m} lang={lang} />
    </div>
  )
}

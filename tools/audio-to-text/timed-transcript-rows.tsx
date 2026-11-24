import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Play } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"
import { timestamp } from "./core/transcript"
import type { Segment } from "./core/transcript"
import type { Messages } from "./types"
import type { RefObject } from "react"

const PLAYBACK_EVENTS = ["play", "pause", "timeupdate", "seeking", "ended"]

function findCurrentSegment(segments: Segment[], milliseconds: number) {
  for (let index = segments.length - 1; index >= 0; index--) {
    const { start, end } = segments[index]!
    if (start <= milliseconds && milliseconds < end) return index
  }
  return -1
}

export function TimedTranscriptRows({
  messages: m,
  segments,
  audioRef,
  transcribing,
  onEdit,
}: {
  messages: Messages
  segments: Segment[]
  audioRef: RefObject<HTMLAudioElement | null>
  transcribing: boolean
  onEdit: (index: number, text: string) => void
}) {
  const [currentSegment, setCurrentSegment] = useState(-1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateCurrentSegment = () => {
      const time = audio.currentTime * 1000
      const index =
        audio.ended || (audio.paused && time === 0)
          ? -1
          : findCurrentSegment(segments, time)
      setCurrentSegment(index)
    }

    updateCurrentSegment()
    for (const event of PLAYBACK_EVENTS) {
      audio.addEventListener(event, updateCurrentSegment)
    }
    return () => {
      for (const event of PLAYBACK_EVENTS) {
        audio.removeEventListener(event, updateCurrentSegment)
      }
    }
  }, [audioRef, segments])

  function playFrom(milliseconds: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = milliseconds / 1000
    void audio.play().catch(() => audio.focus())
  }

  return (
    <ol className="max-h-[36rem] divide-y overflow-y-auto">
      {segments.map(({ start, end, text }, index) => {
        const time = timestamp(start)
        const current = index === currentSegment
        return (
          <li
            key={`${start}-${end}-${index}`}
            className={cn(
              "grid items-start gap-x-2 border-s-2 border-s-transparent px-3 py-1.5 sm:grid-cols-[auto_minmax(0,1fr)]",
              current && "border-s-primary bg-muted"
            )}
          >
            <Button
              type="button"
              size="sm"
              variant="ghost"
              dir="ltr"
              className={cn(
                "h-auto justify-self-start py-2 font-mono text-xs leading-5 tabular-nums",
                !current && "text-muted-foreground"
              )}
              aria-label={m.playFrom.replace("{time}", time)}
              aria-current={current ? "time" : undefined}
              onClick={() => playFrom(start)}
            >
              <Play data-icon="inline-start" aria-hidden="true" />
              {time}
            </Button>
            {transcribing ? (
              <p
                dir="auto"
                className="min-w-0 border border-transparent px-2.5 py-2 text-start text-base leading-5 wrap-anywhere md:text-sm"
              >
                {text}
              </p>
            ) : (
              <Textarea
                aria-label={m.editSegment.replace("{time}", time)}
                dir="auto"
                rows={1}
                className="min-h-9 min-w-0 resize-y border-transparent text-start leading-5 hover:bg-muted/40 supports-[field-sizing:content]:resize-none dark:bg-transparent"
                value={text}
                onChange={(event) => onEdit(index, event.currentTarget.value)}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

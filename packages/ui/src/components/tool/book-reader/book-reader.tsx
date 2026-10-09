import { useCallback, useEffect, useId, useRef, useState } from "react"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { DocumentNumberInput } from "@workspace/ui/components/tool/document-number-input"
import {
  ArrowLeftRight,
  Undo2,
  ChevronLeft,
  ChevronRight,
  List,
  Minus,
  Plus,
} from "@workspace/ui/icons"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import type { ReadingLocation } from "@workspace/ui/lib/reading-location"
import { cn } from "@workspace/ui/lib/utils"
import { BookHeader } from "./book-header"
import { ChapterFrame } from "./chapter-frame"
import { Contents } from "./contents"
import { useChapter } from "./use-chapter"
import type {
  Destination,
  BookReaderMessages,
  ReadingBook,
} from "@workspace/ui/lib/book-reader"

export function BookReader({
  book,
  messages: m,
}: {
  book: ReadingBook
  messages: BookReaderMessages
}) {
  const { parsed } = book
  const navigation = useRef(0)
  useEffect(
    () => () => {
      navigation.current++
    },
    [book]
  )
  const contentsId = useId()
  const contentsButton = useRef<HTMLButtonElement>(null)
  const [destination, setDestination] = useState<Destination>(() => ({
    index: Math.max(
      0,
      parsed.sections.findIndex((section) => section.linear !== "no")
    ),
  }))
  const [history, setHistory] = useState<Destination[]>([])
  const [contents, setContents] = useState(false)
  const [size, setSize] = useState(18)
  const [wide, setWide] = useState(false)
  const [blockedLink, setBlockedLink] = useState(false)
  const [coverFailed, setCoverFailed] = useState(false)
  const { index } = destination
  const chapter = useChapter(book, index)
  const go = useCallback(
    (next: Destination | null) => {
      navigation.current++
      if (!next || next.index < 0 || next.index >= parsed.sections.length) {
        setBlockedLink(true)
        return
      }
      setBlockedLink(false)
      setDestination(next)
      setContents(false)
    },
    [parsed]
  )
  const follow = useCallback(
    async (href: string, position?: ReadingLocation) => {
      const request = ++navigation.current
      try {
        const resolved = position
          ? (parsed.sections[index]!.resolveHref?.(href) ?? href)
          : href
        if (/^https?:\/\//i.test(resolved)) {
          window.open(resolved, "_blank", "noopener,noreferrer")
          return
        }
        const next = await parsed.resolveHref(resolved)
        if (request !== navigation.current) return
        if (
          position &&
          m.returnToText &&
          next &&
          next.index >= 0 &&
          next.index < parsed.sections.length
        )
          setHistory((entries) => [...entries, { index, position }])
        go(next)
        if (!position) contentsButton.current?.focus()
      } catch {
        if (request === navigation.current) setBlockedLink(true)
      }
    },
    [parsed, index, go, m.returnToText]
  )
  const toc = parsed.toc?.length
    ? parsed.toc
    : parsed.sections.map((section, number) => ({
        label: m.chapterFallback.replace("{number}", String(number + 1)),
        href: section.id,
      }))
  let previous = index - 1
  while (previous >= 0 && parsed.sections[previous]!.linear === "no") previous--
  const next = parsed.sections.findIndex(
    (section, position) => position > index && section.linear !== "no"
  )
  return (
    <>
      <BookHeader
        book={book}
        messages={m}
        onCoverError={() => setCoverFailed(true)}
      />
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b p-2">
        <div className="flex items-center gap-1">
          <DocumentIconButton
            ref={contentsButton}
            label={contents ? m.closeContents : m.contents}
            aria-expanded={contents}
            aria-controls={contents ? contentsId : undefined}
            onClick={() => setContents(!contents)}
          >
            <List aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.previous}
            disabled={previous < 0}
            onClick={() => go({ index: previous })}
          >
            <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
          </DocumentIconButton>
          <DocumentNumberInput
            aria-label={m.chapter}
            className="w-16"
            value={index + 1}
            min={1}
            max={parsed.sections.length}
            onCommit={(value) => go({ index: value - 1 })}
          />
          <span className="text-sm text-muted-foreground tabular-nums">
            {m.chapterCount.replace("{total}", String(parsed.sections.length))}
          </span>
          <DocumentIconButton
            label={m.next}
            disabled={next < 0}
            onClick={() => go({ index: next })}
          >
            <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
          </DocumentIconButton>
        </div>
        <div className="flex items-center gap-1">
          {m.returnToText && history.length ? (
            <DocumentIconButton
              label={m.returnToText}
              onClick={() => {
                go(history[history.length - 1]!)
                setHistory((entries) => entries.slice(0, -1))
              }}
            >
              <Undo2 aria-hidden="true" className="rtl:rotate-180" />
            </DocumentIconButton>
          ) : null}
          <DocumentIconButton
            label={m.smallerText}
            disabled={size <= 14}
            onClick={() => {
              setContents(false)
              setSize(size - 2)
            }}
          >
            <Minus aria-hidden="true" />
          </DocumentIconButton>
          <span
            aria-label={m.textSize}
            className="w-12 text-center text-sm tabular-nums"
          >
            {Math.round((size / 18) * 100)}%
          </span>
          <DocumentIconButton
            label={m.largerText}
            disabled={size >= 32}
            onClick={() => {
              setContents(false)
              setSize(size + 2)
            }}
          >
            <Plus aria-hidden="true" />
          </DocumentIconButton>
          <DocumentIconButton
            label={m.readingWidth}
            aria-pressed={wide}
            onClick={() => {
              setContents(false)
              setWide(!wide)
            }}
          >
            <ArrowLeftRight aria-hidden="true" />
          </DocumentIconButton>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {contents ? (
          <aside
            id={contentsId}
            aria-label={m.contents}
            className="absolute inset-0 bg-background sm:static sm:w-64 sm:shrink-0"
            onKeyDown={(event) => {
              if (event.key !== "Escape") return
              event.preventDefault()
              event.stopPropagation()
              setContents(false)
              contentsButton.current?.focus()
            }}
          >
            <Contents
              items={toc}
              label={m.contents}
              onSelect={(href) => follow(href)}
            />
          </aside>
        ) : null}
        <div
          className={cn(
            "min-h-0 min-w-0 flex-1",
            contents && "hidden sm:block"
          )}
          aria-busy={!chapter}
        >
          {!chapter ? (
            <p
              role="status"
              className="flex items-center justify-center gap-2 p-6"
            >
              <Spinner />
              {m.loadingChapter}
            </p>
          ) : chapter.error ? (
            <p role="alert" className="p-6">
              {m[chapter.error]}
            </p>
          ) : (
            <ChapterFrame
              html={chapter.html!}
              title={m.reader}
              size={size}
              wide={wide}
              destination={destination}
              onLink={(href, position) => follow(href, position)}
              onResourceError={() => setCoverFailed(true)}
            />
          )}
        </div>
      </div>
      {book.missing || chapter?.limited || blockedLink || coverFailed ? (
        <p
          role="status"
          className="shrink-0 border-t px-4 py-2 text-xs text-muted-foreground"
        >
          {blockedLink
            ? m.blockedLink
            : book.missing || coverFailed
              ? m.missingContent
              : m.limitedContent}
        </p>
      ) : null}
    </>
  )
}

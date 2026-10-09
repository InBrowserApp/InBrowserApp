import { useState } from "react"
import type {
  ReadingBook,
  BookReaderMessages,
} from "@workspace/ui/lib/book-reader"

export function BookHeader({
  book,
  messages: m,
  onCoverError,
}: {
  book: ReadingBook
  messages: BookReaderMessages
  onCoverError: () => void
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
      {book.cover && !failed ? (
        <img
          src={book.cover}
          alt={m.cover}
          width={32}
          height={48}
          onError={() => {
            setFailed(true)
            onCoverError()
          }}
          className="h-12 w-8 shrink-0 object-contain"
        />
      ) : null}
      <div className="min-w-0 flex-1" dir="auto">
        <h2 className="line-clamp-2 text-sm font-medium" title={book.title}>
          {book.title}
        </h2>
        {book.author ? (
          <p
            className="truncate text-xs text-muted-foreground"
            title={book.author}
          >
            {book.author}
          </p>
        ) : null}
        {book.description && m.description ? (
          <details className="mt-1 text-xs">
            <summary className="cursor-pointer text-muted-foreground">
              {m.description}
            </summary>
            <p className="max-h-32 overflow-auto pt-2 whitespace-pre-line">
              {book.description}
            </p>
          </details>
        ) : null}
      </div>
    </div>
  )
}

import { useEffect, useRef } from "react"
import type { PageLayout } from "rtf-viewer"
import type { Match } from "./page-text"
import type { Messages } from "./types"

export function TextLayer({
  page,
  match,
  messages: m,
}: {
  page: PageLayout
  match?: Match
  messages: Messages
}) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    root.current
      ?.querySelector("[data-match]")
      ?.scrollIntoView({ block: "center", inline: "nearest" })
  }, [match])
  let offset = 0
  return (
    <div
      ref={root}
      role="document"
      className="rtf-text-layer absolute inset-0 select-text"
      aria-label={m.pageLabel.replace("{page}", String(page.index + 1))}
    >
      {page.lines.map((line, lineIndex) => {
        const fragments = line.fragments.map((fragment, index) => {
          if (fragment.kind === "image")
            return (
              <span
                key={index}
                role="img"
                aria-label={m.image}
                className="absolute"
                style={{
                  left: fragment.x,
                  top: fragment.y,
                  width: fragment.width,
                  height: fragment.height,
                }}
              />
            )
          const start = offset
          offset += fragment.text.length
          const selected =
            match &&
            match.page === page.index + 1 &&
            match.end > start &&
            match.start < offset
          const left = selected ? Math.max(0, match.start - start) : 0
          const right = selected
            ? Math.min(fragment.text.length, match.end - start)
            : 0
          return (
            <span
              key={index}
              className="absolute whitespace-pre text-transparent"
              style={{
                font: fragment.font,
                left: fragment.x,
                top: fragment.y,
                height: fragment.height,
                lineHeight: `${fragment.height}px`,
              }}
            >
              {selected ? (
                <>
                  {fragment.text.slice(0, left)}
                  <mark
                    data-match
                    className="bg-yellow-300/50 text-transparent"
                  >
                    {fragment.text.slice(left, right)}
                  </mark>
                  {fragment.text.slice(right)}
                </>
              ) : (
                fragment.text
              )}
            </span>
          )
        })
        offset++
        return (
          <div key={lineIndex}>
            {fragments}
            <span className="absolute whitespace-pre" aria-hidden="true">
              {"\n"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

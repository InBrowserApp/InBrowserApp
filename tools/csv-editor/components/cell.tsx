import { useRef } from "react"

function focusAtEnd(input: HTMLTextAreaElement | null) {
  if (!input) return
  input.focus({ preventScroll: true })
  input.setSelectionRange(input.value.length, input.value.length)
}

export function CellEditor({
  value,
  label,
  finish,
}: {
  value: string
  label: string
  finish: (value: string, restoreFocus?: boolean) => void
}) {
  const settled = useRef(false)

  function done(text: string, restoreFocus?: boolean) {
    if (settled.current) return
    settled.current = true
    // Textareas normalize CR and CRLF. Leaving the cell alone keeps its original value.
    finish(text === value.replace(/\r\n?/g, "\n") ? value : text, restoreFocus)
  }

  return (
    <textarea
      ref={focusAtEnd}
      rows={1}
      aria-label={label}
      dir="auto"
      spellCheck={false}
      defaultValue={value}
      onBlur={(event) => done(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) return
        if (
          event.key === "Escape" ||
          (event.key === "Enter" && !event.shiftKey)
        ) {
          event.preventDefault()
          done(event.key === "Escape" ? value : event.currentTarget.value, true)
        }
      }}
      className="block field-sizing-content min-h-9 w-full resize-none bg-background px-2.5 py-1.5 text-base outline-2 -outline-offset-2 outline-ring sm:text-sm"
    />
  )
}

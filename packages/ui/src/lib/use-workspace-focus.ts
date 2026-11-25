import { useCallback, useEffect, useRef, useState } from "react"

export function useWorkspaceFocus() {
  const frame = useRef<HTMLDialogElement>(null)
  const focusButton = useRef<HTMLButtonElement>(null)
  const [focused, setFocused] = useState(false)

  const changeFocus = useCallback((next: boolean) => {
    const dialog = frame.current!
    dialog.close()
    if (next) dialog.showModal()
    else dialog.show()
    setFocused(next)
    focusButton.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!focused) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [focused])

  return { frame, focusButton, focused, changeFocus }
}

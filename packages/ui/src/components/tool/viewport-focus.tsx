import { Maximize2, Minimize2 } from "../../icons"
import { cn } from "../../lib/utils"
import { DocumentIconButton } from "./document-icon-button"
import type { useWorkspaceFocus } from "../../lib/use-workspace-focus"
import type { ReactNode } from "react"

type Focus = ReturnType<typeof useWorkspaceFocus>

export function ViewportFrame({
  hidden,
  label,
  focus,
  children,
}: {
  hidden?: boolean
  label: string
  focus: Focus
  children: ReactNode
}) {
  return (
    <dialog
      ref={focus.frame}
      open
      hidden={hidden}
      aria-label={label}
      aria-modal={focus.focused || undefined}
      onCancel={(event) => {
        event.preventDefault()
        focus.changeFocus(false)
      }}
      className={cn(
        "group/viewport m-0 flex w-full max-w-none min-w-0 flex-col overflow-hidden bg-background p-0 text-foreground",
        focus.focused
          ? "fixed inset-0 h-dvh max-h-none border-0"
          : "relative rounded-lg border"
      )}
      data-focus={focus.focused || undefined}
    >
      {children}
    </dialog>
  )
}

export function ViewportFocusButton({
  focus,
  messages,
}: {
  focus: Focus
  messages: { focus: string; exitFocus: string }
}) {
  return (
    <DocumentIconButton
      ref={focus.focusButton}
      label={focus.focused ? messages.exitFocus : messages.focus}
      aria-pressed={focus.focused}
      onClick={() => focus.changeFocus(!focus.focused)}
    >
      {focus.focused ? (
        <Minimize2 aria-hidden="true" />
      ) : (
        <Maximize2 aria-hidden="true" />
      )}
    </DocumentIconButton>
  )
}

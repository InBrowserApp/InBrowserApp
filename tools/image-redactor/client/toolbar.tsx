import { Button } from "@workspace/ui/components/ui/button"
import {
  Circle,
  MousePointer2,
  Paintbrush,
  Redo2,
  Square,
  Trash2,
  Undo2,
} from "@workspace/ui/icons"
import type { Messages } from "../types"
import type { Editor } from "./use-editor"

export function Toolbar({
  editor,
  messages,
}: {
  editor: Editor
  messages: Messages
}) {
  const choices = [
    ["select", MousePointer2],
    ["rectangle", Square],
    ["ellipse", Circle],
    ["brush", Paintbrush],
  ] as const
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
      <div
        role="group"
        aria-label={messages.toolsLabel}
        className="flex flex-wrap gap-1"
      >
        {choices.map(([tool, Icon]) => (
          <Button
            key={tool}
            type="button"
            size="sm"
            variant={editor.tool === tool ? "secondary" : "ghost"}
            aria-pressed={editor.tool === tool}
            onClick={() => {
              editor.setTool(tool)
              if (tool !== "select") editor.setSelectedId(null)
            }}
          >
            <Icon aria-hidden="true" />
            {messages[tool]}
          </Button>
        ))}
      </div>
      <div className="flex gap-1">
        {[
          {
            label: messages.undo,
            Icon: Undo2,
            action: editor.undo,
            disabled: !editor.canUndo,
          },
          {
            label: messages.redo,
            Icon: Redo2,
            action: editor.redo,
            disabled: !editor.canRedo,
          },
          {
            label: messages.deleteSelected,
            Icon: Trash2,
            action: editor.remove,
            disabled: !editor.selected,
          },
        ].map(({ label, Icon, action, disabled }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={action}
          >
            <Icon aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  )
}

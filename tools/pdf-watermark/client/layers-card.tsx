import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ImageUp,
  Plus,
  Redo2,
  Trash2,
  TriangleAlert,
  Undo2,
} from "@workspace/ui/icons"
import type { Messages, PreparedLayer } from "../types"

function LayersCard({
  items,
  selectedId,
  messages: m,
  onSelect,
  onAdd,
  onDuplicate,
  onDelete,
  onOrder,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  disabled,
}: Readonly<{
  items: readonly PreparedLayer[]
  selectedId: string
  messages: Messages
  disabled: boolean
  onSelect: (id: string) => void
  onAdd: (kind: "text" | "image") => void
  onDuplicate: () => void
  onDelete: () => void
  onOrder: (direction: number) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}>) {
  const index = items.findIndex((item) => item.layer.id === selectedId)
  const limit = items.length >= 10
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{m.layersTitle}</CardTitle>
          <div className="flex gap-1">
            <Button
              size="icon-sm"
              variant="outline"
              type="button"
              aria-label={m.undo}
              title={m.undo}
              disabled={disabled || !canUndo}
              onClick={onUndo}
            >
              <Undo2 aria-hidden="true" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              type="button"
              aria-label={m.redo}
              title={m.redo}
              disabled={disabled || !canRedo}
              onClick={onRedo}
            >
              <Redo2 aria-hidden="true" />
            </Button>
          </div>
        </div>
        <CardDescription>{m.layersDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            type="button"
            className="h-auto min-h-9 whitespace-normal"
            disabled={disabled || limit}
            onClick={() => onAdd("text")}
          >
            <Plus aria-hidden="true" />
            {m.addText}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="h-auto min-h-9 whitespace-normal"
            disabled={disabled || limit}
            onClick={() => onAdd("image")}
          >
            <ImageUp aria-hidden="true" />
            {m.addImage}
          </Button>
        </div>
        {items.length ? (
          <ol
            className="max-h-60 space-y-1 overflow-y-auto overscroll-contain"
            aria-label={m.layersTitle}
          >
            {[...items].reverse().map((item, reverseIndex) => {
              const index = items.length - reverseIndex
              const name = m.layerName.replace("{index}", String(index))
              const invalid =
                item.rangeError ||
                (item.error ? m[item.error as keyof Messages] : "") ||
                (!item.preparing && !item.mark ? m.layerNeedsContent : "")
              return (
                <li key={item.layer.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={selectedId === item.layer.id}
                    onClick={() => onSelect(item.layer.id)}
                    className="flex w-full min-w-0 items-center gap-2 rounded-lg border p-2 text-start text-sm hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60 aria-pressed:border-primary aria-pressed:bg-primary/5"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.layer.options.kind === "text"
                          ? item.layer.options.text || m.textType
                          : item.layer.image?.file.name || m.chooseImage}
                      </span>
                    </span>
                    {invalid ? (
                      <span
                        role="img"
                        className="shrink-0 text-destructive"
                        title={invalid}
                        aria-label={invalid}
                      >
                        <TriangleAlert aria-hidden="true" className="size-4" />
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="py-2 text-sm text-muted-foreground">{m.emptyLayers}</p>
        )}
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={m.duplicateLayer}
            title={m.duplicateLayer}
            disabled={disabled || index < 0 || limit}
            onClick={onDuplicate}
          >
            <Copy aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={m.deleteLayer}
            title={m.deleteLayer}
            disabled={disabled || index < 0}
            onClick={onDelete}
          >
            <Trash2 aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={m.bringForward}
            title={m.bringForward}
            disabled={disabled || index < 0 || index === items.length - 1}
            onClick={() => onOrder(1)}
          >
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={m.sendBackward}
            title={m.sendBackward}
            disabled={disabled || index <= 0}
            onClick={() => onOrder(-1)}
          >
            <ArrowDown aria-hidden="true" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {m.layersLimit.replace("{count}", "10")}
        </p>
      </CardContent>
    </Card>
  )
}

export { LayersCard }

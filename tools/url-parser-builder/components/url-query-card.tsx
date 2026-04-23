import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Trash2 } from "@workspace/ui/icons"

import type { UrlParserBuilderMessages, UrlQueryRow } from "../types"

type UrlQueryCardProps = Readonly<{
  messages: UrlParserBuilderMessages
  queryRows: readonly UrlQueryRow[]
  onAdd: () => void
  onUpdate: (id: string, field: "key" | "value", value: string) => void
  onRemove: (id: string) => void
}>

function UrlQueryCard({
  messages,
  queryRows,
  onAdd,
  onUpdate,
  onRemove,
}: UrlQueryCardProps) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <CardTitle>{messages.queryTitle}</CardTitle>
          <CardDescription>{messages.queryDescription}</CardDescription>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          {messages.addParamLabel}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {queryRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-5">
            <p className="font-medium">{messages.queryEmptyTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {messages.queryEmptyDescription}
            </p>
          </div>
        ) : null}

        {queryRows.map((row, index) => {
          const keyId = `${row.id}-key`
          const valueId = `${row.id}-value`

          return (
            <div
              key={row.id}
              className="grid gap-3 rounded-2xl border border-border/70 bg-muted/15 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <div className="space-y-2">
                <Label htmlFor={keyId}>
                  {messages.paramKeyLabel} {index + 1}
                </Label>
                <Input
                  id={keyId}
                  value={row.key}
                  placeholder={messages.paramKeyPlaceholder}
                  onChange={(event) => {
                    onUpdate(row.id, "key", event.target.value)
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={valueId}>
                  {messages.paramValueLabel} {index + 1}
                </Label>
                <Input
                  id={valueId}
                  value={row.value}
                  placeholder={messages.paramValuePlaceholder}
                  onChange={(event) => {
                    onUpdate(row.id, "value", event.target.value)
                  }}
                />
              </div>

              <div className="flex items-end justify-end">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={messages.removeParamLabel}
                  onClick={() => {
                    onRemove(row.id)
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export { UrlQueryCard }

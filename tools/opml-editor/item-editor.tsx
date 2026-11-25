import { useId } from "react"
import type { Ref } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  ArrowDown,
  ArrowUp,
  IndentDecrease,
  IndentIncrease,
  List,
  Trash2,
} from "@workspace/ui/icons"
import { isFeed, outlineMoves, outlineName, setOutlineName } from "./xml"
import type { Messages } from "./types"

const actions = {
  moveUp: ArrowUp,
  moveDown: ArrowDown,
  indent: IndentIncrease,
  outdent: IndentDecrease,
} as const

export function ItemEditor({
  node,
  body,
  messages: m,
  onEdit,
  onRemove,
  onBack,
  heading,
}: {
  node: Element
  body: Element
  messages: Messages
  onEdit: (edit: () => void) => void
  onRemove: () => void
  onBack: () => void
  heading: Ref<HTMLHeadingElement>
}) {
  const id = useId()
  const feed = isFeed(node)
  const moves = outlineMoves(node, body)
  return (
    <div className="min-w-0 space-y-4 p-4">
      <Button
        variant="ghost"
        size="sm"
        className="-ms-2 md:hidden"
        onClick={onBack}
      >
        <List data-icon="inline-start" aria-hidden="true" />
        {m.back}
      </Button>
      <h2
        ref={heading}
        tabIndex={-1}
        className="text-base font-semibold focus-visible:outline-ring"
      >
        {feed ? m.feed : m.folder}
      </h2>
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>{m.itemName}</Label>
        <Input
          id={`${id}-name`}
          dir="auto"
          placeholder={m.unnamed}
          value={outlineName(node)}
          onChange={(event) =>
            onEdit(() => setOutlineName(node, event.target.value))
          }
        />
      </div>
      {feed && (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${id}-feed`}>{m.feedUrl}</Label>
            <Input
              id={`${id}-feed`}
              type="url"
              dir="ltr"
              value={node.getAttribute("xmlUrl") ?? ""}
              onChange={(event) =>
                onEdit(() => node.setAttribute("xmlUrl", event.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-site`}>{m.siteUrl}</Label>
            <Input
              id={`${id}-site`}
              type="url"
              dir="ltr"
              value={node.getAttribute("htmlUrl") ?? ""}
              onChange={(event) =>
                onEdit(() => {
                  if (event.target.value)
                    node.setAttribute("htmlUrl", event.target.value)
                  else node.removeAttribute("htmlUrl")
                })
              }
            />
          </div>
        </>
      )}
      <div className="flex flex-wrap items-center gap-1.5 border-t pt-3">
        {(Object.keys(actions) as (keyof typeof actions)[]).map((key) => {
          const Icon = actions[key]
          const move = moves[key]
          return (
            <Button
              key={key}
              variant="outline"
              size="icon"
              title={m[key]}
              aria-label={m[key]}
              disabled={!move}
              onClick={() => move && onEdit(move)}
            >
              <Icon
                className={
                  key === "indent" || key === "outdent"
                    ? "rtl:-scale-x-100"
                    : undefined
                }
                aria-hidden="true"
              />
            </Button>
          )
        })}
        <Button
          variant="ghost"
          size="sm"
          className="ms-auto text-destructive"
          onClick={onRemove}
        >
          <Trash2 data-icon="inline-start" aria-hidden="true" />
          {m.remove}
        </Button>
      </div>
    </div>
  )
}

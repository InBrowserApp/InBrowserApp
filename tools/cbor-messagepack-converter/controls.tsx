import { Card, CardContent } from "@workspace/ui/components/ui/card"
import type { BinaryFormat } from "./core/typed-json"
import type { Representation } from "./core/bytes"
import type { Messages } from "./types"

const SELECT_CLASS =
  "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base shadow-xs sm:text-sm focus-visible:outline-2 focus-visible:outline-ring"

type Props = {
  id: string
  m: Messages
  format: BinaryFormat
  direction: "encode" | "decode"
  representation: Representation
  extended: boolean
  onFormat: (value: BinaryFormat) => void
  onDirection: (value: "encode" | "decode") => void
  onRepresentation: (value: Representation) => void
  onExtended: (value: boolean) => void
}

export function Controls({
  id,
  m,
  format,
  direction,
  representation,
  extended,
  onFormat,
  onDirection,
  onRepresentation,
  onExtended,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2 text-sm font-medium">
            <label className="block" htmlFor={`${id}-format`}>
              {m.format}
            </label>
            <select
              id={`${id}-format`}
              name="format"
              className={SELECT_CLASS}
              value={format}
              onChange={(event) => onFormat(event.target.value as BinaryFormat)}
            >
              <option value="cbor">CBOR</option>
              <option value="msgpack">MessagePack</option>
            </select>
          </div>
          <div className="space-y-2 text-sm font-medium">
            <label className="block" htmlFor={`${id}-direction`}>
              {m.direction}
            </label>
            <select
              id={`${id}-direction`}
              name="direction"
              className={SELECT_CLASS}
              value={direction}
              onChange={(event) =>
                onDirection(event.target.value as "encode" | "decode")
              }
            >
              <option value="encode">{m.encode}</option>
              <option value="decode">{m.decode}</option>
            </select>
          </div>
          <div className="space-y-2 text-sm font-medium">
            <label className="block" htmlFor={`${id}-representation`}>
              {m.representation}
            </label>
            <select
              id={`${id}-representation`}
              name="representation"
              className={SELECT_CLASS}
              value={representation}
              onChange={(event) =>
                onRepresentation(event.target.value as Representation)
              }
            >
              <option value="hex">Hex</option>
              <option value="base64">Base64</option>
              <option value="base64url">Base64URL</option>
            </select>
          </div>
        </div>
        <label
          aria-label={m.extended}
          className="flex items-start gap-3 text-sm"
          htmlFor={`${id}-extended`}
        >
          <input
            className="mt-1 size-4 shrink-0 accent-primary"
            id={`${id}-extended`}
            type="checkbox"
            checked={extended}
            disabled={direction === "decode"}
            onChange={(event) => onExtended(event.target.checked)}
          />
          <span>
            <span className="font-medium">{m.extended}</span>
            <span className="mt-1 block text-muted-foreground">
              {m.extendedHelp}
            </span>
          </span>
        </label>
      </CardContent>
    </Card>
  )
}

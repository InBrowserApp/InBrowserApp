import { useId } from "react"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { MODELS } from "./models"
import type { ModelId } from "./models"
import type { Messages } from "./types"

const modelIds = Object.keys(MODELS) as ModelId[]

export function ModelPicker({
  messages: m,
  lang,
  model,
  disabled,
  onChange,
}: {
  messages: Messages
  lang: string
  model: ModelId
  disabled: boolean
  onChange: (model: ModelId) => void
}) {
  const id = useId()
  const number = new Intl.NumberFormat(lang)
  const megabytes = new Intl.NumberFormat(lang, {
    style: "unit",
    unit: "megabyte",
    unitDisplay: "short",
  })
  const selected = MODELS[model]
  const selectedSize = Object.values(selected.sizes)
    .map((mb) => number.format(mb))
    .join("–")
  const [sizePrefix, sizeSuffix] = m.modelSize.split("{size}")

  function compactSize(sizes: number[]) {
    const min = Math.min(...sizes)
    const max = Math.max(...sizes)
    const size = megabytes.format(max)
    return min === max ? size : `${number.format(min)}–${size}`
  }

  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>{m.model}</Label>
      <Select
        value={model}
        disabled={disabled}
        dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
        onValueChange={(value) => onChange(value as ModelId)}
      >
        <SelectTrigger
          id={id}
          className="w-full min-w-0 px-2.5 text-start whitespace-normal data-[size=default]:h-auto data-[size=default]:min-h-10 *:data-[slot=select-value]:line-clamp-none"
        >
          <SelectValue>
            <span className="grid min-w-0 gap-0.5">
              <bdi className="font-medium wrap-break-word">{selected.name}</bdi>
              <span className="text-xs leading-5 text-muted-foreground">
                {sizePrefix}
                <bdi dir="ltr" className="whitespace-nowrap">
                  {selectedSize}
                </bdi>
                {sizeSuffix?.replace(/^ /, "\u00a0")}
              </span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          position="popper"
          align="start"
          aria-label={m.model}
          className="w-(--radix-select-trigger-width) min-w-0 p-1 text-start"
        >
          {modelIds.map((key) => (
            <SelectItem
              key={key}
              value={key}
              textValue={MODELS[key].name}
              className="items-start p-2 pe-8 [&>span:first-child]:end-2 [&>span:first-child]:top-2.5 rtl:[&>span:first-child]:right-auto [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
            >
              <span className="grid w-full min-w-0 gap-0.5">
                <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <bdi className="font-medium wrap-break-word">
                    {MODELS[key].name}
                  </bdi>
                  <bdi dir="ltr" className="text-xs text-muted-foreground">
                    {compactSize(Object.values(MODELS[key].sizes))}
                  </bdi>
                </span>
                <span className="text-xs leading-4">{m[`${key}Help`]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

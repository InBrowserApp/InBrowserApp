import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Search } from "@workspace/ui/icons"

import type { AsciiArtOptions } from "../core/generate-ascii-art"
import type { AsciiArtGeneratorMessages } from "../types"

type OptionsCardProps = Readonly<{
  alignSelectId: string
  fontQuery: string
  fontSearchId: string
  fontSelectId: string
  fontNames: readonly string[]
  messages: AsciiArtGeneratorMessages
  options: AsciiArtOptions
  widthInputId: string
  onAlignChange: (value: string) => void
  onFontChange: (value: string) => void
  onFontQueryChange: (value: string) => void
  onWidthChange: (value: string) => void
}>

function OptionsCard({
  alignSelectId,
  fontQuery,
  fontSearchId,
  fontSelectId,
  fontNames,
  messages,
  options,
  widthInputId,
  onAlignChange,
  onFontChange,
  onFontQueryChange,
  onWidthChange,
}: OptionsCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.fontLabel}</CardTitle>
          <CardDescription>{messages.fontDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor={fontSearchId} className="sr-only">
              {messages.fontSearchPlaceholder}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={fontSearchId}
                aria-label={messages.fontSearchPlaceholder}
                value={fontQuery}
                onChange={(event) => {
                  onFontQueryChange(event.target.value)
                }}
                placeholder={messages.fontSearchPlaceholder}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor={fontSelectId} className="sr-only">
              {messages.fontLabel}
            </label>
            <Select value={options.font} onValueChange={onFontChange}>
              <SelectTrigger
                id={fontSelectId}
                aria-label={messages.fontLabel}
                className="w-full"
              >
                <SelectValue placeholder={messages.fontLabel} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {fontNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.optionsLabel}</CardTitle>
          <CardDescription>{messages.optionsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor={alignSelectId}
              className="text-sm font-medium text-foreground"
            >
              {messages.alignLabel}
            </label>
            <Select value={options.align} onValueChange={onAlignChange}>
              <SelectTrigger
                id={alignSelectId}
                aria-label={messages.alignLabel}
                className="w-full"
              >
                <SelectValue placeholder={messages.alignLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">{messages.leftAlign}</SelectItem>
                <SelectItem value="center">{messages.centerAlign}</SelectItem>
                <SelectItem value="right">{messages.rightAlign}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor={widthInputId}
              className="text-sm font-medium text-foreground"
            >
              {messages.widthLabel}
            </label>
            <Input
              id={widthInputId}
              aria-label={messages.widthLabel}
              type="number"
              inputMode="numeric"
              min="40"
              max="160"
              value={options.width}
              onChange={(event) => {
                onWidthChange(event.target.value)
              }}
            />
            <p className="text-sm text-muted-foreground">
              {messages.widthHint}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { OptionsCard }

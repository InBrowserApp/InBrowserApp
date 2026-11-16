import { useId, useRef } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { ImageUp } from "@workspace/ui/icons"
import type { Messages, Options } from "../types"

function ContentFields({
  options,
  onChange,
  messages: m,
  image,
  onImage,
  error,
}: Readonly<{
  options: Options
  onChange: (options: Options) => void
  messages: Messages
  image: File | null
  onImage: (file: File | null) => void
  error: string
}>) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  return (
    <>
      <Field>
        <FieldLabel>{m.typeLabel}</FieldLabel>
        <ToggleGroup
          className="grid w-full grid-cols-2"
          type="single"
          variant="outline"
          value={options.kind}
          aria-label={m.typeLabel}
          onValueChange={(kind) => {
            if (kind) onChange({ ...options, kind: kind as Options["kind"] })
          }}
        >
          <ToggleGroupItem value="text">{m.textType}</ToggleGroupItem>
          <ToggleGroupItem value="image">{m.imageType}</ToggleGroupItem>
        </ToggleGroup>
      </Field>
      {options.kind === "text" ? (
        <>
          <Field data-invalid={Boolean(error) || undefined}>
            <FieldLabel htmlFor={`${id}-text`}>{m.textLabel}</FieldLabel>
            <Textarea
              id={`${id}-text`}
              name="watermark-text"
              autoComplete="off"
              dir="auto"
              maxLength={200}
              rows={2}
              placeholder={m.textPlaceholder}
              value={options.text}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) =>
                onChange({ ...options, text: event.target.value })
              }
            />
            {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
          </Field>
          <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-4">
            <Field>
              <FieldLabel>{m.fontLabel}</FieldLabel>
              <ToggleGroup
                className="grid w-full grid-cols-2"
                type="single"
                variant="outline"
                value={options.font}
                aria-label={m.fontLabel}
                onValueChange={(font) => {
                  if (font)
                    onChange({ ...options, font: font as Options["font"] })
                }}
              >
                <ToggleGroupItem
                  className="h-auto min-h-9 whitespace-normal"
                  value="sans"
                >
                  {m.sansFont}
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="h-auto min-h-9 whitespace-normal"
                  value="serif"
                >
                  {m.serifFont}
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-color`}>{m.colorLabel}</FieldLabel>
              <Input
                className="w-full cursor-pointer p-1"
                id={`${id}-color`}
                name="watermark-color"
                type="color"
                value={options.color}
                onChange={(event) =>
                  onChange({ ...options, color: event.target.value })
                }
              />
            </Field>
          </div>
        </>
      ) : (
        <Field>
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-10 text-center whitespace-normal"
            onClick={() => input.current?.click()}
          >
            <ImageUp aria-hidden="true" />
            {m.chooseImage}
          </Button>
          <input
            ref={input}
            className="hidden"
            aria-label={m.chooseImage}
            id={`${id}-image`}
            name="watermark-image"
            type="file"
            accept="image/png,image/jpeg,.png,.jpg,.jpeg"
            onChange={(event) => {
              onImage(event.target.files?.[0] ?? null)
              event.target.value = ""
            }}
          />
          <FieldDescription>{m.imageDescription}</FieldDescription>
          {image ? <p className="text-sm break-all">{image.name}</p> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      )}
    </>
  )
}

export { ContentFields }

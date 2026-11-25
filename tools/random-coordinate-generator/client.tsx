import { useEffect, useId, useState } from "react"
import type { FormEvent } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Download, RefreshCcw } from "@workspace/ui/icons"

import { generateCoordinates } from "./core/coordinates"
import type { CoordinateRequest } from "./core/coordinates"

export type CoordinateMessages = typeof import("./messages/en.json")

type Props = Readonly<{ lang: string; messages: CoordinateMessages }>
type Result = Readonly<{ request: CoordinateRequest; text: string }>

export default function RandomCoordinateClient({ lang, messages }: Props) {
  const areaId = useId()
  const quantityId = useId()
  const latitudeId = useId()
  const longitudeId = useId()
  const radiusId = useId()
  const [area, setArea] = useState<CoordinateRequest["area"]>("worldwide")
  const [result, setResult] = useState<Result | null>(null)
  const [status, setStatus] = useState<
    "starting" | "idle" | "pending" | "failed"
  >("starting")
  const output = result?.text ?? ""
  const pending = status === "pending"
  const direction = lang === "ar" || lang === "he" ? "rtl" : "ltr"

  useEffect(() => setStatus("idle"), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const form = new FormData(event.currentTarget)
    const request: CoordinateRequest =
      area === "worldwide"
        ? { area }
        : {
            area,
            latitude: Number(form.get("latitude")),
            longitude: Number(form.get("longitude")),
            radius: Number(form.get("radius")),
          }
    const count = Number(form.get("quantity"))
    setStatus("pending")
    try {
      const coordinates = await generateCoordinates(request, count)
      setResult({ request, text: coordinates.join("\n") })
      setStatus("idle")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
        >
          <FieldGroup className="grid items-end gap-4 sm:col-span-2 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={areaId}>{messages.area}</FieldLabel>
              <Select
                dir={direction}
                value={area}
                onValueChange={(value) =>
                  setArea(value as CoordinateRequest["area"])
                }
                disabled={pending}
              >
                <SelectTrigger id={areaId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="worldwide">
                      {messages.worldwide}
                    </SelectItem>
                    <SelectItem value="nearby">{messages.nearby}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor={quantityId}>{messages.quantity}</FieldLabel>
              <Input
                id={quantityId}
                name="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={1000}
                defaultValue={10}
                required
                readOnly={pending}
              />
            </Field>
          </FieldGroup>
          <fieldset
            hidden={area !== "nearby"}
            disabled={area !== "nearby"}
            className="min-w-0 sm:col-span-full"
          >
            <FieldGroup className="grid items-end gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor={latitudeId}>
                  {messages.latitude}
                </FieldLabel>
                <Input
                  id={latitudeId}
                  name="latitude"
                  type="number"
                  inputMode="text"
                  min={-90}
                  max={90}
                  step="any"
                  required
                  readOnly={pending}
                  dir="ltr"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={longitudeId}>
                  {messages.longitude}
                </FieldLabel>
                <Input
                  id={longitudeId}
                  name="longitude"
                  type="number"
                  inputMode="text"
                  min={-180}
                  max={180}
                  step="any"
                  required
                  readOnly={pending}
                  dir="ltr"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={radiusId}>{messages.radius}</FieldLabel>
                <Input
                  id={radiusId}
                  name="radius"
                  type="number"
                  inputMode="decimal"
                  min={0.001}
                  max={20000}
                  step="any"
                  defaultValue={25}
                  required
                  readOnly={pending}
                  dir="ltr"
                />
              </Field>
            </FieldGroup>
          </fieldset>
          <Button
            type="submit"
            disabled={status === "starting"}
            aria-disabled={pending}
            className="aria-disabled:opacity-50 sm:col-start-3"
          >
            <RefreshCcw data-icon="inline-start" />
            {pending ? messages.generating : messages.generate}
          </Button>
          {status === "failed" && (
            <p
              role="alert"
              className="text-sm text-destructive sm:col-span-full"
            >
              {messages.error}
            </p>
          )}
        </form>
      </CardContent>
      <Separator />
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle aria-live="polite" aria-atomic="true">
          <h2 key={result?.text}>
            {messages.results}
            {result && ` · ${messages[result.request.area]}`}
            {result?.request.area === "nearby" && (
              <span className="mt-1 block text-sm font-normal wrap-anywhere text-muted-foreground">
                <bdi dir="ltr">
                  {result.request.latitude}, {result.request.longitude} ·{" "}
                  {result.request.radius} km
                </bdi>
              </span>
            )}
          </h2>
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            key={output}
            value={output}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
            failedLabel={messages.copyFailed}
          />
          {result && (
            <Button asChild variant="outline" size="sm">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(output)}`}
                download="random-coordinates.txt"
              >
                <Download data-icon="inline-start" />
                {messages.download}
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          aria-label={messages.results}
          value={output}
          placeholder={messages.placeholder}
          readOnly
          dir={result ? "ltr" : undefined}
          rows={6}
          className="max-h-[min(24rem,50vh)] resize-y overflow-y-auto font-mono"
        />
      </CardContent>
    </Card>
  )
}

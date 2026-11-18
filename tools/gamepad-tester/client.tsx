import { useMemo } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Check, Gamepad2 } from "@workspace/ui/icons"

import { readSticks } from "./core/stick-rest"
import { StickPlot } from "./stick-plot"
import type { Messages } from "./types"
import { useGamepads } from "./use-gamepads"

function standardButtonLabels(messages: Messages) {
  const face = (direction: string) =>
    messages.faceButton.replace("{direction}", direction)
  const dpad = (direction: string) =>
    messages.dpad.replace("{direction}", direction)
  return [
    face("↓"),
    face("→"),
    face("←"),
    face("↑"),
    messages.leftShoulder,
    messages.rightShoulder,
    messages.leftTrigger,
    messages.rightTrigger,
    messages.back,
    messages.start,
    messages.leftStickClick,
    messages.rightStickClick,
    dpad("↑"),
    dpad("↓"),
    dpad("←"),
    dpad("→"),
    messages.home,
  ]
}

export default function GamepadTester({
  language,
  messages,
}: {
  language: string
  messages: Messages
}) {
  const { gamepad, gamepads, unavailable, check, select, startCheck } =
    useGamepads()
  const formats = useMemo(
    () => ({
      axis: new Intl.NumberFormat(language, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
      percent: new Intl.NumberFormat(language, { style: "percent" }),
      index: new Intl.NumberFormat(language),
    }),
    [language]
  )

  if (!gamepad) {
    return (
      <Card>
        <Empty className="min-h-60" role="status">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-12 [&_svg]:size-6">
              <Gamepad2 aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>
              {unavailable ? messages.unavailable : messages.waiting}
            </EmptyTitle>
            <EmptyDescription>
              {unavailable ? messages.unavailableHelp : messages.connect}
            </EmptyDescription>
            {!unavailable && (
              <p className="mt-2 text-xs/relaxed text-muted-foreground">
                {messages.connectionHelp}
              </p>
            )}
          </EmptyHeader>
        </Empty>
      </Card>
    )
  }

  const standard = gamepad.mapping === "standard"
  const buttonLabels = standard ? standardButtonLabels(messages) : []
  const hasSticks = standard && gamepad.axes.length >= 4
  const firstExtraAxis = hasSticks ? 4 : 0
  const extraAxes = gamepad.axes.slice(firstExtraAxis)
  const running = check?.status === "running"
  const checkStatus = {
    running: messages.checking,
    complete: messages.checkComplete,
    interrupted: messages.checkInterrupted,
  }

  return (
    <div className="grid gap-4">
      <Card size="sm">
        <CardContent className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" role="status">
            <Check aria-hidden="true" />
            {messages.connected}
          </Badge>
          {gamepads.length > 1 ? (
            <label className="flex min-w-0 flex-wrap items-center gap-2 font-medium">
              {messages.controller}
              <select
                className="max-w-full min-w-0 truncate rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                value={gamepad.index}
                onChange={(event) => select(Number(event.target.value))}
              >
                {gamepads.map(({ index, id }) => (
                  <option key={index} value={index}>
                    {formats.index.format(index + 1)} ·{" "}
                    {id || messages.controller}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <bdi className="min-w-0 text-sm font-medium wrap-anywhere">
              {gamepad.id || messages.controller}
            </bdi>
          )}
        </CardContent>
      </Card>

      {!standard && (
        <p className="text-sm text-muted-foreground">{messages.rawHint}</p>
      )}

      <div
        className={
          hasSticks ? "grid items-start gap-4 xl:grid-cols-2" : "grid gap-4"
        }
      >
        {hasSticks && (
          <Card>
            <CardHeader>
              <h2 className="font-heading text-base font-medium">
                {messages.sticks}
              </h2>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {readSticks(gamepad.axes).map((stick, index) => {
                  const result =
                    check?.status === "complete" ? check.result[index] : null
                  const label =
                    index === 0 ? messages.leftStick : messages.rightStick
                  return (
                    <StickPlot
                      key={label}
                      label={label}
                      {...stick}
                      offsetLabel={messages.offset}
                      format={formats.axis}
                    >
                      {result && (
                        <dl className="grid w-full gap-1 border-t pt-2 text-xs">
                          <div className="flex flex-wrap justify-between gap-x-2">
                            <dt className="text-muted-foreground">
                              {messages.average}
                            </dt>
                            <dd className="font-mono tabular-nums">
                              <bdi>{formats.axis.format(result.average)}</bdi>
                            </dd>
                          </div>
                          <div className="flex flex-wrap justify-between gap-x-2">
                            <dt className="text-muted-foreground">
                              {messages.peak}
                            </dt>
                            <dd className="font-mono tabular-nums">
                              <bdi>{formats.axis.format(result.peak)}</bdi>
                            </dd>
                          </div>
                        </dl>
                      )}
                    </StickPlot>
                  )
                })}
              </div>
              <div className="grid justify-items-start gap-2">
                <Button
                  type="button"
                  variant="outline"
                  aria-disabled={running}
                  className="max-w-full whitespace-normal aria-disabled:opacity-60"
                  onClick={() => {
                    if (!running) startCheck(gamepad)
                  }}
                >
                  {messages.check}
                </Button>
                <p role="status" className="text-sm text-muted-foreground">
                  {check ? checkStatus[check.status] : messages.checkHelp}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {gamepad.buttons.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="font-heading text-base font-medium">
                {messages.buttons}
              </h2>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {gamepad.buttons.map(({ pressed, value }, index) => (
                  <li
                    key={index}
                    data-pressed={pressed}
                    className="grid min-w-0 gap-1.5 rounded-md border px-2 py-2 text-xs data-[pressed=true]:border-primary/60 data-[pressed=true]:bg-primary/10"
                  >
                    <span className="font-medium wrap-anywhere">
                      {buttonLabels[index] ??
                        messages.button.replace(
                          "{index}",
                          formats.index.format(index)
                        )}
                    </span>
                    <span className="flex items-center justify-between gap-1 font-mono text-muted-foreground tabular-nums">
                      <bdi>{formats.percent.format(value)}</bdi>
                      {pressed && (
                        <>
                          <Check
                            className="size-3.5 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span className="sr-only">{messages.pressed}</span>
                        </>
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-1 overflow-hidden rounded-full bg-muted"
                    >
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${value * 100}%` }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {extraAxes.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-heading text-base font-medium">
              {messages.axes}
            </h2>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {extraAxes.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-between gap-x-2 rounded-md border px-2 py-2 text-xs"
                >
                  <dt>
                    {messages.axis.replace(
                      "{index}",
                      formats.index.format(firstExtraAxis + index)
                    )}
                  </dt>
                  <dd className="font-mono text-muted-foreground tabular-nums">
                    <bdi>{formats.axis.format(value)}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {!gamepad.buttons.length && !gamepad.axes.length && (
        <p role="status" className="text-sm text-muted-foreground">
          {messages.noInputs}
        </p>
      )}
    </div>
  )
}

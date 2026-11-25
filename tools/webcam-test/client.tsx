import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Camera, CameraOff } from "@workspace/ui/icons"

import { resolutions, useWebcam } from "./use-webcam"

import type English from "./messages/en.json"

const selectStyle =
  "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-ring"

export default function WebcamTest({
  language,
  messages,
}: {
  language: string
  messages: typeof English
}) {
  const webcam = useWebcam()
  const active = webcam.status === "active"
  const starting = webcam.status === "starting"
  const number = new Intl.NumberFormat(language, {
    maximumFractionDigits: 1,
    useGrouping: false,
  })

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
        <video
          ref={webcam.video}
          aria-label={messages.preview}
          aria-hidden={!active}
          className={
            active ? "size-full bg-black object-contain" : "invisible size-full"
          }
          autoPlay
          muted
          playsInline
          onLoadedMetadata={webcam.updateSize}
          onResize={webcam.updateSize}
        />
        {!active && (
          <div className="absolute inset-0 grid place-content-center justify-items-center gap-3 p-5 text-center text-sm text-muted-foreground">
            <Camera className="size-8" aria-hidden="true" />
            <p role={starting ? "status" : undefined}>
              {starting ? messages.starting : messages.previewHint}
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{messages.videoDetails}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-2 gap-3">
            <div className="min-w-0 space-y-1">
              <dt className="text-sm text-muted-foreground">
                {messages.actualResolution}
              </dt>
              <dd className="font-medium tabular-nums">
                {webcam.videoSize ? (
                  <bdi dir="ltr">
                    {number.format(webcam.videoSize.width)} ×{" "}
                    {number.format(webcam.videoSize.height)}
                  </bdi>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="min-w-0 space-y-1">
              <dt className="text-sm text-muted-foreground">
                {webcam.frameRate?.reported
                  ? messages.reportedFps
                  : messages.previewFps}
              </dt>
              <dd className="font-medium tabular-nums">
                {webcam.frameRate?.value !== undefined ? (
                  <bdi dir="ltr">
                    {number.format(webcam.frameRate.value)} FPS
                  </bdi>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>

          {webcam.devices.length > 1 && (
            <label className="grid gap-1.5 text-sm font-medium">
              {messages.camera}
              <select
                className={selectStyle}
                value={webcam.device}
                onChange={(event) =>
                  webcam.chooseDevice(event.currentTarget.value)
                }
              >
                <option value="">{messages.defaultCamera}</option>
                {webcam.devices.map(({ deviceId, label }, index) => (
                  <option key={deviceId} value={deviceId}>
                    {label ||
                      messages.cameraOption.replace(
                        "{number}",
                        number.format(index + 1)
                      )}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="grid gap-1.5 text-sm font-medium">
            {messages.requestedResolution}
            <select
              className={selectStyle}
              value={webcam.requested}
              onChange={(event) =>
                webcam.chooseResolution(
                  event.currentTarget.value as keyof typeof resolutions
                )
              }
            >
              <option value="720">720p</option>
              <option value="1080">1080p</option>
              <option value="2160">4K (2160p)</option>
            </select>
          </label>

          <Button
            className="min-h-10 w-full"
            type="button"
            aria-disabled={starting || undefined}
            onClick={() => {
              if (active) webcam.stop()
              else if (!starting) void webcam.start()
            }}
          >
            {active ? (
              <CameraOff aria-hidden="true" />
            ) : (
              <Camera aria-hidden="true" />
            )}
            {active
              ? messages.stop
              : starting
                ? messages.starting
                : messages.start}
          </Button>
          {webcam.status === "error" && (
            <p role="alert" className="text-sm text-destructive">
              {messages.cameraError}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

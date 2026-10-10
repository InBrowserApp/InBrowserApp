import type {
  RasterInfo,
  RasterPreview,
  RasterImageMessages,
} from "./raster-image-types"

export function RasterImageDetails({
  preview,
  info,
  messages: m,
  hint,
}: {
  preview: RasterPreview
  info: RasterInfo
  messages: RasterImageMessages
  hint: string
}) {
  return (
    <div className="shrink-0 border-t px-3 py-2 text-xs text-muted-foreground">
      <details className="max-h-36 overflow-auto">
        <summary className="cursor-pointer">
          {info.format} ·{" "}
          <span dir="ltr">
            {preview.width} × {preview.height} px
          </span>
          <span className="sr-only"> — {m.details}</span>
        </summary>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt>{m.detectedFormat}</dt>
          <dd>{info.format}</dd>
          <dt>{m.dimensions}</dt>
          <dd dir="ltr">
            {preview.width} × {preview.height} px
          </dd>
          {preview.delay > 0 ? (
            <>
              <dt>{m.duration}</dt>
              <dd>
                {m.milliseconds.replace("{value}", String(preview.delay))}
              </dd>
            </>
          ) : null}
          <dt>{m.profile}</dt>
          <dd>{preview.profile ? m.present : m.absent}</dd>
        </dl>
        <p className="mt-2">{m.precision}</p>
        <p className="mt-2">{m.compatibility}</p>
        <p id={hint} className="mt-2">
          {m.panHint}
        </p>
        <a
          className="mt-2 inline-block underline underline-offset-2"
          href="/image-viewer-licenses/"
          target="_blank"
          rel="noreferrer"
        >
          {m.licenses}
        </a>
      </details>
    </div>
  )
}

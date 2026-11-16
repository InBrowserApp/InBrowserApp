import { useEffect, useEffectEvent, useRef } from "react"
import { ImageCrop } from "@workspace/ui/components/ui/image-crop"
import { transformedDimensions } from "../core/crop"
import { drawImage } from "../client/image"
import type { Cropper } from "../client/use-image-cropper"
import type { Messages } from "../client/types"

export function CropPreview({ state, m }: { state: Cropper; m: Messages }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const onError = useEffectEvent(state.previewError)
  const { source, transform } = state
  useEffect(() => {
    if (!source) return
    const size = transformedDimensions(source, transform.rotation)
    try {
      drawImage(
        canvas.current!,
        source,
        transform,
        { x: 0, y: 0, ...size },
        Math.min(1, 1600 / Math.max(size.width, size.height))
      )
    } catch {
      onError()
    }
  }, [source, transform])

  return (
    <div
      dir="ltr"
      className="flex min-h-64 items-center justify-center rounded-lg border bg-muted/30 p-3 sm:min-h-96"
    >
      <ImageCrop
        crop={state.crop}
        aspect={state.aspect}
        onChange={(_, percent) => state.changeCrop(percent)}
        disabled={state.processing}
        keepSelection
        ruleOfThirds
        ariaLabels={{
          cropArea: m.cropArea,
          nwDragHandle: m.cropHandle,
          nDragHandle: m.cropHandle,
          neDragHandle: m.cropHandle,
          eDragHandle: m.cropHandle,
          seDragHandle: m.cropHandle,
          sDragHandle: m.cropHandle,
          swDragHandle: m.cropHandle,
          wDragHandle: m.cropHandle,
        }}
      >
        <canvas
          ref={canvas}
          role="img"
          aria-label={m.sourceTitle}
          className="block h-auto max-h-[32rem] w-auto max-w-full touch-none bg-[repeating-conic-gradient(var(--muted)_0%_25%,var(--background)_0%_50%)] bg-size-[16px_16px] object-contain"
        />
      </ImageCrop>
    </div>
  )
}

import { Button } from "@workspace/ui/components/ui/button"
import { Download } from "@workspace/ui/icons"

import type { RasterFormat } from "./raster"

type RasterButtonProps = Readonly<{
  disabled: boolean
  format: RasterFormat
  label: string
  onClick: (format: RasterFormat) => void
}>

function RasterButton({ disabled, format, label, onClick }: RasterButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={() => {
        onClick(format)
      }}
    >
      <Download data-icon="inline-start" />
      {label}
    </Button>
  )
}

export { RasterButton }

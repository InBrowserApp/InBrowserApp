import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import type { ComponentProps } from "react"
import { cn } from "@workspace/ui/lib/utils"

export function ImageCrop({
  className,
  ...props
}: ComponentProps<typeof ReactCrop>) {
  return (
    <ReactCrop
      className={cn("max-w-full align-middle", className)}
      {...props}
    />
  )
}

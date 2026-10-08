import type { ComponentProps } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/ui/button"

export function DocumentIconButton({
  label,
  className,
  ...props
}: ComponentProps<typeof Button> & { label: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("touch-manipulation max-sm:size-10", className)}
      aria-label={label}
      title={label}
      {...props}
    />
  )
}

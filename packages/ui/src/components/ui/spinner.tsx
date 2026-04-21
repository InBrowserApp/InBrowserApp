import type { ComponentProps } from "react"

import { cn } from "@workspace/ui/lib/utils"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <Loader2Icon
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      role="status"
      {...props}
    />
  )
}

export { Spinner }

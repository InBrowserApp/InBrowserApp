import * as React from "react"

import { Card, CardContent, CardFooter } from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"

function ToolPanelCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "h-full min-h-0 gap-0 py-0 data-[size=sm]:gap-0 data-[size=sm]:py-0 [&>[data-slot=card-header]]:pt-4 data-[size=sm]:[&>[data-slot=card-header]]:pt-3",
        className
      )}
      {...props}
    />
  )
}

function ToolPanelCardContent({
  className,
  padding = "default",
  ...props
}: React.ComponentProps<typeof CardContent> & {
  padding?: "default" | "none"
}) {
  return (
    <CardContent
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        padding === "none"
          ? "p-0 group-data-[size=sm]/card:p-0"
          : "py-4 group-data-[size=sm]/card:py-3",
        className
      )}
      {...props}
    />
  )
}

function ToolPanelCardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("mt-auto", className)} {...props} />
}

export { ToolPanelCard, ToolPanelCardContent, ToolPanelCardFooter }

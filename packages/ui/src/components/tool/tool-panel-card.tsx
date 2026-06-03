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
        "h-full min-h-0 gap-0 py-0 [&>[data-slot=card-header]]:pt-4",
        className
      )}
      {...props}
    />
  )
}

function ToolPanelCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      className={cn("flex min-h-0 flex-1 flex-col", className)}
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

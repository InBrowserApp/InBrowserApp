import * as React from "react"

import { Card, CardContent, CardFooter } from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"

function ToolPanelCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return <Card className={cn("h-full", className)} {...props} />
}

function ToolPanelCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return (
    <CardContent className={cn("flex flex-1 flex-col", className)} {...props} />
  )
}

function ToolPanelCardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("mt-auto", className)} {...props} />
}

export { ToolPanelCard, ToolPanelCardContent, ToolPanelCardFooter }

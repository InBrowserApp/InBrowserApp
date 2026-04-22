import type { ComponentProps, ReactNode } from "react"

import { Label } from "@workspace/ui/components/ui/label"
import { cn } from "@workspace/ui/lib/utils"

type PanelFieldProps = Readonly<{
  label: string
  children: ReactNode
  className?: string
}> &
  Omit<ComponentProps<"div">, "children">

function PanelField({ className, label, children, ...props }: PanelFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  )
}

export { PanelField }

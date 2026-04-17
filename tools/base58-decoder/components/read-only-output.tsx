import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { cn } from "@workspace/ui/lib/utils"

type ReadOnlyOutputProps = Readonly<{
  ariaLabel: string
  className?: string
  value: string
}>

function ReadOnlyOutput({ ariaLabel, className, value }: ReadOnlyOutputProps) {
  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "flex min-h-0 w-full flex-col overflow-hidden rounded-lg border border-input bg-transparent",
        className
      )}
    >
      <ScrollArea className="h-full">
        <pre className="min-h-full px-3 py-2.5 font-mono text-sm leading-6 break-all whitespace-pre-wrap text-foreground">
          <code>{value}</code>
        </pre>
      </ScrollArea>
    </div>
  )
}

export { ReadOnlyOutput }

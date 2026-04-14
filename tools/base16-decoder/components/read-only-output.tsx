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
        "w-full rounded-lg border border-input bg-transparent px-3 py-2.5",
        className
      )}
    >
      <pre className="overflow-x-auto font-mono text-sm leading-6 break-all whitespace-pre-wrap text-foreground">
        <code>{value}</code>
      </pre>
    </div>
  )
}

export { ReadOnlyOutput }

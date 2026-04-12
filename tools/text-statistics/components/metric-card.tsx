import { cn } from "@workspace/ui/lib/utils"

type MetricCardProps = Readonly<{
  label: string
  value: string
  tone?: "default" | "warm" | "quiet"
}>

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default:
    "border-foreground/10 bg-background/80 shadow-sm shadow-black/5 dark:bg-background/60",
  warm: "border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/10",
  quiet: "border-border/80 bg-muted/40 dark:bg-muted/20",
}

function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border p-4 backdrop-blur-sm",
        toneClasses[tone]
      )}
    >
      <p className="text-[0.72rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-3 font-heading text-3xl leading-none tracking-[var(--tracking-display)] text-foreground">
        {value}
      </p>
    </div>
  )
}

export { MetricCard }

import { cn } from "@workspace/ui/lib/utils"

type MetricCardProps = Readonly<{
  label: string
  value: string
  tone?: "default" | "muted"
}>

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "border-border bg-background",
  muted: "border-border/80 bg-muted/30",
}

function MetricCard({ label, value, tone = "muted" }: MetricCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", toneClasses[tone])}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}

export { MetricCard }

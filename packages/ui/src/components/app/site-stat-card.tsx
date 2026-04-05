import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"

type SiteStatCardProps = {
  value: string
  label: string
  detail: string
  className?: string
}

function SiteStatCard({ className, detail, label, value }: SiteStatCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[calc(var(--radius)*1.8)] border border-border/80 bg-background/75 py-0 shadow-none",
        className
      )}
    >
      <CardHeader className="gap-2 border-b border-border/70 py-4">
        <p className="font-mono text-[0.68rem] tracking-[0.22em] text-muted-foreground uppercase">
          {label}
        </p>
        <CardTitle className="font-heading text-4xl leading-none tracking-[var(--tracking-display)] sm:text-5xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 text-sm leading-6 text-muted-foreground">
        {detail}
      </CardContent>
    </Card>
  )
}

export { SiteStatCard }

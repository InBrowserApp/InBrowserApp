import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"

import { ArrowUpRight } from "@workspace/ui/icons"

type ToolDirectoryCardProps = {
  name: string
  description: string
  href: string
  actionLabel: string
  metaLabel: string
  category: string
  group?: string
  icon: string
  tags: readonly string[]
  features?: readonly string[]
  className?: string
}

function ToolDirectoryCard({
  actionLabel,
  category,
  className,
  description,
  features = [],
  group,
  href,
  icon,
  metaLabel,
  name,
  tags,
}: ToolDirectoryCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[calc(var(--radius)*1.9)] border border-border/80 bg-background/80 py-0 shadow-none",
        className
      )}
    >
      <CardHeader className="gap-3 border-b border-border/70 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{category}</Badge>
          {group ? <Badge variant="outline">{group}</Badge> : null}
          <Badge variant="outline">{icon}</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <CardTitle className="font-heading text-2xl leading-tight tracking-[var(--tracking-display)]">
            {name}
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 py-5">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        {features.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 4).map((feature) => (
              <Badge key={feature}>{feature}</Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="justify-between gap-3 border-t border-border/70 bg-muted/35">
        <span className="font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
          {metaLabel}
        </span>
        <Button asChild size="sm">
          <a href={href}>
            {actionLabel}
            <ArrowUpRight data-icon="inline-end" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export { ToolDirectoryCard }

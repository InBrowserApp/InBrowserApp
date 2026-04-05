import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { cn } from "@workspace/ui/lib/utils"

type LanguageOption = Readonly<{
  code: string
  href: string
  label: string
  current?: boolean
}>

type LanguageSwitcherProps = {
  label: string
  options: readonly LanguageOption[]
  inline?: boolean
  className?: string
}

function LanguageSwitcher({
  className,
  inline = false,
  label,
  options,
}: LanguageSwitcherProps) {
  if (inline) {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </span>
        {options.map((option) => (
          <Button
            asChild
            key={option.code}
            size="sm"
            variant={option.current ? "default" : "outline"}
          >
            <a href={option.href} hrefLang={option.code} lang={option.code}>
              {option.label}
            </a>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{label}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => (
          <Button
            asChild
            key={option.code}
            size="sm"
            variant={option.current ? "default" : "outline"}
          >
            <a href={option.href} hrefLang={option.code} lang={option.code}>
              {option.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}

export { LanguageSwitcher }
export type { LanguageOption }

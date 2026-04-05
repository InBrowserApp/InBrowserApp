import { Button } from "@workspace/ui/components/ui/button"
import { cn } from "@workspace/ui/lib/utils"

import { LanguageSwitcher } from "./language-switcher"

type NavigationItem = Readonly<{
  href: string
  label: string
  current?: boolean
}>

type SiteToolbarProps = {
  languageLabel: string
  languageOptions: readonly {
    code: string
    href: string
    label: string
    current?: boolean
  }[]
  navigation: readonly NavigationItem[]
  className?: string
}

function SiteToolbar({
  className,
  languageLabel,
  languageOptions,
  navigation,
}: SiteToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[calc(var(--radius)*1.6)] border border-border/70 bg-background p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <nav className="flex flex-wrap items-center gap-2">
        {navigation.map((item) => (
          <Button
            asChild
            key={item.href}
            size="sm"
            variant={item.current ? "default" : "outline"}
          >
            <a href={item.href}>{item.label}</a>
          </Button>
        ))}
      </nav>

      <LanguageSwitcher
        className="sm:items-end"
        label={languageLabel}
        options={languageOptions}
      />
    </div>
  )
}

export { SiteToolbar }

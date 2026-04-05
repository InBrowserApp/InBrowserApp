import type { PropsWithChildren } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Separator } from "@workspace/ui/components/ui/separator"
import { cn } from "@workspace/ui/lib/utils"

import { LanguageSwitcher } from "./language-switcher"

type NavigationItem = Readonly<{
  href: string
  label: string
  current?: boolean
}>

type SiteChromeProps = PropsWithChildren<{
  brandHref: string
  brandName: string
  brandTagline: string
  currentStatus: string
  footerNote: string
  footerStatusLabel: string
  languageLabel: string
  languageOptions: readonly {
    code: string
    href: string
    label: string
    current?: boolean
  }[]
  navigation: readonly NavigationItem[]
  className?: string
}>

function SiteChrome({
  brandHref,
  brandName,
  brandTagline,
  children,
  className,
  currentStatus,
  footerNote,
  footerStatusLabel,
  languageLabel,
  languageOptions,
  navigation,
}: SiteChromeProps) {
  return (
    <div
      className={cn(
        "relative min-h-svh overflow-hidden text-foreground",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-[var(--spacing-page-x)] py-6 sm:gap-10 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            <Badge variant="outline">{currentStatus}</Badge>
            <span>{brandTagline}</span>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            {navigation.map((item) => (
              <Button
                asChild
                key={item.href}
                size="sm"
                variant={item.current ? "default" : "ghost"}
              >
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
          </div>
        </div>

        <div className="site-grid-panel rounded-[calc(var(--radius)*3)] border border-border/80 bg-card/80 px-5 py-5 shadow-[var(--shadow-elevated)] backdrop-blur sm:px-7 sm:py-6">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5">
              <a
                href={brandHref}
                className="flex w-fit flex-col gap-1 rounded-2xl border border-transparent transition-colors hover:border-border/80"
              >
                <span className="font-heading text-[clamp(1.9rem,2vw+1.1rem,3.4rem)] leading-none tracking-[var(--tracking-display)] text-balance">
                  {brandName}
                </span>
                <span className="max-w-xl text-sm leading-6 text-muted-foreground">
                  {brandTagline}
                </span>
              </a>
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
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
              </div>
            </div>

            <LanguageSwitcher
              className="lg:max-w-sm lg:items-end"
              label={languageLabel}
              options={languageOptions}
            />
          </header>

          <Separator className="my-5" />

          <main className="flex flex-col gap-10">{children}</main>
        </div>

        <footer className="flex flex-col gap-3 pb-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{footerNote}</span>
          <span className="font-mono text-xs tracking-[0.16em] uppercase">
            {footerStatusLabel}
          </span>
        </footer>
      </div>
    </div>
  )
}

export { SiteChrome }
export type { NavigationItem }

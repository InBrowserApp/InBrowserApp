import type { PropsWithChildren } from "react"

import { cn } from "@workspace/ui/lib/utils"

type ToolArticleProps = PropsWithChildren<{
  className?: string
}>

function ToolArticle({ className, children }: ToolArticleProps) {
  return (
    <article
      className={cn(
        "text-sm leading-7 text-muted-foreground sm:text-base",
        "[&_h2]:mt-10 [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-balance [&_h2]:text-foreground sm:[&_h2]:text-3xl",
        "[&_h2:first-child]:mt-0",
        "[&_p:not(:first-child)]:mt-6",
        "[&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:marker:text-foreground/70 [&_ul_li]:mt-2",
        "[&_strong]:font-medium [&_strong]:text-foreground",
        "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        className
      )}
    >
      {children}
    </article>
  )
}

export { ToolArticle }

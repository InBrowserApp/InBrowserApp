import type { PropsWithChildren } from "react"

import { cn } from "@workspace/ui/lib/utils"

type ToolArticleProps = PropsWithChildren<{
  className?: string
}>

function ToolArticle({ className, children }: ToolArticleProps) {
  return (
    <article
      className={cn(
        "text-sm leading-7 text-foreground/80 sm:text-base",
        "[&_h2]:mt-10 [&_h2]:scroll-m-20 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-balance [&_h2]:text-foreground",
        "[&_h2:first-child]:mt-0",
        "[&_h3]:mt-8 [&_h3]:scroll-m-20 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-foreground",
        "[&_h4]:mt-6 [&_h4]:scroll-m-20 [&_h4]:font-heading [&_h4]:text-base [&_h4]:font-semibold [&_h4]:tracking-tight [&_h4]:text-foreground",
        "[&_p:not(:first-child)]:mt-5",
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-6 [&_blockquote]:text-foreground/90 [&_blockquote]:italic",
        "[&_ul]:my-5 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:marker:text-foreground/50 [&_ul_li]:mt-2",
        "[&_ol]:my-5 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol_li]:mt-2",
        "[&_code]:relative [&_code]:rounded [&_code]:bg-muted [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-sm [&_code]:font-normal [&_code]:text-foreground",
        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border-b [&_td]:border-border/60 [&_td]:px-4 [&_td]:py-2 [&_th]:border-b [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_th]:text-foreground",
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

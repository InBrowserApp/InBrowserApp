import { cn } from "@workspace/ui/lib/utils"

import type { PreviewTheme } from "../core/preview-options"

const previewShellClassName = "overflow-hidden rounded-lg"

function getSurfaceClassName(theme: PreviewTheme) {
  return cn(
    previewShellClassName,
    theme === "clean" ? "bg-muted/30" : "bg-slate-950 ring-1 ring-slate-800"
  )
}

function getArticleClassName(theme: PreviewTheme) {
  return cn(
    "w-full max-w-full min-w-0 px-4 py-4 text-sm leading-7 sm:px-6 sm:py-5",
    "[&_a]:break-words [&_h1]:break-words [&_h2]:break-words",
    "[&_h3]:break-words [&_h4]:break-words [&_li]:break-words",
    "[&_p]:break-words",
    "[&_td]:break-words [&_th]:break-words",
    "[&_h1]:mb-3 [&_h1]:scroll-mt-4 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:leading-tight [&_h1]:text-pretty sm:[&_h1]:text-3xl",
    "[&_h2]:mt-7 [&_h2]:scroll-mt-4 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:text-pretty sm:[&_h2]:mt-8 sm:[&_h2]:text-2xl",
    "[&_h3]:mt-6 [&_h3]:scroll-mt-4 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:text-pretty sm:[&_h3]:text-xl",
    "[&_h4]:mt-5 [&_h4]:scroll-mt-4 [&_h4]:font-heading [&_h4]:text-lg [&_h4]:text-pretty",
    "[&_p:not(:first-child)]:mt-4",
    "[&_ul]:my-4 [&_ul]:ml-5 [&_ul]:list-disc",
    "[&_ol]:my-4 [&_ol]:ml-5 [&_ol]:list-decimal",
    "[&_li]:mt-2",
    "[&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:pl-4",
    "[&_pre]:my-5 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:px-4 [&_pre]:py-3 [&_pre]:text-sm",
    "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
    "[&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5",
    "[&_table]:my-5 [&_table]:block [&_table]:w-full [&_table]:max-w-full [&_table]:border-collapse [&_table]:overflow-x-auto",
    "[&_td]:border-b [&_td]:px-3 [&_td]:py-2",
    "[&_th]:border-b [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
    "[&_img]:max-w-full [&_img]:rounded-lg",
    theme === "clean"
      ? [
          "text-foreground",
          "[&_a]:text-primary",
          "[&_blockquote]:border-border [&_blockquote]:text-muted-foreground",
          "[&_pre]:border-border [&_pre]:bg-muted/45",
          "[&_code]:bg-muted [&_code]:text-foreground",
          "[&_td]:border-border [&_th]:border-border",
        ]
      : [
          "text-slate-100",
          "[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white",
          "[&_a]:text-sky-300",
          "[&_blockquote]:border-slate-700 [&_blockquote]:text-slate-300",
          "[&_pre]:border-slate-700 [&_pre]:bg-slate-900",
          "[&_code]:bg-white/10 [&_code]:text-slate-100",
          "[&_td]:border-slate-800 [&_th]:border-slate-700",
        ]
  )
}

export { getArticleClassName, getSurfaceClassName }

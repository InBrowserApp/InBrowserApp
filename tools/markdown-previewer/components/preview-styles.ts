import { cn } from "@workspace/ui/lib/utils"

import type { PreviewTheme } from "../core/preview-options"

const previewShellClassName =
  "overflow-hidden rounded-[26px] border shadow-[0_28px_90px_-48px_rgba(15,23,42,0.55)]"

function getSurfaceClassName(theme: PreviewTheme) {
  return cn(
    previewShellClassName,
    theme === "paper"
      ? "border-amber-200/70 bg-[#f7f1e3]"
      : "border-slate-800 bg-slate-950"
  )
}

function getArticleClassName(theme: PreviewTheme) {
  return cn(
    "mx-auto max-w-3xl px-6 py-8 text-sm leading-7 sm:px-10 sm:py-10",
    "[&_h1]:mb-4 [&_h1]:font-heading [&_h1]:text-4xl [&_h1]:leading-tight",
    "[&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl",
    "[&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-xl",
    "[&_h4]:mt-6 [&_h4]:font-heading [&_h4]:text-lg",
    "[&_p:not(:first-child)]:mt-5",
    "[&_ul]:my-5 [&_ul]:ml-6 [&_ul]:list-disc",
    "[&_ol]:my-5 [&_ol]:ml-6 [&_ol]:list-decimal",
    "[&_li]:mt-2",
    "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-5",
    "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:px-4 [&_pre]:py-3 [&_pre]:text-sm",
    "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
    "[&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5",
    "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse",
    "[&_td]:border-b [&_td]:px-3 [&_td]:py-2",
    "[&_th]:border-b [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
    "[&_img]:rounded-2xl",
    theme === "paper"
      ? [
          "text-slate-800",
          "[&_h1]:text-slate-950 [&_h2]:text-slate-950 [&_h3]:text-slate-950",
          "[&_h4]:text-slate-950",
          "[&_a]:text-amber-800",
          "[&_blockquote]:border-amber-300/60 [&_blockquote]:text-slate-600",
          "[&_pre]:border-amber-200/80 [&_pre]:bg-[#fff8ec]",
          "[&_code]:bg-slate-900/6 [&_code]:text-slate-900",
          "[&_td]:border-amber-200/70 [&_th]:border-amber-300/80",
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

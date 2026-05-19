import type { ReactNode } from "react"

type ResponsiveToolLayoutProps = Readonly<{
  preview: ReactNode
  settings: ReactNode
  upload: ReactNode
}>

function ResponsiveToolLayout({
  preview,
  settings,
  upload,
}: ResponsiveToolLayoutProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)] xl:items-start">
      <div className="min-w-0 xl:col-span-2">{upload}</div>
      <div className="min-w-0 xl:sticky xl:top-6">{settings}</div>
      <div className="min-w-0">{preview}</div>
    </div>
  )
}

export { ResponsiveToolLayout }

type HtmlPreviewFrameProps = Readonly<{
  title: string
  documentHtml: string
}>

function HtmlPreviewFrame({ title, documentHtml }: HtmlPreviewFrameProps) {
  return (
    <iframe
      title={title}
      sandbox=""
      srcDoc={documentHtml}
      className="h-[22rem] w-full rounded-[1.25rem] border border-border/70 bg-white shadow-[0_22px_44px_rgba(17,24,39,0.08)]"
    />
  )
}

export { HtmlPreviewFrame }

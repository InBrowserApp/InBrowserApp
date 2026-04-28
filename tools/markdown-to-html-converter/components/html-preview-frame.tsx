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
      className="block h-[22rem] w-full border-0 bg-white"
    />
  )
}

export { HtmlPreviewFrame }

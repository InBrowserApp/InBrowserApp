import { useEffect, useState } from "react"
import type { CbzFile } from "@workspace/comic/cbz"
import { DocumentDownload } from "./document-download"

type Messages = {
  ready: string
  download: string
  first: string
  last: string
}

function Cover({ file }: { file: Blob }) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    const source = URL.createObjectURL(file)
    setUrl(source)
    return () => URL.revokeObjectURL(source)
  }, [file])
  return url ? (
    <img
      src={url}
      alt=""
      className="h-36 max-w-40 rounded-md object-contain"
      onError={() => setUrl("")}
    />
  ) : null
}

export function CbzDownload({
  file,
  filename,
  detail,
  lang,
  messages: m,
}: {
  file: CbzFile
  filename: string
  detail?: string
  lang: string
  messages: Messages
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div role="status" className="text-sm">
          <p className="font-medium">
            {m.ready.replace(
              "{total}",
              new Intl.NumberFormat(lang).format(file.total)
            )}
          </p>
          {detail ? <p className="text-muted-foreground">{detail}</p> : null}
        </div>
        <DocumentDownload
          file={file.cbz}
          filename={filename}
          label={m.download}
        />
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-4 bg-muted/25 p-4">
        {file.cover ? <Cover file={file.cover} /> : null}
        <dl className="grid min-w-0 flex-1 basis-36 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">{m.first}</dt>
            <dd className="wrap-anywhere">
              <bdi>{file.first}</bdi>
            </dd>
          </div>
          {file.total > 1 ? (
            <div>
              <dt className="text-muted-foreground">{m.last}</dt>
              <dd className="wrap-anywhere">
                <bdi>{file.last}</bdi>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </>
  )
}

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Lock } from "@workspace/ui/icons"
import { TorrentFiles } from "./torrent-files"
import type {
  TorrentIdentity,
  TorrentMessages,
  TorrentMetadata,
} from "./torrent-types"

type TorrentDetailsProps = {
  torrent: TorrentIdentity | TorrentMetadata
  magnet: string
  language: string
  messages: TorrentMessages
  heading?: string
}

const SIZE_UNITS = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"]

function TorrentDetails({
  torrent,
  magnet,
  language,
  messages: m,
  heading = m.details,
}: TorrentDetailsProps) {
  const full = "files" in torrent ? torrent : undefined
  const formatNumber = new Intl.NumberFormat(language, {
    maximumFractionDigits: 2,
  })
  const formatSize = (bytes: number) => {
    const unit = Math.min(
      Math.floor(Math.log2(Math.max(1, bytes)) / 10),
      SIZE_UNITS.length - 1
    )
    return `${formatNumber.format(bytes / 1024 ** unit)} ${SIZE_UNITS[unit]}`
  }

  return (
    <div className="grid min-w-0 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>{heading}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid min-w-0 gap-4">
          {torrent.name ? (
            <p className="text-xl font-semibold wrap-anywhere">
              <bdi>{torrent.name}</bdi>
            </p>
          ) : null}
          {full ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
              {[
                [m.totalSize, formatSize(full.length)],
                [m.fileCount, formatNumber.format(full.files.length)],
                [m.pieceLength, formatSize(full.pieceLength)],
                [m.pieceCount, formatNumber.format(full.pieceCount)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-lg bg-muted/60 px-3 py-2"
                >
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-medium wrap-anywhere tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <dl className="min-w-0">
            <dt className="text-sm font-medium">{m.infoHash}</dt>
            <dd
              dir="ltr"
              className="mt-1 w-fit max-w-full font-mono text-sm wrap-anywhere"
            >
              {torrent.infoHash}
            </dd>
          </dl>
          <div className="flex flex-wrap gap-2">
            <ToolCopyButton
              value={torrent.infoHash}
              copyLabel={m.copyHash}
              copiedLabel={m.copied}
              failedLabel={m.copyFailed}
            />
            <ToolCopyButton
              value={magnet}
              copyLabel={m.copyMagnet}
              copiedLabel={m.copied}
              failedLabel={m.copyFailed}
            />
          </div>
          {full &&
          (full.created || full.createdBy || full.comment || full.private) ? (
            <dl className="grid gap-2 border-t pt-4 text-sm">
              {[
                [
                  m.created,
                  full.created && Number.isFinite(full.created.getTime())
                    ? new Intl.DateTimeFormat(language, {
                        dateStyle: "medium",
                        timeZone: "UTC",
                      }).format(full.created)
                    : undefined,
                ],
                [m.createdBy, full.createdBy],
                [m.comment, full.comment],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="grid gap-1">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd
                      dir="auto"
                      className="wrap-anywhere whitespace-pre-wrap"
                    >
                      {value}
                    </dd>
                  </div>
                ) : null
              )}
              {full.private ? (
                <div className="flex items-center gap-2">
                  <Lock aria-hidden="true" className="size-4" />
                  <dt>{m.private}</dt>
                </div>
              ) : null}
            </dl>
          ) : null}
        </CardContent>
      </Card>
      {full ? (
        <TorrentFiles
          key={torrent.infoHash}
          files={full.files}
          messages={m}
          formatSize={formatSize}
          formatNumber={formatNumber}
        />
      ) : null}
      {[
        { title: m.trackers, urls: torrent.announce },
        { title: m.webSeeds, urls: torrent.urlList },
      ].map(({ title, urls }) =>
        urls?.length ? (
          <Card key={title}>
            <CardHeader>
              <CardTitle>
                <h2>{title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {urls.map((url, index) => (
                  <li
                    key={index}
                    dir="ltr"
                    className="w-fit max-w-full font-mono text-sm wrap-anywhere"
                  >
                    {url}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null
      )}
    </div>
  )
}

export { TorrentDetails }
export type { TorrentIdentity, TorrentMessages, TorrentMetadata }

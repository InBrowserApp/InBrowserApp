import { useEffect, useRef, useState } from "react"

import { describeError } from "./model"
import { ObjectDialog } from "./object-dialog"
import { ObjectTable } from "./object-table"
import { ObjectToolbar } from "./object-toolbar"

import type { Labels, Listing } from "./model"
import type { ObjectAction } from "./object-dialog"
import type { ObjectStorage } from "./s3"

const empty: Listing = { folders: [], objects: [] }

export function Objects({
  service,
  bucket,
  buckets,
  labels,
  lang,
}: {
  service: ObjectStorage
  bucket: string
  buckets: string[]
  labels: Labels
  lang: string
}) {
  const [prefix, setPrefix] = useState("")
  const [filter, setFilter] = useState("")
  const [listing, setListing] = useState<Listing>(empty)
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [action, setAction] = useState<ObjectAction>()
  const [revision, setRevision] = useState(0)
  const request = useRef<AbortController>(null)

  async function load(path: string, signal: AbortSignal, next?: string) {
    setLoading(true)
    setError("")
    try {
      const page = await service.list(bucket, path, next, signal)
      if (signal.aborted) return
      setListing((current) =>
        next
          ? {
              next: page.next,
              folders: [...new Set([...current.folders, ...page.folders])],
              objects: [
                ...new Map(
                  [...current.objects, ...page.objects].map((object) => [
                    object.key,
                    object,
                  ])
                ).values(),
              ],
            }
          : page
      )
    } catch (reason) {
      if (!signal.aborted) setError(describeError(reason, labels))
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    request.current = controller
    void load(prefix, controller.signal)
    return () => controller.abort()
    // The service and labels are stable for this mounted bucket.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix, revision, service, bucket, labels])

  function navigate(path: string) {
    setAction(undefined)
    if (path === prefix) return
    request.current?.abort()
    setPrefix(path)
    setFilter("")
    setSelected([])
    setListing(empty)
    setLoading(true)
    setStatus("")
  }

  function refresh() {
    setSelected([])
    setRevision((current) => current + 1)
  }

  async function download(key: string) {
    const url = await service.download(bucket, key)
    const link = document.createElement("a")
    link.href = url
    link.rel = "noreferrer"
    link.click()
  }

  async function downloadFromTable(key: string) {
    setError("")
    try {
      await download(key)
    } catch (reason) {
      setError(describeError(reason, labels))
    }
  }

  return (
    <div className="min-w-0 bg-card">
      <ObjectToolbar
        bucket={bucket}
        prefix={prefix}
        filter={filter}
        selected={selected}
        loading={loading}
        labels={labels}
        lang={lang}
        navigate={navigate}
        setFilter={setFilter}
        refresh={() => {
          setStatus("")
          refresh()
        }}
        setAction={setAction}
      />
      <ObjectTable
        listing={listing}
        prefix={prefix}
        filter={filter}
        selected={selected}
        loading={loading}
        error={error}
        labels={labels}
        lang={lang}
        navigate={navigate}
        onSelectionChange={setSelected}
        setAction={setAction}
        download={downloadFromTable}
        loadMore={() => {
          if (request.current)
            void load(prefix, request.current.signal, listing.next)
        }}
      />
      {error && (
        <p role="alert" className="border-t p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {status && (
        <p role="status" className="border-t p-3 text-sm text-muted-foreground">
          {status}
        </p>
      )}
      {action && (
        <ObjectDialog
          action={action}
          service={service}
          bucket={bucket}
          buckets={buckets}
          prefix={prefix}
          labels={labels}
          close={() => setAction(undefined)}
          navigate={navigate}
          download={download}
          done={(success = true) => {
            setAction(undefined)
            setStatus(success ? labels.completed : "")
            refresh()
          }}
        />
      )}
    </div>
  )
}

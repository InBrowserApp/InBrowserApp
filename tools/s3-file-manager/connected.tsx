import { useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Folder, LoaderCircle, Pencil, Search } from "@workspace/ui/icons"

import { describeError } from "./model"
import { Objects } from "./objects"
import { createStorage } from "./s3"

import type { Connection, Labels } from "./model"

export function Connected({
  connection,
  labels,
  lang,
  edit,
}: {
  connection: Connection
  labels: Labels
  lang: string
  edit: () => void
}) {
  const [service] = useState(() => createStorage(connection))
  const [discovered, setDiscovered] = useState<string[]>([])
  const [bucket, setBucket] = useState(connection.buckets[0] ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const buckets = [...new Set([...connection.buckets, ...discovered])]

  async function discover() {
    setLoading(true)
    setError("")
    try {
      const found = await service.buckets()
      setDiscovered(found)
      setBucket((current) =>
        connection.buckets.includes(current) || found.includes(current)
          ? current
          : (connection.buckets[0] ?? found[0] ?? "")
      )
    } catch (reason) {
      setError(labels.discoveryFailed + " " + describeError(reason, labels))
    } finally {
      setLoading(false)
    }
  }

  const discoverButton = (
    <Button
      size="lg"
      variant={bucket ? "outline" : "default"}
      onClick={() => void discover()}
      disabled={loading}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : <Search />}
      {labels.discoverBuckets}
    </Button>
  )
  const alert = error && (
    <p role="alert" className="text-sm text-destructive">
      {error}
    </p>
  )

  if (!bucket)
    return (
      <div className="grid min-h-72 min-w-0 place-items-center p-5 text-center">
        <div className="grid max-w-sm justify-items-center gap-3">
          <Folder className="size-8 text-muted-foreground" />
          <h2 className="text-lg font-medium">{labels.selectBucket}</h2>
          <p className="text-sm text-muted-foreground">{labels.bucketHint}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {discoverButton}
            <Button size="lg" variant="outline" onClick={edit}>
              <Pencil />
              {labels.editConnection}
            </Button>
          </div>
          {alert}
        </div>
      </div>
    )

  return (
    <div className="min-w-0">
      <div className="grid gap-2 border-b bg-muted/15 p-3 sm:p-4">
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid min-w-36 flex-1 gap-1 text-xs font-medium sm:max-w-xs">
            {labels.buckets}
            <select
              value={bucket}
              onChange={(event) => setBucket(event.target.value)}
              className="h-9 w-full min-w-0 rounded-md border bg-background px-2 text-sm"
              dir="ltr"
            >
              {buckets.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          {discoverButton}
        </div>
        {alert}
      </div>
      <Objects
        key={bucket}
        service={service}
        bucket={bucket}
        buckets={buckets}
        labels={labels}
        lang={lang}
      />
    </div>
  )
}

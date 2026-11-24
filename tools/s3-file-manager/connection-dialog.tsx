import { useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Eye, EyeOff } from "@workspace/ui/icons"

import { Field, FormActions, Modal } from "./dialogs"
import { bucketNames, validEndpoint } from "./model"

import type { Connection, Labels } from "./model"

function endpointDefaults(endpoint: string) {
  const hostname = validEndpoint(endpoint) ? new URL(endpoint).hostname : ""
  const awsRegion =
    /^s3(?:-fips)?[.-](?:dualstack\.)?([a-z]{2}(?:-[a-z0-9]+)+-\d+)\.amazonaws\.com(?:\.cn)?$/.exec(
      hostname
    )?.[1]
  return {
    hostname,
    region: hostname.endsWith(".r2.cloudflarestorage.com")
      ? "auto"
      : (awsRegion ?? "us-east-1"),
    pathStyle: Boolean(
      hostname && !/\.amazonaws\.com(?:\.cn)?$/.test(hostname)
    ),
  }
}

export function ConnectionDialog({
  connection,
  labels,
  close,
  save,
}: {
  connection?: Connection
  labels: Labels
  close: () => void
  save: (connection: Connection) => void
}) {
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")
  const [endpoint, setEndpoint] = useState(connection?.endpoint ?? "")
  const [pathStyle, setPathStyle] = useState(connection?.pathStyle)
  const defaults = endpointDefaults(endpoint)
  const secretType = visible ? "text" : "password"

  return (
    <Modal
      title={connection ? labels.editConnection : labels.addConnection}
      labels={labels}
      close={close}
    >
      <form
        autoComplete="off"
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          const fields = new FormData(event.currentTarget)
          const value = (name: string) => String(fields.get(name) ?? "").trim()
          const endpoint = value("endpoint")
          if (!defaults.hostname) {
            setError(labels.invalidEndpoint)
            return
          }
          save({
            id: connection?.id ?? crypto.randomUUID(),
            name: value("name") || defaults.hostname,
            endpoint,
            region: value("region") || defaults.region,
            pathStyle: fields.has("pathStyle"),
            buckets: bucketNames(value("buckets")),
            remember: fields.has("remember"),
            credentials: {
              accessKeyId: value("accessKey"),
              secretAccessKey: value("secretKey"),
              sessionToken: value("sessionToken") || undefined,
            },
          })
        }}
      >
        <Field
          name="name"
          label={labels.connectionName}
          defaultValue={connection?.name}
          placeholder="AWS S3 / Cloudflare R2 / MinIO"
        />
        <Field
          name="endpoint"
          label={labels.endpoint}
          type="url"
          required
          dir="ltr"
          value={endpoint}
          onChange={(event) => setEndpoint(event.target.value)}
          placeholder="https://s3.us-east-1.amazonaws.com"
        />
        <Field
          name="accessKey"
          label={labels.accessKey}
          required
          dir="ltr"
          defaultValue={connection?.credentials?.accessKeyId}
          autoComplete="off"
          type={secretType}
        />
        <Field
          name="secretKey"
          label={labels.secretKey}
          required
          dir="ltr"
          defaultValue={connection?.credentials?.secretAccessKey}
          autoComplete="off"
          type={secretType}
        />
        <Button
          className="w-fit"
          type="button"
          variant="ghost"
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff /> : <Eye />}
          {labels.showCredentials}
        </Button>
        <Field
          name="buckets"
          label={labels.bucketNames}
          hint={labels.bucketNamesHelp}
          multiline
          defaultValue={connection?.buckets.join("\n")}
        />
        <details
          className="rounded-lg border px-3 py-2"
          open={
            Boolean(
              connection?.pathStyle ||
              connection?.credentials?.sessionToken ||
              (connection && connection.region !== "us-east-1")
            ) || undefined
          }
        >
          <summary className="cursor-pointer text-sm font-medium">
            {labels.advanced}
          </summary>
          <div className="mt-3 grid gap-3">
            <Field
              name="region"
              label={labels.region}
              dir="ltr"
              defaultValue={connection?.region}
              placeholder={defaults.region}
            />
            <Field
              name="sessionToken"
              label={labels.sessionToken}
              dir="ltr"
              type={secretType}
              autoComplete="off"
              defaultValue={connection?.credentials?.sessionToken}
            />
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="pathStyle"
                checked={pathStyle ?? defaults.pathStyle}
                onChange={(event) => setPathStyle(event.target.checked)}
                className="mt-1 accent-primary"
              />
              {labels.pathStyle}
            </label>
          </div>
        </details>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="remember"
            defaultChecked={connection?.remember}
            className="mt-1 accent-primary"
          />
          <span>
            {labels.remember}
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {labels.rememberHelp}
            </span>
          </span>
        </label>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <FormActions
          labels={labels}
          close={close}
          action={labels.saveConnect}
        />
      </form>
    </Modal>
  )
}

import { useMemo, useState } from "react"
import { ChevronDown, FileText, Search } from "@workspace/ui/icons"
import { Input } from "@workspace/ui/components/ui/input"
import type { Image, Messages } from "./types"

export function Metadata({
  image,
  messages,
}: {
  image: Image
  messages: Messages
}) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const tags = useMemo(() => (open ? image.tags() : null), [open, image])
  const query = search.trim().toLowerCase()
  const visible = tags?.filter(
    ({ id, name, value }) =>
      id.toLowerCase().includes(query) ||
      id.replace(",", "").toLowerCase().includes(query) ||
      name.toLowerCase().includes(query) ||
      value.toLowerCase().includes(query)
  )
  return (
    <details
      className="group mt-3 rounded-xl border bg-card"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl p-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
        {messages.metadata}
        <ChevronDown
          className="ms-auto size-4 text-muted-foreground group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      {tags && (
        <div className="grid gap-3 border-t p-4">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label={messages.searchTags}
              placeholder={messages.searchTags}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="ps-9"
            />
          </div>
          {visible?.length ? (
            <div className="max-h-80 overflow-auto rounded-md border">
              <table className="w-full text-start text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    {[messages.tag, messages.attribute, messages.value].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-2 py-2 text-start font-medium sm:px-3"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visible.map(({ id, name, value }) => (
                    <tr key={id}>
                      <td
                        className="px-2 py-2 align-top font-mono text-xs tabular-nums sm:px-3"
                        dir="ltr"
                      >
                        {id}
                      </td>
                      <td
                        className="px-2 py-2 align-top wrap-anywhere sm:px-3"
                        dir="auto"
                      >
                        {name || "—"}
                      </td>
                      <td
                        className="px-2 py-2 align-top wrap-anywhere sm:px-3"
                        dir="auto"
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{messages.noTags}</p>
          )}
        </div>
      )}
    </details>
  )
}

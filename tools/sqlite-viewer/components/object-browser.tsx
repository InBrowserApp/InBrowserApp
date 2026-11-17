import { useState } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Input } from "@workspace/ui/components/ui/input"
import { Pagination } from "./pagination"
import type { DatabaseObject, Messages } from "../types"

export function ObjectBrowser({
  objects,
  selected,
  onSelect,
  disabled,
  messages: m,
  lang,
}: {
  objects: DatabaseObject[]
  selected: string | null
  onSelect: (object: DatabaseObject) => void
  disabled: boolean
  messages: Messages
  lang: string
}) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const matches = objects.filter((object) =>
    object.name.toLocaleLowerCase(lang).includes(search.toLocaleLowerCase(lang))
  )
  const total = Math.max(1, Math.ceil(matches.length / 30))
  return (
    <aside
      className="flex min-w-0 flex-col gap-3 border-b p-4 lg:border-e lg:border-b-0"
      aria-label={m.objects}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{m.objects}</h2>
        <Badge variant="secondary">
          {new Intl.NumberFormat(lang).format(objects.length)}
        </Badge>
      </div>
      <Input
        name="table-search"
        autoComplete="off"
        aria-label={m.search}
        placeholder={m.search}
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          setPage(0)
        }}
      />
      <div className="flex max-h-72 flex-col gap-1 overflow-y-auto lg:max-h-[36rem]">
        {matches.slice(page * 30, (page + 1) * 30).map((object) => (
          <Button
            key={object.name}
            variant={selected === object.name ? "secondary" : "ghost"}
            className="w-full justify-start"
            disabled={disabled}
            aria-pressed={selected === object.name}
            onClick={() => onSelect(object)}
            title={object.name}
          >
            <span className="min-w-0 flex-1 truncate text-start">
              <bdi>{object.name}</bdi>
            </span>
            <span className="text-xs text-muted-foreground">
              {m[object.type]}
            </span>
          </Button>
        ))}
        {!matches.length ? (
          <p className="py-3 text-sm text-muted-foreground" role="status">
            {m.noObjects}
          </p>
        ) : null}
      </div>
      {total > 1 ? (
        <Pagination
          page={page}
          total={total}
          onPage={setPage}
          messages={m}
          lang={lang}
        />
      ) : null}
    </aside>
  )
}

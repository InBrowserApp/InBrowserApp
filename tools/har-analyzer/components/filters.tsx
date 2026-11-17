import { useId } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import type { SortOrder, StatusFilter } from "../core/analysis"
import type { Messages } from "../types"

export type FiltersState = Readonly<{
  search: string
  status: StatusFilter
  sort: SortOrder
}>
export const DEFAULT_FILTERS: FiltersState = {
  search: "",
  status: "all",
  sort: "start",
}

export function Filters({
  value,
  onChange,
  messages: m,
  lang,
}: {
  value: FiltersState
  onChange: (next: FiltersState) => void
  messages: Messages
  lang: string
}) {
  const id = useId()
  return (
    <FieldGroup className="grid grid-cols-2 items-end gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
      <Field className="col-span-2 lg:col-span-1">
        <FieldLabel htmlFor={`${id}-search`}>{m.search}</FieldLabel>
        <Input
          id={`${id}-search`}
          name="har-search"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder={m.searchPlaceholder}
          value={value.search}
          onChange={(event) =>
            onChange({ ...value, search: event.target.value })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-status`}>{m.statusFilter}</FieldLabel>
        <Select
          dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
          value={value.status}
          onValueChange={(status: StatusFilter) =>
            onChange({ ...value, status })
          }
        >
          <SelectTrigger id={`${id}-status`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(["all", "failed", "redirects"] as const).map((status) => (
                <SelectItem key={status} value={status}>
                  {m[status]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-sort`}>{m.sort}</FieldLabel>
        <Select
          dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
          value={value.sort}
          onValueChange={(sort: SortOrder) => onChange({ ...value, sort })}
        >
          <SelectTrigger id={`${id}-sort`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(["start", "slowest", "largest"] as const).map((sort) => (
                <SelectItem key={sort} value={sort}>
                  {m[sort]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Button
        type="button"
        variant="ghost"
        className="col-span-2 lg:col-span-1"
        onClick={() => onChange(DEFAULT_FILTERS)}
        disabled={
          !value.search && value.status === "all" && value.sort === "start"
        }
      >
        {m.resetFilters}
      </Button>
    </FieldGroup>
  )
}

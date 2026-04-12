import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"

import type { InvisibleCategory } from "../core/unicode-invisible"

type FilterCardProps = Readonly<{
  title: string
  description: string
  selectAllLabel: string
  resetFiltersLabel: string
  categoryLabels: Record<InvisibleCategory, string>
  categories: readonly InvisibleCategory[]
  selectedCategories: readonly InvisibleCategory[]
  onToggle: (category: InvisibleCategory, checked: boolean) => void
  onSelectAll: () => void
  onReset: () => void
}>

function FilterCard({
  title,
  description,
  selectAllLabel,
  resetFiltersLabel,
  categoryLabels,
  categories,
  selectedCategories,
  onToggle,
  onSelectAll,
  onReset,
}: FilterCardProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center gap-3 text-sm font-medium"
          >
            <Checkbox
              checked={selectedCategories.includes(category)}
              onCheckedChange={(checked) => {
                onToggle(category, checked === true)
              }}
            />
            <span>{categoryLabels[category]}</span>
          </label>
        ))}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSelectAll}
          >
            {selectAllLabel}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onReset}>
            {resetFiltersLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { FilterCard }

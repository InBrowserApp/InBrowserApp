import { Badge } from "@workspace/ui/components/ui/badge"
import { TriangleAlert } from "@workspace/ui/icons"
import { isFailure } from "../core/analysis"
import type { Entry } from "../types"

export function StatusBadge({ entry }: { entry: Entry }) {
  const failed = isFailure(entry)
  return (
    <Badge variant={failed ? "outline" : "secondary"}>
      {failed ? (
        <TriangleAlert
          aria-hidden="true"
          className="text-destructive"
          data-icon="inline-start"
        />
      ) : null}
      {entry.status}
    </Badge>
  )
}

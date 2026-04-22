import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Search } from "@workspace/ui/icons"

import type {
  InvisibleCategory,
  InvisibleMatch,
} from "../core/unicode-invisible"

type FindingsTableProps = Readonly<{
  matches: readonly InvisibleMatch[]
  categoryLabels: Record<InvisibleCategory, string>
  title: string
  emptyDescription: string
  indexLabel: string
  lineLabel: string
  columnLabel: string
  codeLabel: string
  nameLabel: string
  categoryLabel: string
  previewLabel: string
}>

function FindingsTable({
  matches,
  categoryLabels,
  title,
  emptyDescription,
  indexLabel,
  lineLabel,
  columnLabel,
  codeLabel,
  nameLabel,
  categoryLabel,
  previewLabel,
}: FindingsTableProps) {
  if (matches.length === 0) {
    return (
      <Empty className="border-border/80 bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{indexLabel}</TableHead>
          <TableHead>{lineLabel}</TableHead>
          <TableHead>{columnLabel}</TableHead>
          <TableHead>{codeLabel}</TableHead>
          <TableHead>{nameLabel}</TableHead>
          <TableHead>{categoryLabel}</TableHead>
          <TableHead>{previewLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.map((match) => (
          <TableRow key={`${match.index}-${match.code}`}>
            <TableCell>{match.index}</TableCell>
            <TableCell>{match.line}</TableCell>
            <TableCell>{match.column}</TableCell>
            <TableCell className="font-mono text-xs whitespace-normal">
              {match.code}
            </TableCell>
            <TableCell className="font-mono text-xs whitespace-normal">
              {match.name}
            </TableCell>
            <TableCell>{categoryLabels[match.category]}</TableCell>
            <TableCell className="font-mono text-xs whitespace-normal">
              {match.token}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { FindingsTable }

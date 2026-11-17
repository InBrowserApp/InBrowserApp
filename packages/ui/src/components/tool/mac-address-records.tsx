import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"

type MacAddressRecordsProps = Readonly<{
  rows: readonly Readonly<{
    key: string
    prefix: string
    registry: string
    organization: string
    address: string
    blockHref: string
    organizationHref: string
  }>[]
  labels: Readonly<{
    prefix: string
    registry: string
    organization: string
    address: string
  }>
  showAllocation?: boolean
}>

const recordLinkClassName =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

function MacAddressRecords({
  rows,
  labels,
  showAllocation = true,
}: MacAddressRecordsProps) {
  return (
    <Table className="block table-fixed md:table">
      <TableHeader className="sr-only md:not-sr-only md:table-header-group">
        <TableRow>
          {showAllocation ? (
            <>
              <TableHead scope="col" className="px-4 text-start md:w-44">
                {labels.prefix}
              </TableHead>
              <TableHead scope="col" className="px-4 text-start md:w-24">
                {labels.registry}
              </TableHead>
            </>
          ) : null}
          <TableHead scope="col" className="px-4 text-start md:w-[30%]">
            {labels.organization}
          </TableHead>
          <TableHead scope="col" className="px-4 text-start">
            {labels.address}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="block md:table-row-group">
        {rows.map((row) => (
          <TableRow
            key={row.key}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 p-4 md:table-row md:p-0"
          >
            {showAllocation ? (
              <>
                <TableCell className="min-w-0 p-0 align-top whitespace-normal md:p-4">
                  <a
                    href={row.blockHref}
                    dir="ltr"
                    translate="no"
                    className={`${recordLinkClassName} inline-block font-mono text-sm break-all tabular-nums`}
                  >
                    {row.prefix}
                  </a>
                </TableCell>
                <TableCell className="p-0 align-top md:p-4">
                  <Badge variant="outline" dir="ltr" translate="no">
                    {row.registry}
                  </Badge>
                </TableCell>
              </>
            ) : null}
            <TableCell className="col-span-2 min-w-0 p-0 align-top wrap-anywhere whitespace-normal md:p-4">
              <a href={row.organizationHref} className={recordLinkClassName}>
                <bdi translate="no">{row.organization}</bdi>
              </a>
            </TableCell>
            <TableCell className="col-span-2 min-w-0 p-0 align-top wrap-anywhere whitespace-normal text-muted-foreground md:p-4">
              <bdi translate="no">{row.address || "—"}</bdi>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { MacAddressRecords }

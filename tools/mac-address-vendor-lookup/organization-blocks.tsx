import {
  getBlockRange,
  makeToolHref,
  type Assignment,
} from "@workspace/mac-address"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import type English from "./messages/en.json"

function OrganizationBlocks({
  records,
  language,
  messages,
}: Readonly<{
  records: readonly Assignment[]
  language: string
  messages: typeof English
}>) {
  const addresses = new Set(records.map((record) => record.address))
  const sharedAddress = addresses.size === 1 ? records[0]!.address : null
  return (
    <div className="flex flex-col gap-3">
      {sharedAddress ? (
        <p className="px-4 text-sm wrap-anywhere text-muted-foreground">
          <bdi translate="no">{sharedAddress}</bdi>
        </p>
      ) : null}
      <Table className="block table-fixed sm:table">
        <TableHeader className="sr-only sm:not-sr-only sm:table-header-group">
          <TableRow>
            <TableHead scope="col" className="px-4 text-start sm:w-48">
              {messages.prefix}
            </TableHead>
            <TableHead scope="col" className="px-4 text-start sm:w-24">
              {messages.registry}
            </TableHead>
            {sharedAddress === null ? (
              <TableHead scope="col" className="px-4 text-start">
                {messages.address}
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody className="block sm:table-row-group">
          {records.map((record) => (
            <TableRow
              key={`${record.registry}-${record.assignment}-${record.address}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 px-4 py-3 sm:table-row sm:p-0"
            >
              <TableCell className="min-w-0 p-0 align-top whitespace-normal sm:px-4 sm:py-3">
                <a
                  href={makeToolHref(language, "mac-address-block-lookup", {
                    q: record.assignment,
                    registry: record.registry,
                  })}
                  dir="ltr"
                  translate="no"
                  className="inline-block rounded-sm font-mono text-sm break-all tabular-nums underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {getBlockRange(record).prefix}
                </a>
              </TableCell>
              <TableCell className="p-0 align-top sm:px-4 sm:py-3">
                <Badge variant="outline" dir="ltr" translate="no">
                  {record.registry}
                </Badge>
              </TableCell>
              {sharedAddress === null ? (
                <TableCell className="col-span-2 min-w-0 p-0 align-top text-sm wrap-anywhere whitespace-normal text-muted-foreground sm:px-4 sm:py-3">
                  <bdi translate="no">{record.address || "—"}</bdi>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrganizationBlocks

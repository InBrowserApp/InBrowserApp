import { ScrollArea, ScrollBar } from "@workspace/ui/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"

import type { DomainAddressRecord } from "../core/ip-info-lookup"
import type { IpInfoLookupMessages } from "../types"

function RecordTable({
  records,
  messages,
}: Readonly<{
  records: readonly DomainAddressRecord[]
  messages: IpInfoLookupMessages
}>) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/70">
      <div className="grid gap-1 border-b p-4">
        <h3 className="font-medium">{messages.domainRecords}</h3>
        <p className="text-sm text-muted-foreground">
          {messages.domainRecordsDescription}
        </p>
      </div>
      <ScrollArea className="w-full">
        <div className="min-w-[34rem]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>{messages.recordType}</TableHead>
                <TableHead>{messages.address}</TableHead>
                <TableHead className="w-28">{messages.ttl}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={`${record.type}-${record.value}`}>
                  <TableCell className="font-medium">{record.type}</TableCell>
                  <TableCell className="font-mono break-all">
                    {record.value}
                  </TableCell>
                  <TableCell className="font-mono">
                    {record.ttl === null
                      ? messages.unavailable
                      : `${record.ttl} ${messages.secondsAbbreviation}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

export { RecordTable }

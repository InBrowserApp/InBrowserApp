import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Input } from "@workspace/ui/components/ui/input"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"
import { Network, Trash2 } from "@workspace/ui/icons"

import type { UrlParserBuilderMessages, UrlQueryRow } from "../types"

type UrlQueryCardProps = Readonly<{
  queryParams: readonly UrlQueryRow[]
  messages: UrlParserBuilderMessages
  onAddQueryParam: () => void
  onChangeQueryParam: (
    id: string,
    field: "key" | "value",
    value: string
  ) => void
  onRemoveQueryParam: (id: string) => void
}>

function UrlQueryCard({
  queryParams,
  messages,
  onAddQueryParam,
  onChangeQueryParam,
  onRemoveQueryParam,
}: UrlQueryCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{messages.queryCardLabel}</CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAddQueryParam}
          >
            {messages.addQueryParameterLabel}
          </Button>
        </div>
      </CardHeader>

      <ToolPanelCardContent className="pt-4">
        {queryParams.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/20">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Network className="size-4" />
                </EmptyMedia>
                <EmptyTitle>{messages.queryCardLabel}</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <EmptyDescription>{messages.emptyQueryState}</EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <ScrollArea className="h-[22rem]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{messages.queryKeyLabel}</TableHead>
                  <TableHead>{messages.queryValueLabel}</TableHead>
                  <TableHead className="w-0 text-right">
                    {messages.removeQueryParameterLabel}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queryParams.map((queryParam, index) => (
                  <TableRow key={queryParam.id}>
                    <TableCell className="align-top">
                      <Input
                        name={`query-key-${index + 1}`}
                        autoComplete="off"
                        spellCheck={false}
                        aria-label={`${messages.queryKeyLabel} ${index + 1}`}
                        value={queryParam.key}
                        onChange={(event) => {
                          onChangeQueryParam(
                            queryParam.id,
                            "key",
                            event.target.value
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        name={`query-value-${index + 1}`}
                        autoComplete="off"
                        spellCheck={false}
                        aria-label={`${messages.queryValueLabel} ${index + 1}`}
                        value={queryParam.value}
                        onChange={(event) => {
                          onChangeQueryParam(
                            queryParam.id,
                            "value",
                            event.target.value
                          )
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`${messages.removeQueryParameterLabel} ${index + 1}`}
                        onClick={() => {
                          onRemoveQueryParam(queryParam.id)
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-end border-t">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onAddQueryParam}
        >
          {messages.addQueryParameterLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { UrlQueryCard }

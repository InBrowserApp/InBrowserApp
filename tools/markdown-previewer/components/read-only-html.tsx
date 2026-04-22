import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"
import { Braces } from "@workspace/ui/icons"

type ReadOnlyHtmlProps = Readonly<{
  ariaLabel: string
  emptyDescription: string
  emptyTitle: string
  value: string
}>

function ReadOnlyHtml({
  ariaLabel,
  emptyDescription,
  emptyTitle,
  value,
}: ReadOnlyHtmlProps) {
  const hasContent = value.trim().length > 0

  return (
    <div className="min-h-0 overflow-hidden rounded-xl border bg-background">
      <ScrollArea
        role="region"
        aria-label={ariaLabel}
        className="h-[32rem] min-h-0"
      >
        {hasContent ? (
          <pre className="min-h-full px-4 py-3 font-mono text-xs leading-6 whitespace-pre-wrap text-foreground">
            <code>{value}</code>
          </pre>
        ) : (
          <Empty className="min-h-[32rem] rounded-none border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Braces />
              </EmptyMedia>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ScrollArea>
    </div>
  )
}

export { ReadOnlyHtml }

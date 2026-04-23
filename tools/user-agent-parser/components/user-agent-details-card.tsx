import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { Search } from "@workspace/ui/icons"

import type {
  UserAgentParserMessages,
  UserAgentParserSection,
} from "../client/types"

type UserAgentDetailsCardProps = Readonly<{
  hasOutput: boolean
  messages: UserAgentParserMessages
  sections: readonly UserAgentParserSection[]
}>

function UserAgentDetailsCard({
  hasOutput,
  messages,
  sections,
}: UserAgentDetailsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages["parsed-details"]}</CardTitle>
        <CardDescription>{messages["empty-state"]}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {hasOutput ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-xl border border-border/70 bg-muted/20 p-4"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                <dl className="mt-3 grid gap-3">
                  {section.items.map((item) => (
                    <div key={item.label} className="grid gap-1">
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {item.label}
                      </dt>
                      <dd className="text-sm leading-6 break-words text-foreground">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        ) : (
          <Empty className="min-h-80 flex-1 border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>{messages["parsed-details"]}</EmptyTitle>
              <EmptyDescription>{messages["empty-state"]}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { UserAgentDetailsCard }

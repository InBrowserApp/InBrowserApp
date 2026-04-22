import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"

import type { RobotsTxtGeneratorMessages } from "../client/types"
import type { RobotsGroup } from "../core/robots"
import { GroupEditor } from "./group-editor"

type GroupsCardProps = Readonly<{
  messages: RobotsTxtGeneratorMessages
  advanced: boolean
  groups: readonly RobotsGroup[]
  onAddGroup: () => void
  onGroupCrawlDelayChange: (groupId: string, crawlDelay: number | null) => void
  onGroupRemove: (groupId: string) => void
  onGroupRulesChange: (groupId: string, rules: RobotsGroup["rules"]) => void
  onGroupUserAgentsAdd: (
    groupId: string,
    nextUserAgents: readonly string[]
  ) => void
  onGroupUserAgentsChange: (
    groupId: string,
    userAgents: readonly string[]
  ) => void
}>

function GroupsCard({
  messages,
  advanced,
  groups,
  onAddGroup,
  onGroupCrawlDelayChange,
  onGroupRemove,
  onGroupRulesChange,
  onGroupUserAgentsAdd,
  onGroupUserAgentsChange,
}: GroupsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.groups}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="min-h-0 gap-4 overflow-hidden">
        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-4 pr-4">
            {groups.map((group, groupIndex) => (
              <GroupEditor
                key={group.id}
                messages={messages}
                advanced={advanced}
                group={group}
                groupIndex={groupIndex}
                groupCount={groups.length}
                onGroupCrawlDelayChange={onGroupCrawlDelayChange}
                onGroupRemove={onGroupRemove}
                onGroupRulesChange={onGroupRulesChange}
                onGroupUserAgentsAdd={onGroupUserAgentsAdd}
                onGroupUserAgentsChange={onGroupUserAgentsChange}
              />
            ))}
          </div>
        </ScrollArea>
      </ToolPanelCardContent>
      <ToolPanelCardFooter className="justify-start gap-2 border-t">
        <Button type="button" variant="outline" size="sm" onClick={onAddGroup}>
          {messages.addGroup}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { GroupsCard }

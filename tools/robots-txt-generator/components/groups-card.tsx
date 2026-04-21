import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Trash2 } from "@workspace/ui/icons"

import type { RobotsTxtGeneratorMessages } from "../client/types"
import {
  AI_CRAWLER_USER_AGENTS,
  SEARCH_ENGINE_USER_AGENTS,
  createRule,
  type RobotsGroup,
  type RuleType,
} from "../core/robots"

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
      <ToolPanelCardContent className="gap-4">
        {groups.map((group, groupIndex) => {
          const groupTitle = messages.groupTitle.replace(
            "{index}",
            String(groupIndex + 1)
          )

          function updateUserAgent(index: number, value: string) {
            onGroupUserAgentsChange(
              group.id,
              group.userAgents.map((userAgent, userAgentIndex) =>
                userAgentIndex === index ? value : userAgent
              )
            )
          }

          function addUserAgent() {
            onGroupUserAgentsChange(group.id, [...group.userAgents, ""])
          }

          function removeUserAgent(index: number) {
            onGroupUserAgentsChange(
              group.id,
              group.userAgents.filter(
                (_, userAgentIndex) => userAgentIndex !== index
              )
            )
          }

          function updateRule(
            index: number,
            nextRule: RobotsGroup["rules"][number]
          ) {
            onGroupRulesChange(
              group.id,
              group.rules.map((rule, ruleIndex) =>
                ruleIndex === index ? nextRule : rule
              )
            )
          }

          function addRule() {
            onGroupRulesChange(group.id, [...group.rules, createRule()])
          }

          function removeRule(index: number) {
            onGroupRulesChange(
              group.id,
              group.rules.filter((_, ruleIndex) => ruleIndex !== index)
            )
          }

          return (
            <section
              key={group.id}
              className="grid gap-4 rounded-xl border border-border/70 bg-muted/20 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {groupTitle}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={groups.length <= 1}
                  onClick={() => {
                    onGroupRemove(group.id)
                  }}
                >
                  <Trash2 data-icon="inline-start" />
                  {messages.removeGroup}
                </Button>
              </div>

              <div className="grid gap-3">
                <div className="text-sm font-medium text-foreground">
                  {messages.userAgents}
                </div>
                <div className="grid gap-2">
                  {group.userAgents.map((userAgent, userAgentIndex) => (
                    <div
                      key={`${group.id}-user-agent-${userAgentIndex}`}
                      className="flex items-center gap-2"
                    >
                      <Input
                        aria-label={`${messages.userAgents} ${userAgentIndex + 1}`}
                        value={userAgent}
                        placeholder={messages.userAgentPlaceholder}
                        onChange={(event) => {
                          updateUserAgent(userAgentIndex, event.target.value)
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`remove user-agent ${userAgentIndex + 1}`}
                        onClick={() => {
                          removeUserAgent(userAgentIndex)
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addUserAgent}
                  >
                    {messages.addUserAgent}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onGroupUserAgentsAdd(group.id, SEARCH_ENGINE_USER_AGENTS)
                    }}
                  >
                    {messages.presetSearchEngines}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onGroupUserAgentsAdd(group.id, AI_CRAWLER_USER_AGENTS)
                    }}
                  >
                    {messages.presetAiCrawlers}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {messages.userAgentHint}
                </div>
              </div>

              <div className="grid gap-3">
                <div className="text-sm font-medium text-foreground">
                  {messages.rules}
                </div>
                <div className="grid gap-2">
                  {group.rules.map((rule, ruleIndex) => (
                    <div
                      key={`${group.id}-rule-${ruleIndex}`}
                      className="grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto]"
                    >
                      <Select
                        value={rule.type}
                        onValueChange={(value) => {
                          updateRule(ruleIndex, {
                            ...rule,
                            type: value as RuleType,
                          })
                        }}
                      >
                        <SelectTrigger
                          aria-label={`${messages.rules} ${ruleIndex + 1}`}
                          className="w-full"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="allow">
                              {messages.ruleAllow}
                            </SelectItem>
                            <SelectItem value="disallow">
                              {messages.ruleDisallow}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Input
                        aria-label={`${messages.pathPlaceholder} ${ruleIndex + 1}`}
                        value={rule.path}
                        placeholder={messages.pathPlaceholder}
                        onChange={(event) => {
                          updateRule(ruleIndex, {
                            ...rule,
                            path: event.target.value,
                          })
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`remove rule ${ruleIndex + 1}`}
                        onClick={() => {
                          removeRule(ruleIndex)
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRule}
                  >
                    {messages.addRule}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {messages.ruleHint}
                </div>
              </div>

              {advanced ? (
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-foreground">
                    {messages.crawlDelay}
                  </div>
                  <Input
                    aria-label={messages.crawlDelay}
                    type="number"
                    inputMode="decimal"
                    value={group.crawlDelay ?? ""}
                    placeholder={messages.crawlDelayPlaceholder}
                    onChange={(event) => {
                      const value = event.target.value.trim()
                      onGroupCrawlDelayChange(
                        group.id,
                        value === "" ? null : Number(value)
                      )
                    }}
                  />
                </div>
              ) : null}
            </section>
          )
        })}
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

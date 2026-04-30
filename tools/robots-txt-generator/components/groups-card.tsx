import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type {
  RobotsGroupDraft,
  RobotsTxtGeneratorPageMessages,
} from "../client/types"
import type { RuleType } from "../core/robots"

type GroupsCardProps = Readonly<{
  messages: RobotsTxtGeneratorPageMessages
  groups: RobotsGroupDraft[]
  advanced: boolean
  onAddGroup: () => void
  onRemoveGroup: (groupId: string) => void
  onUserAgentsTextChange: (groupId: string, nextValue: string) => void
  onAddUserAgentPreset: (groupId: string, preset: "search" | "ai") => void
  onAddRule: (groupId: string) => void
  onRemoveRule: (groupId: string, ruleIndex: number) => void
  onRuleTypeChange: (
    groupId: string,
    ruleIndex: number,
    nextValue: RuleType
  ) => void
  onRulePathChange: (
    groupId: string,
    ruleIndex: number,
    nextValue: string
  ) => void
  onCrawlDelayInputChange: (groupId: string, nextValue: string) => void
}>

function isInvalidCrawlDelayInput(value: string) {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return false
  }

  const parsed = Number(trimmed)

  return !Number.isFinite(parsed) || parsed < 0
}

function GroupsCard({
  messages,
  groups,
  advanced,
  onAddGroup,
  onRemoveGroup,
  onUserAgentsTextChange,
  onAddUserAgentPreset,
  onAddRule,
  onRemoveRule,
  onRuleTypeChange,
  onRulePathChange,
  onCrawlDelayInputChange,
}: GroupsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.groups}</CardTitle>
        <CardDescription>{messages.groupsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {groups.map((group, index) => {
          const isCrawlDelayInvalid = isInvalidCrawlDelayInput(
            group.crawlDelayInput
          )

          return (
            <section
              key={group.id}
              className="grid gap-4 rounded-xl border bg-card/40 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">
                  {messages.groupTitle.replace("{index}", String(index + 1))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={groups.length <= 1}
                  onClick={() => {
                    onRemoveGroup(group.id)
                  }}
                >
                  {messages.removeGroup}
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={group.id + "-user-agents"}>
                  {messages.userAgents}
                </Label>
                <Textarea
                  id={group.id + "-user-agents"}
                  name={group.id + "-user-agents"}
                  rows={4}
                  spellCheck={false}
                  aria-label={messages.userAgents}
                  value={group.userAgentsText}
                  onChange={(event) => {
                    onUserAgentsTextChange(group.id, event.target.value)
                  }}
                  placeholder={messages.userAgentPlaceholder}
                  className="min-h-28 resize-y font-mono text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddUserAgentPreset(group.id, "search")
                    }}
                  >
                    {messages.presetSearchEngines}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddUserAgentPreset(group.id, "ai")
                    }}
                  >
                    {messages.presetAiCrawlers}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {messages.userAgentHint}
                </p>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>{messages.rules}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddRule(group.id)
                    }}
                  >
                    {messages.addRule}
                  </Button>
                </div>

                {group.rules.length === 0 ? (
                  <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
                    {messages.ruleHint}
                  </div>
                ) : (
                  group.rules.map((rule, ruleIndex) => (
                    <div
                      key={group.id + "-rule-" + String(ruleIndex)}
                      className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <Select
                        value={rule.type}
                        onValueChange={(value) => {
                          if (value === "allow" || value === "disallow") {
                            onRuleTypeChange(group.id, ruleIndex, value)
                          }
                        }}
                      >
                        <SelectTrigger
                          aria-label={messages.ruleType}
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
                        name={group.id + "-rule-path-" + String(ruleIndex)}
                        autoComplete="off"
                        spellCheck={false}
                        aria-label={messages.rulePath}
                        value={rule.path}
                        onChange={(event) => {
                          onRulePathChange(
                            group.id,
                            ruleIndex,
                            event.target.value
                          )
                        }}
                        placeholder={messages.pathPlaceholder}
                        className="font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onRemoveRule(group.id, ruleIndex)
                        }}
                      >
                        {messages.removeRule}
                      </Button>
                    </div>
                  ))
                )}

                <p className="text-xs text-muted-foreground">
                  {messages.ruleHint}
                </p>

                {advanced ? (
                  <div className="grid gap-2">
                    <Label htmlFor={group.id + "-crawl-delay"}>
                      {messages.crawlDelay}
                    </Label>
                    <Input
                      id={group.id + "-crawl-delay"}
                      name={group.id + "-crawl-delay"}
                      type="number"
                      min="0"
                      step="0.1"
                      inputMode="decimal"
                      autoComplete="off"
                      spellCheck={false}
                      aria-label={messages.crawlDelay}
                      aria-invalid={isCrawlDelayInvalid || undefined}
                      value={group.crawlDelayInput}
                      onChange={(event) => {
                        onCrawlDelayInputChange(group.id, event.target.value)
                      }}
                      placeholder={messages.crawlDelayPlaceholder}
                      className="font-mono text-sm"
                    />
                    {isCrawlDelayInvalid ? (
                      <p className="text-xs text-destructive">
                        {messages.crawlDelayInvalid}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </section>
          )
        })}

        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddGroup}
          >
            {messages.addGroup}
          </Button>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { GroupsCard }

import { useEffect, useState } from "react"

import { STORAGE_KEY } from "./client/constants"
import type { RobotsTxtGeneratorPageMessages } from "./client/types"
import {
  createDefaultDraftState,
  createGroupDraft,
  draftToRobotsState,
  groupToDraft,
  parseStoredDraft,
} from "./client/utils"
import { GroupsCard } from "./components/groups-card"
import { OutputCard } from "./components/output-card"
import { PresetsCard } from "./components/presets-card"
import { SiteSettingsCard } from "./components/site-settings-card"
import {
  AI_CRAWLER_USER_AGENTS,
  SEARCH_ENGINE_USER_AGENTS,
  applyUserAgentPreset,
  buildRobotsTxt,
  getMatchingPreset,
  getPresetGroups,
  parseLineList,
  serializeLineList,
  type RobotsPreset,
  type RuleType,
} from "./core/robots"

type RobotsTxtGeneratorClientProps = Readonly<{
  messages: RobotsTxtGeneratorPageMessages
}>

function RobotsTxtGeneratorClient({ messages }: RobotsTxtGeneratorClientProps) {
  const [draft, setDraft] = useState(createDefaultDraftState)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    setDraft(parseStoredDraft(window.localStorage.getItem(STORAGE_KEY)))
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  const robotsState = draftToRobotsState(draft)
  const robotsContent = buildRobotsTxt(robotsState)
  const activePreset = getMatchingPreset(robotsState.groups)

  useEffect(() => {
    if (robotsContent.trim().length === 0) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([robotsContent], { type: "text/plain;charset=utf-8" })
    )

    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [robotsContent])

  function updateGroup(
    groupId: string,
    updater: (
      current: (typeof draft.groups)[number]
    ) => (typeof draft.groups)[number]
  ) {
    setDraft((current) => ({
      ...current,
      groups: current.groups.map((group) =>
        group.id === groupId ? updater(group) : group
      ),
    }))
  }

  function handleApplyPreset(preset: RobotsPreset) {
    setDraft((current) => ({
      ...current,
      groups: getPresetGroups(preset).map(groupToDraft),
    }))
  }

  function handleAddGroup() {
    setDraft((current) => ({
      ...current,
      groups: [...current.groups, createGroupDraft()],
    }))
  }

  function handleRemoveGroup(groupId: string) {
    setDraft((current) => {
      if (current.groups.length <= 1) {
        return current
      }

      return {
        ...current,
        groups: current.groups.filter((group) => group.id !== groupId),
      }
    })
  }

  function handleAddUserAgentPreset(groupId: string, preset: "search" | "ai") {
    const additions =
      preset === "search" ? SEARCH_ENGINE_USER_AGENTS : AI_CRAWLER_USER_AGENTS

    updateGroup(groupId, (group) => ({
      ...group,
      userAgentsText: serializeLineList(
        applyUserAgentPreset(parseLineList(group.userAgentsText), additions)
      ),
    }))
  }

  function handleAddRule(groupId: string) {
    updateGroup(groupId, (group) => ({
      ...group,
      rules: [...group.rules, { type: "disallow", path: "" }],
    }))
  }

  function handleRemoveRule(groupId: string, ruleIndex: number) {
    updateGroup(groupId, (group) => ({
      ...group,
      rules: group.rules.filter((_, index) => index !== ruleIndex),
    }))
  }

  function handleRuleTypeChange(
    groupId: string,
    ruleIndex: number,
    nextValue: RuleType
  ) {
    updateGroup(groupId, (group) => ({
      ...group,
      rules: group.rules.map((rule, index) =>
        index === ruleIndex ? { ...rule, type: nextValue } : rule
      ),
    }))
  }

  function handleRulePathChange(
    groupId: string,
    ruleIndex: number,
    nextValue: string
  ) {
    updateGroup(groupId, (group) => ({
      ...group,
      rules: group.rules.map((rule, index) =>
        index === ruleIndex ? { ...rule, path: nextValue } : rule
      ),
    }))
  }

  return (
    <div className="grid gap-6">
      <PresetsCard
        messages={messages}
        activePreset={activePreset}
        onApplyPreset={handleApplyPreset}
      />
      <SiteSettingsCard
        messages={messages}
        sitemapsText={draft.sitemapsText}
        advanced={draft.advanced}
        host={draft.host}
        onSitemapsTextChange={(nextValue) => {
          setDraft((current) => ({ ...current, sitemapsText: nextValue }))
        }}
        onAdvancedChange={(nextValue) => {
          setDraft((current) => ({ ...current, advanced: nextValue }))
        }}
        onHostChange={(nextValue) => {
          setDraft((current) => ({ ...current, host: nextValue }))
        }}
      />
      <GroupsCard
        messages={messages}
        groups={draft.groups}
        advanced={draft.advanced}
        onAddGroup={handleAddGroup}
        onRemoveGroup={handleRemoveGroup}
        onUserAgentsTextChange={(groupId, nextValue) => {
          updateGroup(groupId, (group) => ({
            ...group,
            userAgentsText: nextValue,
          }))
        }}
        onAddUserAgentPreset={handleAddUserAgentPreset}
        onAddRule={handleAddRule}
        onRemoveRule={handleRemoveRule}
        onRuleTypeChange={handleRuleTypeChange}
        onRulePathChange={handleRulePathChange}
        onCrawlDelayInputChange={(groupId, nextValue) => {
          updateGroup(groupId, (group) => ({
            ...group,
            crawlDelayInput: nextValue,
          }))
        }}
      />
      <OutputCard
        messages={messages}
        robotsContent={robotsContent}
        downloadUrl={downloadUrl}
      />
    </div>
  )
}

export default RobotsTxtGeneratorClient

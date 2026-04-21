import { startTransition, useEffect, useMemo, useRef, useState } from "react"

import type { RobotsTxtGeneratorMessages } from "./client/types"
import { GroupsCard } from "./components/groups-card"
import { OutputCard } from "./components/output-card"
import { PresetsCard } from "./components/presets-card"
import { SiteSettingsCard } from "./components/site-settings-card"
import {
  appendUniqueUserAgents,
  applyPreset,
  buildRobotsTxt,
  createDefaultState,
  createGroup,
  type RobotsState,
} from "./core/robots"

type RobotsTxtGeneratorClientProps = Readonly<{
  messages: RobotsTxtGeneratorMessages
}>

function RobotsTxtGeneratorClient({ messages }: RobotsTxtGeneratorClientProps) {
  const downloadUrlRef = useRef<string | null>(null)
  const [state, setState] = useState<RobotsState>(() => createDefaultState())
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const robotsContent = useMemo(() => buildRobotsTxt(state), [state])
  const hasOutput = robotsContent.trim().length > 0

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!hasOutput) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([robotsContent], {
        type: "text/plain;charset=utf-8",
      })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [hasOutput, robotsContent])

  function updateState(updater: (currentState: RobotsState) => RobotsState) {
    startTransition(() => {
      setState(updater)
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
      <div className="flex min-h-0 flex-col gap-6">
        <PresetsCard
          messages={messages}
          onApplyPreset={(preset) => {
            updateState((currentState) => applyPreset(currentState, preset))
          }}
        />

        <SiteSettingsCard
          messages={messages}
          advanced={state.advanced}
          host={state.host}
          sitemaps={state.sitemaps}
          onAdvancedChange={(advanced) => {
            updateState((currentState) => ({
              ...currentState,
              advanced,
            }))
          }}
          onHostChange={(host) => {
            updateState((currentState) => ({
              ...currentState,
              host,
            }))
          }}
          onSitemapsChange={(sitemaps) => {
            updateState((currentState) => ({
              ...currentState,
              sitemaps: [...sitemaps],
            }))
          }}
        />

        <GroupsCard
          messages={messages}
          advanced={state.advanced}
          groups={state.groups}
          onAddGroup={() => {
            updateState((currentState) => ({
              ...currentState,
              groups: [...currentState.groups, createGroup()],
            }))
          }}
          onGroupCrawlDelayChange={(groupId, crawlDelay) => {
            updateState((currentState) => ({
              ...currentState,
              groups: currentState.groups.map((group) =>
                group.id === groupId ? { ...group, crawlDelay } : group
              ),
            }))
          }}
          onGroupRemove={(groupId) => {
            updateState((currentState) => ({
              ...currentState,
              groups:
                currentState.groups.length <= 1
                  ? currentState.groups
                  : currentState.groups.filter((group) => group.id !== groupId),
            }))
          }}
          onGroupRulesChange={(groupId, rules) => {
            updateState((currentState) => ({
              ...currentState,
              groups: currentState.groups.map((group) =>
                group.id === groupId ? { ...group, rules: [...rules] } : group
              ),
            }))
          }}
          onGroupUserAgentsAdd={(groupId, nextUserAgents) => {
            updateState((currentState) => ({
              ...currentState,
              groups: currentState.groups.map((group) =>
                group.id === groupId
                  ? {
                      ...group,
                      userAgents: appendUniqueUserAgents(
                        group.userAgents,
                        nextUserAgents
                      ),
                    }
                  : group
              ),
            }))
          }}
          onGroupUserAgentsChange={(groupId, userAgents) => {
            updateState((currentState) => ({
              ...currentState,
              groups: currentState.groups.map((group) =>
                group.id === groupId
                  ? { ...group, userAgents: [...userAgents] }
                  : group
              ),
            }))
          }}
        />
      </div>

      <OutputCard
        downloadUrl={downloadUrl}
        hasOutput={hasOutput}
        messages={messages}
        robotsContent={robotsContent}
      />
    </div>
  )
}

export default RobotsTxtGeneratorClient

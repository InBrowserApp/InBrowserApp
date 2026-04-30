import {
  createDefaultState,
  createGroup,
  parseLineList,
  serializeLineList,
  type RobotsGroup,
  type RobotsRule,
  type RobotsState,
} from "../core/robots"

import type { RobotsDraftState, RobotsGroupDraft } from "./types"

function copyRule(rule: RobotsRule): RobotsRule {
  return { ...rule }
}

function groupToDraft(group: RobotsGroup): RobotsGroupDraft {
  return {
    id: group.id,
    userAgentsText: serializeLineList(group.userAgents),
    rules: group.rules.map(copyRule),
    crawlDelayInput: group.crawlDelay === null ? "" : String(group.crawlDelay),
  }
}

function createGroupDraft(
  overrides: Partial<RobotsGroupDraft> = {}
): RobotsGroupDraft {
  return {
    ...groupToDraft(createGroup()),
    ...overrides,
  }
}

function createDefaultDraftState(): RobotsDraftState {
  const state = createDefaultState()

  return {
    groups: state.groups.map(groupToDraft),
    sitemapsText: serializeLineList(state.sitemaps),
    host: state.host,
    advanced: state.advanced,
  }
}

function parseCrawlDelayInput(value: string): number | null {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return null
  }

  const nextValue = Number(trimmed)

  if (!Number.isFinite(nextValue) || nextValue < 0) {
    return null
  }

  return nextValue
}

function draftToRobotsState(draft: RobotsDraftState): RobotsState {
  return {
    groups: draft.groups.map((group) => ({
      id: group.id,
      userAgents: parseLineList(group.userAgentsText),
      rules: group.rules.map(copyRule),
      crawlDelay: parseCrawlDelayInput(group.crawlDelayInput),
    })),
    sitemaps: parseLineList(draft.sitemapsText),
    host: draft.host,
    advanced: draft.advanced,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function normalizeRule(value: unknown): RobotsRule | null {
  if (!isRecord(value)) {
    return null
  }

  if (value.type !== "allow" && value.type !== "disallow") {
    return null
  }

  return {
    type: value.type,
    path: typeof value.path === "string" ? value.path : "",
  }
}

function normalizeGroup(value: unknown): RobotsGroupDraft | null {
  if (!isRecord(value)) {
    return null
  }

  const rules = Array.isArray(value.rules)
    ? value.rules.map(normalizeRule).filter((rule) => rule !== null)
    : []

  return {
    id:
      typeof value.id === "string" && value.id.trim().length > 0
        ? value.id
        : createGroup().id,
    userAgentsText:
      typeof value.userAgentsText === "string" ? value.userAgentsText : "",
    rules,
    crawlDelayInput:
      typeof value.crawlDelayInput === "string" ? value.crawlDelayInput : "",
  }
}

function parseStoredDraft(value: string | null): RobotsDraftState {
  const fallback = createDefaultDraftState()

  if (value === null) {
    return fallback
  }

  try {
    const parsed = JSON.parse(value)

    if (!isRecord(parsed)) {
      return fallback
    }

    const groups = Array.isArray(parsed.groups)
      ? parsed.groups.map(normalizeGroup).filter((group) => group !== null)
      : fallback.groups

    return {
      groups: groups.length > 0 ? groups : fallback.groups,
      sitemapsText:
        typeof parsed.sitemapsText === "string"
          ? parsed.sitemapsText
          : fallback.sitemapsText,
      host: typeof parsed.host === "string" ? parsed.host : fallback.host,
      advanced:
        typeof parsed.advanced === "boolean"
          ? parsed.advanced
          : fallback.advanced,
    }
  } catch {
    return fallback
  }
}

export {
  createDefaultDraftState,
  createGroupDraft,
  draftToRobotsState,
  groupToDraft,
  parseStoredDraft,
}

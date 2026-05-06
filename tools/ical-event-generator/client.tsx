import { startTransition, useEffect, useRef, useState } from "react"

import { ToolPanelCard } from "@workspace/ui/components/tool/tool-panel-card"

import { EventDetailsCard } from "./components/event-details-card"
import { EventOutputCard } from "./components/event-output-card"
import { EventOverviewHero } from "./components/event-overview-hero"
import { EventRecurrenceCard } from "./components/event-recurrence-card"
import { EventRemindersCard } from "./components/event-reminders-card"
import { EventScheduleCard } from "./components/event-schedule-card"
import { buildIcalEventOutput } from "./core/ical-event"
import {
  createBlankFormState,
  createReminder,
  generateUid,
  restoreFormState,
} from "./core/form-state"
import {
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
} from "./core/time-zone"

import type { IcalEventGeneratorMessages } from "./types"
import type { IcalEventFormState, Reminder } from "./core/form-state"

type IcalEventGeneratorClientProps = Readonly<{
  initialNowMs?: number
  language?: string
  messages: IcalEventGeneratorMessages
}>

const STORAGE_KEY = "tools:ical-event-generator:form-state"
const INITIAL_TIME_ZONE = "UTC"
const INITIAL_UID = "draft@inbrowser.app"

function buildTimeZoneOptions(referenceTimestampMs: number) {
  return getSupportedTimeZones().map((timeZone) => {
    try {
      return {
        value: timeZone,
        label: `${timeZone} (${formatOffsetLabel(
          getTimeZoneOffsetMs(referenceTimestampMs, timeZone)
        )})`,
      }
    } catch {
      return {
        value: timeZone,
        label: timeZone,
      }
    }
  })
}

function resolveBrowserTimeZone() {
  if (typeof window === "undefined") {
    return INITIAL_TIME_ZONE
  }

  const value = Intl.DateTimeFormat().resolvedOptions().timeZone

  return isTimeZoneSupported(value) ? value : "UTC"
}

function createSampleState(
  messages: IcalEventGeneratorMessages,
  timeZone: string
): IcalEventFormState {
  const base = createBlankFormState(Date.now(), timeZone)

  return {
    ...base,
    title: messages.sample.title,
    location: messages.sample.location,
    description: messages.sample.description,
    recurrenceFrequency: "weekly",
    recurrenceWeekdays: ["MO", "WE"],
    recurrenceEndMode: "count",
    recurrenceCount: 6,
    remindersEnabled: true,
  }
}

function IcalEventGeneratorClient({
  initialNowMs,
  language = "en",
  messages,
}: IcalEventGeneratorClientProps) {
  const initialReferenceMs = initialNowMs ?? Date.now()
  const browserTimeZone = resolveBrowserTimeZone()
  const [timeZoneOptions] = useState(() =>
    buildTimeZoneOptions(initialReferenceMs)
  )
  const [formState, setFormState] = useState(() =>
    createBlankFormState(initialReferenceMs, INITIAL_TIME_ZONE, INITIAL_UID)
  )
  const [hasHydratedState, setHasHydratedState] = useState(false)
  const [stampMs, setStampMs] = useState(() => initialReferenceMs)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const downloadUrlRef = useRef<string | null>(null)
  const output = buildIcalEventOutput(formState, stampMs)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const hydratedNowMs = Date.now()
    const fallbackState = createBlankFormState(hydratedNowMs, browserTimeZone)
    setStampMs(hydratedNowMs)

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY)

      if (!storedValue) {
        setFormState(fallbackState)
        return
      }

      setFormState(restoreFormState(JSON.parse(storedValue), fallbackState))
    } catch {
      setFormState(fallbackState)
    } finally {
      setHasHydratedState(true)
    }
  }, [browserTimeZone])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasHydratedState) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formState))
  }, [formState, hasHydratedState])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (output.state !== "ready") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([output.icsContent], {
        type: "text/calendar;charset=utf-8",
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
  }, [output.icsContent, output.state])

  function updateFormState(patch: Partial<IcalEventFormState>) {
    setFormState((currentState) => ({
      ...currentState,
      ...patch,
    }))
  }

  return (
    <div className="grid min-w-0 gap-6">
      <EventOverviewHero
        language={language}
        messages={messages}
        formState={formState}
        onUseSample={() => {
          startTransition(() => {
            setStampMs(Date.now())
            setFormState(createSampleState(messages, browserTimeZone))
          })
        }}
        onReset={() => {
          startTransition(() => {
            setStampMs(Date.now())
            setFormState(createBlankFormState(Date.now(), browserTimeZone))
          })
        }}
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="grid min-w-0 gap-6">
          <ToolPanelCard className="min-w-0">
            <EventDetailsCard
              messages={messages}
              formState={formState}
              onFieldChange={(key, value) => {
                updateFormState({ [key]: value })
              }}
              onRegenerateUid={() => {
                updateFormState({ uid: generateUid() })
              }}
            />
          </ToolPanelCard>

          <ToolPanelCard className="min-w-0">
            <EventScheduleCard
              messages={messages}
              formState={formState}
              validationErrorKey={
                output.state === "error" ? output.errorKey : null
              }
              timeZoneOptions={timeZoneOptions}
              onFieldChange={(key, value) => {
                updateFormState({ [key]: value })
              }}
            />
          </ToolPanelCard>

          <ToolPanelCard className="min-w-0">
            <EventRecurrenceCard
              language={language}
              messages={messages}
              formState={formState}
              validationErrorKey={
                output.state === "error" ? output.errorKey : null
              }
              onFieldChange={(key, value) => {
                updateFormState({ [key]: value })
              }}
              onWeekdaysChange={(recurrenceWeekdays) => {
                updateFormState({ recurrenceWeekdays })
              }}
            />
          </ToolPanelCard>

          <ToolPanelCard className="min-w-0">
            <EventRemindersCard
              messages={messages}
              formState={formState}
              onToggleEnabled={(remindersEnabled) => {
                updateFormState({ remindersEnabled })
              }}
              onAddReminder={() => {
                updateFormState({
                  reminders: [...formState.reminders, createReminder()],
                  remindersEnabled: true,
                })
              }}
              onRemoveReminder={(reminderId) => {
                const reminders = formState.reminders.filter(
                  (reminder) => reminder.id !== reminderId
                )

                updateFormState({
                  reminders:
                    reminders.length > 0 ? reminders : [createReminder()],
                  remindersEnabled:
                    reminders.length > 1 ? formState.remindersEnabled : true,
                })
              }}
              onReminderChange={(reminderId, nextValue) => {
                updateFormState({
                  reminders: formState.reminders.map((reminder) =>
                    reminder.id === reminderId
                      ? ({ ...reminder, ...nextValue } satisfies Reminder)
                      : reminder
                  ),
                })
              }}
            />
          </ToolPanelCard>
        </div>

        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <ToolPanelCard className="min-w-0">
            <EventOutputCard
              messages={messages}
              output={output}
              downloadUrl={downloadUrl}
              formState={formState}
            />
          </ToolPanelCard>
        </div>
      </div>
    </div>
  )
}

export default IcalEventGeneratorClient

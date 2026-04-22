import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Button } from "@workspace/ui/components/ui/button"
import { Trash2 } from "@workspace/ui/icons"

import type { IcalEventGeneratorMessages } from "../types"
import type { IcalEventFormState, Reminder } from "../core/form-state"

type EventRemindersCardProps = Readonly<{
  messages: IcalEventGeneratorMessages
  formState: IcalEventFormState
  onToggleEnabled: (enabled: boolean) => void
  onAddReminder: () => void
  onRemoveReminder: (reminderId: string) => void
  onReminderChange: (
    reminderId: string,
    nextValue: Partial<Pick<Reminder, "amount" | "unit">>
  ) => void
}>

function EventRemindersCard({
  messages,
  formState,
  onToggleEnabled,
  onAddReminder,
  onRemoveReminder,
  onReminderChange,
}: EventRemindersCardProps) {
  return (
    <>
      <CardHeader className="border-b">
        <div>
          <CardTitle>{messages.reminders.title}</CardTitle>
          <CardDescription>{messages.reminders.description}</CardDescription>
        </div>
        <CardAction>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onAddReminder}
          >
            {messages.actions.addReminder}
          </Button>
        </CardAction>
      </CardHeader>
      <div className="px-4">
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="reminders-enabled">
              {messages.reminders.enabledLabel}
            </FieldLabel>
            <FieldContent>
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5">
                <FieldDescription>
                  {messages.reminders.description}
                </FieldDescription>
                <Switch
                  id="reminders-enabled"
                  checked={formState.remindersEnabled}
                  onCheckedChange={onToggleEnabled}
                />
              </div>
            </FieldContent>
          </Field>

          {formState.remindersEnabled
            ? formState.reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="grid gap-3 rounded-xl border bg-muted/20 p-3 md:grid-cols-[minmax(0,1fr)_12rem_auto]"
                >
                  <Field>
                    <FieldLabel>{messages.reminders.leadTimeLabel}</FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={String(reminder.amount)}
                      onChange={(event) => {
                        onReminderChange(reminder.id, {
                          amount: Number(event.target.value || 1),
                        })
                      }}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>{messages.reminders.title}</FieldLabel>
                    <Select
                      value={reminder.unit}
                      onValueChange={(value) => {
                        onReminderChange(reminder.id, {
                          unit: value as Reminder["unit"],
                        })
                      }}
                    >
                      <SelectTrigger className="w-full justify-between">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">
                          {messages.reminders.minutesLabel}
                        </SelectItem>
                        <SelectItem value="hours">
                          {messages.reminders.hoursLabel}
                        </SelectItem>
                        <SelectItem value="days">
                          {messages.reminders.daysLabel}
                        </SelectItem>
                        <SelectItem value="weeks">
                          {messages.reminders.weeksLabel}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="flex items-end md:justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onRemoveReminder(reminder.id)
                      }}
                    >
                      <Trash2 data-icon="inline-start" />
                      {messages.actions.removeReminder}
                    </Button>
                  </div>
                </div>
              ))
            : null}
        </FieldGroup>
      </div>
    </>
  )
}

export { EventRemindersCard }

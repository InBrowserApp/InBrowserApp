import {
  Card,
  CardContent,
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
import { Switch } from "@workspace/ui/components/ui/switch"
import { Mic, MicOff } from "@workspace/ui/icons"

import type { SettingsMessages } from "../types"

type SettingsCardProps = Readonly<{
  messages: SettingsMessages
  includeSystemAudio: boolean
  includeMicrophone: boolean
  microphoneSupported: boolean
  disabled: boolean
  onSystemAudioChange: (value: boolean) => void
  onMicrophoneChange: (value: boolean) => void
}>

function SettingsCard({
  messages,
  includeSystemAudio,
  includeMicrophone,
  microphoneSupported,
  disabled,
  onSystemAudioChange,
  onMicrophoneChange,
}: SettingsCardProps) {
  const microphoneDisabled = disabled || !microphoneSupported

  return (
    <Card aria-labelledby="screen-recorder-settings-title">
      <CardHeader>
        <CardTitle id="screen-recorder-settings-title">
          {messages.title}
        </CardTitle>
        <CardDescription>{messages.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal" data-disabled={disabled}>
            <Switch
              id="screen-recorder-system-audio"
              checked={includeSystemAudio}
              disabled={disabled}
              onCheckedChange={onSystemAudioChange}
              aria-label={messages.systemAudioLabel}
            />
            <FieldContent>
              <FieldLabel htmlFor="screen-recorder-system-audio">
                <Mic data-icon="inline-start" />
                {messages.systemAudioLabel}
              </FieldLabel>
              <FieldDescription>
                {messages.systemAudioDescription}
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="horizontal" data-disabled={microphoneDisabled}>
            <Switch
              id="screen-recorder-microphone"
              checked={includeMicrophone}
              disabled={microphoneDisabled}
              onCheckedChange={onMicrophoneChange}
              aria-label={messages.microphoneLabel}
            />
            <FieldContent>
              <FieldLabel htmlFor="screen-recorder-microphone">
                {microphoneSupported ? (
                  <Mic data-icon="inline-start" />
                ) : (
                  <MicOff data-icon="inline-start" />
                )}
                {messages.microphoneLabel}
              </FieldLabel>
              <FieldDescription>
                {microphoneSupported
                  ? messages.microphoneDescription
                  : messages.microphoneUnsupported}
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { SettingsCard }

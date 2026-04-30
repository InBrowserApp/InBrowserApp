import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import type { ConversionMode, JwkPemConverterMessages } from "../client/types"

type ModeToggleProps = Readonly<{
  mode: ConversionMode
  messages: JwkPemConverterMessages
  setMode: (value: ConversionMode) => void
}>

function ModeToggle({ mode, messages, setMode }: ModeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(nextValue) => {
        if (nextValue === "jwk" || nextValue === "pem") {
          setMode(nextValue)
        }
      }}
      variant="outline"
      className="grid w-full grid-cols-2"
    >
      <ToggleGroupItem value="jwk" className="w-full">
        {messages.tabJwkToPem}
      </ToggleGroupItem>
      <ToggleGroupItem value="pem" className="w-full">
        {messages.tabPemToJwk}
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export { ModeToggle }

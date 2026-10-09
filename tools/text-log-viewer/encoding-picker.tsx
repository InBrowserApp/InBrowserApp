import { useEffect, useRef, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import type { Messages } from "./types"
const encodings = [
  "UTF-8",
  "UTF-16LE",
  "UTF-16BE",
  "Windows-1252",
  "Windows-1251",
  "GB18030",
  "Shift_JIS",
]
export function EncodingPicker({
  value,
  onChange,
  m,
}: {
  value: string
  onChange: (value: string) => void
  m: Messages
}) {
  const trigger = useRef<HTMLButtonElement>(null)
  const [portal, setPortal] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setPortal(trigger.current!.closest("dialog"))
  }, [])
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        ref={trigger}
        aria-label={m.encoding}
        className="max-w-full"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent container={portal}>
        <SelectGroup>
          <SelectItem value="auto">{m.automatic}</SelectItem>
          {encodings.map((encoding) => (
            <SelectItem key={encoding} value={encoding.toLowerCase()}>
              {encoding}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

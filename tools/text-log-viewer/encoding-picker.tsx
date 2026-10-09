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
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={m.encoding} className="max-w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
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

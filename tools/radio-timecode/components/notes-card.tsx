import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"

import type { RadioTimecodeMessages } from "../types"

type NotesCardProps = Readonly<{
  messages: RadioTimecodeMessages
}>

function NotesCard({ messages }: NotesCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.notesTitle}</CardTitle>
      </CardHeader>

      <ToolPanelCardContent className="p-6">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
          {messages.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { NotesCard }

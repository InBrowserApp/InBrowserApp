import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { Binary, FileJson2 } from "@workspace/ui/icons"
import { JsonInput } from "./json-input"
import { PlistInput } from "./plist-input"
import type English from "./messages/en.json"

export type Messages = typeof English

export default function Client({
  messages: m,
  lang,
}: {
  messages: Messages
  lang: string
}) {
  return (
    <Tabs
      defaultValue="plist-to-json"
      dir={lang === "ar" || lang === "he" ? "rtl" : "ltr"}
      className="min-w-0 gap-3"
    >
      <TabsList className="h-auto max-w-full">
        <TabsTrigger
          value="plist-to-json"
          className="min-h-8 whitespace-normal"
        >
          <FileJson2 aria-hidden="true" />
          {m.plistToJson}
        </TabsTrigger>
        <TabsTrigger
          value="json-to-plist"
          className="min-h-8 whitespace-normal"
        >
          <Binary aria-hidden="true" />
          {m.jsonToPlist}
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="plist-to-json"
        forceMount
        className="data-[state=inactive]:hidden"
      >
        <PlistInput messages={m} />
      </TabsContent>
      <TabsContent
        value="json-to-plist"
        forceMount
        className="data-[state=inactive]:hidden"
      >
        <JsonInput messages={m} />
      </TabsContent>
    </Tabs>
  )
}

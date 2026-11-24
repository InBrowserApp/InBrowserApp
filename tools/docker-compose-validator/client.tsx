import { YamlValidationWorkspace } from "@workspace/ui/components/tool/yaml-validation-workspace"
import type EnglishMessages from "./messages/en.json"

const example = `services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
  cache:
    image: redis:alpine
    volumes:
      - cache-data:/data

volumes:
  cache-data: {}
`

function ComposeValidator({ messages }: { messages: typeof EnglishMessages }) {
  return (
    <YamlValidationWorkspace
      example={example}
      messages={messages}
      check={async (source) => {
        const { validateCompose } = await import("./core/validate-compose")
        return validateCompose(source).map((issue) => ({
          ...issue,
          message: issue.code ? messages[issue.code] : issue.message,
          language: issue.code ? undefined : "en",
        }))
      }}
    />
  )
}

export default ComposeValidator

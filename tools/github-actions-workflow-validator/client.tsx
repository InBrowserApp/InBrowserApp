import { YamlValidationWorkspace } from "@workspace/ui/components/tool/yaml-validation-workspace"
import { checkWorkflow } from "./engine/check-workflow"
import type EnglishMessages from "./messages/en.json"

const example = `name: CI
on: [push, pull_request]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - name: Check the repository
        run: echo "Ready for CI"
`

function WorkflowValidator({ messages }: { messages: typeof EnglishMessages }) {
  return (
    <YamlValidationWorkspace
      example={example}
      check={async (source) =>
        (await checkWorkflow(source)).map((issue) => ({
          ...issue,
          message: issue.code ? messages[issue.code] : issue.message,
          language: issue.code ? undefined : "en",
        }))
      }
      messages={messages}
    />
  )
}

export default WorkflowValidator

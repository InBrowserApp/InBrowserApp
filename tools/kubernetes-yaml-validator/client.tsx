import { YamlValidationWorkspace } from "@workspace/ui/components/tool/yaml-validation-workspace"
import type EnglishMessages from "./messages/en.json"

const example = `apiVersion: v1
kind: ConfigMap
metadata:
  name: web-settings
data:
  environment: production
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: http
`

function KubernetesValidator({
  messages,
}: {
  messages: typeof EnglishMessages
}) {
  return (
    <YamlValidationWorkspace
      example={example}
      messages={messages}
      check={async (source) => {
        const { validateKubernetes } =
          await import("./core/validate-kubernetes")
        return validateKubernetes(source).map((issue) => ({
          ...issue,
          message: issue.code ? messages[issue.code] : issue.message,
          language: issue.code ? undefined : "en",
          warning: issue.code === "unknownSchema",
        }))
      }}
    />
  )
}

export default KubernetesValidator

import { Wrench } from "../../../icons"
import { useMeshWorker } from "../../../lib/use-mesh-worker"
import { Alert, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import { Spinner } from "../../ui/spinner"
import { MeshFileInput } from "../mesh-file-input/input"
import { repairExample } from "./example"
import { RepairReport } from "./report"
import type { MeshRepair } from "@workspace/model-mesh/repair"
import type { MeshInspectorMessages } from "../mesh-inspector/messages"
import type { MeshRepairMessages } from "./messages"

type Props = {
  lang: string
  messages: MeshRepairMessages
  meshMessages: MeshInspectorMessages
}

function useStlMeshRepair() {
  return useMeshWorker<MeshRepair>(
    repairExample,
    () =>
      new Worker(new URL("./repair.worker.ts", import.meta.url), {
        type: "module",
      })
  )
}

export default function StlMeshRepair(props: Props) {
  const { messages: m, meshMessages } = props
  const { result, status, run } = useStlMeshRepair()

  return (
    <MeshFileInput
      accept=".stl"
      open={meshMessages.open}
      example={meshMessages.example}
      drop={m.drop}
      privacy={meshMessages.privacy}
      icon={<Wrench aria-hidden="true" />}
      filled={Boolean(result)}
      onFile={run}
      onExample={() => void run()}
      working={status === "working" ? m.working : undefined}
      error={status === "failed" ? m.failed : undefined}
    >
      <p className="sr-only" role="status">
        {result && !status ? m.result : ""}
      </p>
      {result && (
        <RepairReport
          {...props}
          name={result.file.name}
          report={result.data}
          previous={Boolean(status)}
        />
      )}
    </MeshFileInput>
  )
}

export function RepairCurrentStl({ file, ...props }: Props & { file: File }) {
  const { messages: m } = props
  const { result, status, run } = useStlMeshRepair()

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => void run(file)}
          disabled={status === "working" || Boolean(result)}
        >
          {status === "working" ? (
            <Spinner aria-hidden="true" data-icon="inline-start" />
          ) : (
            <Wrench aria-hidden="true" data-icon="inline-start" />
          )}
          {status === "working" ? m.working : m.action}
        </Button>
        <p className="sr-only" role="status">
          {status === "working" ? m.working : result ? m.result : ""}
        </p>
      </div>
      {status === "failed" && (
        <Alert variant="destructive">
          <AlertDescription>{m.failed}</AlertDescription>
        </Alert>
      )}
      {result && (
        <RepairReport {...props} name={result.file.name} report={result.data} />
      )}
    </>
  )
}

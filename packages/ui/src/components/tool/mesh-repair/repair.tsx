import { useState } from "react"
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

export function RepairCurrentStl({
  file,
  previous,
  ...props
}: Props & { file: File; previous: boolean }) {
  const { messages: m } = props
  const { result, status, run } = useStlMeshRepair()
  const [focusOnReady, setFocusOnReady] = useState(false)
  const working = status === "working"
  const blocked = previous || working

  return (
    <>
      {!result && (
        <Button
          className="justify-self-start aria-disabled:opacity-50"
          aria-disabled={blocked || undefined}
          onClick={(event) => {
            if (blocked) return
            setFocusOnReady(document.activeElement === event.currentTarget)
            void run(file)
          }}
        >
          {working ? (
            <Spinner aria-hidden="true" data-icon="inline-start" />
          ) : (
            <Wrench aria-hidden="true" data-icon="inline-start" />
          )}
          {working ? m.working : m.action}
        </Button>
      )}
      <p className="sr-only" role="status">
        {working ? m.working : result && !previous ? m.result : ""}
      </p>
      {!previous && status === "failed" && (
        <Alert variant="destructive">
          <AlertDescription>{m.failed}</AlertDescription>
        </Alert>
      )}
      {result && (
        <RepairReport
          {...props}
          name={result.file.name}
          report={result.data}
          previous={previous}
          focusOnReady={focusOnReady && !previous}
        />
      )}
    </>
  )
}

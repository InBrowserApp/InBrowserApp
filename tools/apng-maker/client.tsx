import {
  AnimationMaker,
  type AnimationMakerProps,
} from "@workspace/ui/components/tool/animation-maker"

function createWorker() {
  return new Worker(new URL("./encode.worker.ts", import.meta.url), {
    type: "module",
  })
}

export default function Maker(props: AnimationMakerProps) {
  return (
    <AnimationMaker
      {...props}
      createWorker={createWorker}
      downloadName="animation.png"
      maxPlays={65535}
    />
  )
}

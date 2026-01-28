declare module 'webpxmux/dist/webpxmux' {
  export interface WebPFrame {
    duration: number
    isKeyframe: boolean
    rgba: Uint32Array
  }

  export interface WebPFrames {
    frameCount: number
    width: number
    height: number
    loopCount: number
    bgColor: number
    frames: WebPFrame[]
  }

  export interface WebPXMuxInstance {
    waitRuntime: () => Promise<void>
    encodeFrames: (frames: WebPFrames) => Promise<Uint8Array>
  }

  export default function WebPXMux(wasmPath?: string): WebPXMuxInstance
}

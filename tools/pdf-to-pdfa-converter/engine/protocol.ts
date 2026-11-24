export type Profile = 1 | 2

export type EngineRequest = { bytes: ArrayBuffer; profile: Profile }

export type EngineResult =
  | { status: "ready"; bytes: ArrayBuffer; fontEncodingChanged: boolean }
  | {
      status:
        | "invalid"
        | "encrypted"
        | "failed"
        | "checkFailed"
        | "transparency"
    }

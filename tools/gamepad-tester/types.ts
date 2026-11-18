import type english from "./messages/en.json"

export type Messages = typeof english

export type GamepadInput = {
  index: number
  id: string
  mapping: GamepadMappingType
  axes: number[]
  buttons: { pressed: boolean; value: number }[]
}

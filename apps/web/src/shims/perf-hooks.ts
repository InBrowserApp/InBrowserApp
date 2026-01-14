export const performance = {
  now: () => (globalThis.performance ? globalThis.performance.now() : Date.now()),
}

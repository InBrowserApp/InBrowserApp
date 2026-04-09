const performance = globalThis.performance ?? {
  now() {
    return Date.now()
  },
}

export { performance }

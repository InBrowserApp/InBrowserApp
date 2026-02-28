type VoidFunctionWithArgs<TArgs extends unknown[]> = (...args: TArgs) => void

export type DebouncedFunction<TArgs extends unknown[]> = VoidFunctionWithArgs<TArgs> & {
  cancel: () => void
}

export const createDebouncedFn = <TArgs extends unknown[]>(
  fn: VoidFunctionWithArgs<TArgs>,
  delay: number,
): DebouncedFunction<TArgs> => {
  let timer: ReturnType<typeof setTimeout> | undefined

  const debounced = ((...args: TArgs) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }) as DebouncedFunction<TArgs>

  debounced.cancel = () => {
    if (!timer) {
      return
    }

    clearTimeout(timer)
    timer = undefined
  }

  return debounced
}

declare module 'sm-crypto' {
  export function sm3(
    input: string | ArrayLike<number>,
    options?: { key?: string | ArrayLike<number> },
  ): string
}

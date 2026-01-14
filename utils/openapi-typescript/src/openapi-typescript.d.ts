declare module 'openapi-typescript/dist/transform/index.mjs' {
  const transformSchema: (schema: unknown, ctx: unknown) => unknown[]
  export default transformSchema
}

declare module '../node_modules/openapi-typescript/dist/transform/index.mjs' {
  const transformSchema: (schema: unknown, ctx: unknown) => unknown[]
  export default transformSchema
}

declare module 'openapi-typescript/dist/lib/ts.mjs' {
  import type { PrinterOptions } from 'typescript'

  export function astToString(
    ast: unknown,
    options?: { fileName?: string; sourceText?: string; formatOptions?: PrinterOptions },
  ): string
}

declare module '../node_modules/openapi-typescript/dist/lib/ts.mjs' {
  import type { PrinterOptions } from 'typescript'

  export function astToString(
    ast: unknown,
    options?: { fileName?: string; sourceText?: string; formatOptions?: PrinterOptions },
  ): string
}

declare module 'openapi-typescript/dist/lib/utils.mjs' {
  export function resolveRef(
    schema: unknown,
    ref: string,
    options?: { silent?: boolean; visited?: string[] },
  ): unknown

  export function scanDiscriminators(
    schema: unknown,
    options: { silent?: boolean },
  ): { objects: Record<string, unknown>; refsHandled: string[] }
}

declare module '../node_modules/openapi-typescript/dist/lib/utils.mjs' {
  export function resolveRef(
    schema: unknown,
    ref: string,
    options?: { silent?: boolean; visited?: string[] },
  ): unknown

  export function scanDiscriminators(
    schema: unknown,
    options: { silent?: boolean },
  ): { objects: Record<string, unknown>; refsHandled: string[] }
}

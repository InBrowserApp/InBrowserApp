export type QueryState =
  | { state: 'empty' }
  | { state: 'json-error'; message: string }
  | { state: 'query-error'; message: string }
  | { state: 'ready'; values: unknown[]; paths: string[] }

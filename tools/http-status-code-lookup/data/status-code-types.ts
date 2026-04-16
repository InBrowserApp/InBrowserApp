export type HttpStatusCodeCategory =
  | "informational"
  | "success"
  | "redirection"
  | "client-error"
  | "server-error"

export interface HttpStatusCodeInfo {
  code: number
  name: string
  category: HttpStatusCodeCategory
  description: string
  common?: boolean
}

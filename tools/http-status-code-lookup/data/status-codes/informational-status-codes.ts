import type { HttpStatusCodeInfo } from "../status-code-types"

const informationalStatusCodes = [
  {
    code: 100,
    name: "Continue",
    category: "informational",
    description:
      "The server has received the request headers and the client should proceed to send the request body.",
  },
  {
    code: 101,
    name: "Switching Protocols",
    category: "informational",
    description:
      "The requester has asked the server to switch protocols and the server has agreed.",
  },
  {
    code: 102,
    name: "Processing",
    category: "informational",
    description:
      "The server has received and is processing the request, but no response is available yet.",
  },
  {
    code: 103,
    name: "Early Hints",
    category: "informational",
    description:
      "Used to return some response headers before final HTTP message.",
  },
] satisfies readonly HttpStatusCodeInfo[]

export { informationalStatusCodes }

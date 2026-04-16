import type { HttpStatusCodeInfo } from "../status-code-types"

const serverErrorStatusCodes = [
  {
    code: 500,
    name: "Internal Server Error",
    category: "server-error",
    description:
      "A generic error message, given when an unexpected condition was encountered.",
    common: true,
  },
  {
    code: 501,
    name: "Not Implemented",
    category: "server-error",
    description:
      "The server either does not recognize the request method, or it lacks the ability to fulfill the request.",
  },
  {
    code: 502,
    name: "Bad Gateway",
    category: "server-error",
    description:
      "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
    common: true,
  },
  {
    code: 503,
    name: "Service Unavailable",
    category: "server-error",
    description:
      "The server is currently unavailable (because it is overloaded or down for maintenance).",
    common: true,
  },
  {
    code: 504,
    name: "Gateway Timeout",
    category: "server-error",
    description:
      "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
    common: true,
  },
  {
    code: 505,
    name: "HTTP Version Not Supported",
    category: "server-error",
    description:
      "The server does not support the HTTP protocol version used in the request.",
  },
  {
    code: 506,
    name: "Variant Also Negotiates",
    category: "server-error",
    description:
      "Transparent content negotiation for the request results in a circular reference.",
  },
  {
    code: 507,
    name: "Insufficient Storage",
    category: "server-error",
    description:
      "The server is unable to store the representation needed to complete the request.",
  },
  {
    code: 508,
    name: "Loop Detected",
    category: "server-error",
    description:
      "The server detected an infinite loop while processing the request.",
  },
  {
    code: 510,
    name: "Not Extended",
    category: "server-error",
    description:
      "Further extensions to the request are required for the server to fulfill it.",
  },
  {
    code: 511,
    name: "Network Authentication Required",
    category: "server-error",
    description: "The client needs to authenticate to gain network access.",
  },
] satisfies readonly HttpStatusCodeInfo[]

export { serverErrorStatusCodes }

import type { HttpStatusCodeInfo } from "../status-code-types"

const clientErrorStatusCodes = [
  {
    code: 400,
    name: "Bad Request",
    category: "client-error",
    description:
      "The server cannot or will not process the request due to an apparent client error.",
    common: true,
  },
  {
    code: 401,
    name: "Unauthorized",
    category: "client-error",
    description:
      "Authentication is required and has failed or has not yet been provided.",
    common: true,
  },
  {
    code: 403,
    name: "Forbidden",
    category: "client-error",
    description: "The request was valid, but the server is refusing action.",
    common: true,
  },
  {
    code: 404,
    name: "Not Found",
    category: "client-error",
    description:
      "The requested resource could not be found but may be available in the future.",
    common: true,
  },
  {
    code: 405,
    name: "Method Not Allowed",
    category: "client-error",
    description:
      "A request method is not supported for the requested resource.",
    common: true,
  },
  {
    code: 406,
    name: "Not Acceptable",
    category: "client-error",
    description:
      "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.",
  },
  {
    code: 408,
    name: "Request Timeout",
    category: "client-error",
    description: "The server timed out waiting for the request.",
  },
  {
    code: 409,
    name: "Conflict",
    category: "client-error",
    description:
      "The request could not be processed because of conflict in the request.",
  },
  {
    code: 410,
    name: "Gone",
    category: "client-error",
    description:
      "The resource requested is no longer available and will not be available again.",
  },
  {
    code: 411,
    name: "Length Required",
    category: "client-error",
    description:
      "The request did not specify the length of its content, which is required by the requested resource.",
  },
  {
    code: 412,
    name: "Precondition Failed",
    category: "client-error",
    description:
      "The server does not meet one of the preconditions that the requester put on the request.",
  },
  {
    code: 413,
    name: "Payload Too Large",
    category: "client-error",
    description:
      "The request is larger than the server is willing or able to process.",
  },
  {
    code: 414,
    name: "URI Too Long",
    category: "client-error",
    description: "The URI provided was too long for the server to process.",
  },
  {
    code: 415,
    name: "Unsupported Media Type",
    category: "client-error",
    description:
      "The request entity has a media type which the server or resource does not support.",
  },
  {
    code: 416,
    name: "Range Not Satisfiable",
    category: "client-error",
    description:
      "The client has asked for a portion of the file, but the server cannot supply that portion.",
  },
  {
    code: 417,
    name: "Expectation Failed",
    category: "client-error",
    description:
      "The server cannot meet the requirements of the Expect request-header field.",
  },
  {
    code: 418,
    name: "I'm a teapot",
    category: "client-error",
    description:
      "This code was defined in 1998 as one of the traditional IETF April Fools jokes.",
  },
  {
    code: 422,
    name: "Unprocessable Entity",
    category: "client-error",
    description:
      "The request was well-formed but was unable to be followed due to semantic errors.",
  },
  {
    code: 425,
    name: "Too Early",
    category: "client-error",
    description:
      "Indicates that the server is unwilling to risk processing a request that might be replayed.",
  },
  {
    code: 426,
    name: "Upgrade Required",
    category: "client-error",
    description:
      "The client should switch to a different protocol such as TLS/1.0.",
  },
  {
    code: 428,
    name: "Precondition Required",
    category: "client-error",
    description: "The origin server requires the request to be conditional.",
  },
  {
    code: 429,
    name: "Too Many Requests",
    category: "client-error",
    description:
      "The user has sent too many requests in a given amount of time.",
    common: true,
  },
  {
    code: 431,
    name: "Request Header Fields Too Large",
    category: "client-error",
    description:
      "The server is unwilling to process the request because its header fields are too large.",
  },
  {
    code: 451,
    name: "Unavailable For Legal Reasons",
    category: "client-error",
    description:
      "The server is denying access to the resource as a consequence of a legal demand.",
  },
] satisfies readonly HttpStatusCodeInfo[]

export { clientErrorStatusCodes }

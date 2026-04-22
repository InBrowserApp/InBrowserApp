import type { HttpStatusCodeInfo } from "../status-code-types"

const redirectionStatusCodes = [
  {
    code: 300,
    name: "Multiple Choices",
    category: "redirection",
    description:
      "The request has more than one possible response. The user agent should choose one of them.",
  },
  {
    code: 301,
    name: "Moved Permanently",
    category: "redirection",
    description:
      "The URL of the requested resource has been changed permanently.",
    common: true,
  },
  {
    code: 302,
    name: "Found",
    category: "redirection",
    description:
      "The URL of the requested resource has been changed temporarily.",
    common: true,
  },
  {
    code: 304,
    name: "Not Modified",
    category: "redirection",
    description:
      "Indicates that the resource has not been modified since the version specified by the request headers.",
    common: true,
  },
  {
    code: 307,
    name: "Temporary Redirect",
    category: "redirection",
    description:
      "The server is redirecting the user agent to a different resource, as indicated by a Location header.",
  },
  {
    code: 308,
    name: "Permanent Redirect",
    category: "redirection",
    description:
      "The resource is now permanently located at another URL, specified by the Location header.",
  },
] satisfies readonly HttpStatusCodeInfo[]

export { redirectionStatusCodes }

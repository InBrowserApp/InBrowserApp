import type { HttpStatusCodeInfo } from "../status-code-types"

const successStatusCodes = [
  {
    code: 200,
    name: "OK",
    category: "success",
    description:
      "The request has succeeded. The meaning of success depends on the HTTP method.",
    common: true,
  },
  {
    code: 201,
    name: "Created",
    category: "success",
    description:
      "The request has been fulfilled and resulted in a new resource being created.",
    common: true,
  },
  {
    code: 202,
    name: "Accepted",
    category: "success",
    description:
      "The request has been accepted for processing, but the processing has not been completed.",
  },
  {
    code: 204,
    name: "No Content",
    category: "success",
    description:
      "The server successfully processed the request and is not returning any content.",
    common: true,
  },
  {
    code: 206,
    name: "Partial Content",
    category: "success",
    description:
      "The server is delivering only part of the resource due to a range header sent by the client.",
  },
] satisfies readonly HttpStatusCodeInfo[]

export { successStatusCodes }

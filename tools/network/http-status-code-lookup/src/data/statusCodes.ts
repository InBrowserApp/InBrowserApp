export interface HttpStatusCodeInfo {
  code: number
  name: string
  category: 'informational' | 'success' | 'redirection' | 'client-error' | 'server-error'
  description: string
  common?: boolean
}

export const statusCodes: HttpStatusCodeInfo[] = [
  // 1xx Informational
  {
    code: 100,
    name: 'Continue',
    category: 'informational',
    description:
      'The server has received the request headers and the client should proceed to send the request body.',
  },
  {
    code: 101,
    name: 'Switching Protocols',
    category: 'informational',
    description:
      'The requester has asked the server to switch protocols and the server has agreed.',
  },
  {
    code: 102,
    name: 'Processing',
    category: 'informational',
    description:
      'The server has received and is processing the request, but no response is available yet.',
  },
  {
    code: 103,
    name: 'Early Hints',
    category: 'informational',
    description: 'Used to return some response headers before final HTTP message.',
  },

  // 2xx Success
  {
    code: 200,
    name: 'OK',
    category: 'success',
    description: 'The request has succeeded. The meaning of success depends on the HTTP method.',
    common: true,
  },
  {
    code: 201,
    name: 'Created',
    category: 'success',
    description: 'The request has been fulfilled and resulted in a new resource being created.',
    common: true,
  },
  {
    code: 202,
    name: 'Accepted',
    category: 'success',
    description:
      'The request has been accepted for processing, but the processing has not been completed.',
  },
  {
    code: 204,
    name: 'No Content',
    category: 'success',
    description: 'The server successfully processed the request and is not returning any content.',
    common: true,
  },
  {
    code: 206,
    name: 'Partial Content',
    category: 'success',
    description:
      'The server is delivering only part of the resource due to a range header sent by the client.',
  },

  // 3xx Redirection
  {
    code: 300,
    name: 'Multiple Choices',
    category: 'redirection',
    description:
      'The request has more than one possible response. The user agent should choose one of them.',
  },
  {
    code: 301,
    name: 'Moved Permanently',
    category: 'redirection',
    description: 'The URL of the requested resource has been changed permanently.',
    common: true,
  },
  {
    code: 302,
    name: 'Found',
    category: 'redirection',
    description: 'The URL of the requested resource has been changed temporarily.',
    common: true,
  },
  {
    code: 304,
    name: 'Not Modified',
    category: 'redirection',
    description:
      'Indicates that the resource has not been modified since the version specified by the request headers.',
    common: true,
  },
  {
    code: 307,
    name: 'Temporary Redirect',
    category: 'redirection',
    description:
      'The server is redirecting the user agent to a different resource, as indicated by a Location header.',
  },
  {
    code: 308,
    name: 'Permanent Redirect',
    category: 'redirection',
    description:
      'The resource is now permanently located at another URL, specified by the Location header.',
  },

  // 4xx Client Error
  {
    code: 400,
    name: 'Bad Request',
    category: 'client-error',
    description:
      'The server cannot or will not process the request due to an apparent client error.',
    common: true,
  },
  {
    code: 401,
    name: 'Unauthorized',
    category: 'client-error',
    description: 'Authentication is required and has failed or has not yet been provided.',
    common: true,
  },
  {
    code: 403,
    name: 'Forbidden',
    category: 'client-error',
    description: 'The request was valid, but the server is refusing action.',
    common: true,
  },
  {
    code: 404,
    name: 'Not Found',
    category: 'client-error',
    description: 'The requested resource could not be found but may be available in the future.',
    common: true,
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    category: 'client-error',
    description: 'A request method is not supported for the requested resource.',
    common: true,
  },
  {
    code: 406,
    name: 'Not Acceptable',
    category: 'client-error',
    description:
      'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.',
  },
  {
    code: 408,
    name: 'Request Timeout',
    category: 'client-error',
    description: 'The server timed out waiting for the request.',
  },
  {
    code: 409,
    name: 'Conflict',
    category: 'client-error',
    description: 'The request could not be processed because of conflict in the request.',
  },
  {
    code: 410,
    name: 'Gone',
    category: 'client-error',
    description: 'The resource requested is no longer available and will not be available again.',
  },
  {
    code: 411,
    name: 'Length Required',
    category: 'client-error',
    description:
      'The request did not specify the length of its content, which is required by the requested resource.',
  },
  {
    code: 412,
    name: 'Precondition Failed',
    category: 'client-error',
    description:
      'The server does not meet one of the preconditions that the requester put on the request.',
  },
  {
    code: 413,
    name: 'Payload Too Large',
    category: 'client-error',
    description: 'The request is larger than the server is willing or able to process.',
  },
  {
    code: 414,
    name: 'URI Too Long',
    category: 'client-error',
    description: 'The URI provided was too long for the server to process.',
  },
  {
    code: 415,
    name: 'Unsupported Media Type',
    category: 'client-error',
    description:
      'The request entity has a media type which the server or resource does not support.',
  },
  {
    code: 416,
    name: 'Range Not Satisfiable',
    category: 'client-error',
    description:
      'The client has asked for a portion of the file, but the server cannot supply that portion.',
  },
  {
    code: 417,
    name: 'Expectation Failed',
    category: 'client-error',
    description: 'The server cannot meet the requirements of the Expect request-header field.',
  },
  {
    code: 418,
    name: "I'm a teapot",
    category: 'client-error',
    description: 'This code was defined in 1998 as one of the traditional IETF April Fools jokes.',
  },
  {
    code: 422,
    name: 'Unprocessable Entity',
    category: 'client-error',
    description:
      'The request was well-formed but was unable to be followed due to semantic errors.',
  },
  {
    code: 425,
    name: 'Too Early',
    category: 'client-error',
    description:
      'Indicates that the server is unwilling to risk processing a request that might be replayed.',
  },
  {
    code: 426,
    name: 'Upgrade Required',
    category: 'client-error',
    description: 'The client should switch to a different protocol such as TLS/1.0.',
  },
  {
    code: 428,
    name: 'Precondition Required',
    category: 'client-error',
    description: 'The origin server requires the request to be conditional.',
  },
  {
    code: 429,
    name: 'Too Many Requests',
    category: 'client-error',
    description: 'The user has sent too many requests in a given amount of time.',
    common: true,
  },
  {
    code: 431,
    name: 'Request Header Fields Too Large',
    category: 'client-error',
    description:
      'The server is unwilling to process the request because its header fields are too large.',
  },
  {
    code: 451,
    name: 'Unavailable For Legal Reasons',
    category: 'client-error',
    description: 'The server is denying access to the resource as a consequence of a legal demand.',
  },

  // 5xx Server Error
  {
    code: 500,
    name: 'Internal Server Error',
    category: 'server-error',
    description: 'A generic error message, given when an unexpected condition was encountered.',
    common: true,
  },
  {
    code: 501,
    name: 'Not Implemented',
    category: 'server-error',
    description:
      'The server either does not recognize the request method, or it lacks the ability to fulfill the request.',
  },
  {
    code: 502,
    name: 'Bad Gateway',
    category: 'server-error',
    description:
      'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
    common: true,
  },
  {
    code: 503,
    name: 'Service Unavailable',
    category: 'server-error',
    description:
      'The server is currently unavailable (because it is overloaded or down for maintenance).',
    common: true,
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    category: 'server-error',
    description:
      'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
    common: true,
  },
  {
    code: 505,
    name: 'HTTP Version Not Supported',
    category: 'server-error',
    description: 'The server does not support the HTTP protocol version used in the request.',
  },
  {
    code: 506,
    name: 'Variant Also Negotiates',
    category: 'server-error',
    description: 'Transparent content negotiation for the request results in a circular reference.',
  },
  {
    code: 507,
    name: 'Insufficient Storage',
    category: 'server-error',
    description: 'The server is unable to store the representation needed to complete the request.',
  },
  {
    code: 508,
    name: 'Loop Detected',
    category: 'server-error',
    description: 'The server detected an infinite loop while processing the request.',
  },
  {
    code: 510,
    name: 'Not Extended',
    category: 'server-error',
    description: 'Further extensions to the request are required for the server to fulfill it.',
  },
  {
    code: 511,
    name: 'Network Authentication Required',
    category: 'server-error',
    description: 'The client needs to authenticate to gain network access.',
  },
]

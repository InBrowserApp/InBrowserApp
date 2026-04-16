## What is an HTTP Status Code?

HTTP status codes are three-digit response codes returned by a server to show
what happened to a request. You will see them in browser developer tools, API
responses, server logs, uptime checks, and reverse proxy dashboards.

### How to Read the Main Status Code Families

- **1xx Informational:** The server received the request and the exchange is
  still in progress.
- **2xx Success:** The request completed successfully.
- **3xx Redirection:** The client needs to follow another location or reuse a
  cached result.
- **4xx Client Error:** The request itself has a problem, such as a missing
  resource, invalid input, or failed authentication.
- **5xx Server Error:** The server or an upstream dependency failed while
  handling a valid request.

### When This Lookup is Useful

Use this lookup when you need to confirm what a status code means, compare
similar codes such as 401 vs 403 or 502 vs 504, or search by a phrase from an
error message. The tool supports searching by code, status name, and
localized description.

### Why Correct Interpretation Matters

A status code is often the fastest clue during debugging. A 4xx response
usually points to the request, credentials, or target resource, while a 5xx
response usually points to the application, gateway, or upstream service.
Reading the category first helps you choose the right next step.

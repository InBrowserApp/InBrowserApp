const DEFAULT_JSON_TEXT = `{
  "people": [
    {
      "first": "James",
      "last": "Smith",
      "age": 32
    },
    {
      "first": "Sarah",
      "last": "Jones",
      "age": 27
    },
    {
      "first": "Harry",
      "last": "Wilson",
      "age": 42
    }
  ],
  "orders": [
    {
      "id": "A1",
      "total": 29.99
    },
    {
      "id": "B2",
      "total": 17.5
    }
  ],
  "active": true
}`

const DEFAULT_QUERY_TEXT = "people[*].last"

const EXAMPLE_QUERY_VALUES = {
  adults: "people[?age >= `30`].first",
  lastNames: "people[*].last",
  orders: "orders[?total > `20`].id",
} as const

const STORAGE_KEYS = {
  jsonText: "tools:jmespath-tester:json",
  queryText: "tools:jmespath-tester:query",
} as const

export {
  DEFAULT_JSON_TEXT,
  DEFAULT_QUERY_TEXT,
  EXAMPLE_QUERY_VALUES,
  STORAGE_KEYS,
}

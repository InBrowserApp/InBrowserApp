const DEFAULT_JSON_TEXT = `{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`

const DEFAULT_QUERY_TEXT = "$.store.book[*].author"

const EXAMPLE_QUERY_VALUES = {
  authors: "$.store.book[*].author",
  bicycleColor: "$.store.bicycle.color",
  cheapBooks: "$.store.book[?(@.price < 10)].title",
} as const

const STORAGE_KEYS = {
  jsonText: "tools:jsonpath-tester:json",
  queryText: "tools:jsonpath-tester:query",
} as const

export {
  DEFAULT_JSON_TEXT,
  DEFAULT_QUERY_TEXT,
  EXAMPLE_QUERY_VALUES,
  STORAGE_KEYS,
}

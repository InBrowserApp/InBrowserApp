## What is JSON Schema?

JSON Schema is a standard way to describe the shape of JSON data. It lets you express field types, nested structures, required keys, and validation-friendly constraints in a machine-readable format.

### What this generator does

Paste sample JSON and the tool infers an initial schema for objects, arrays, numbers, booleans, null values, and common string formats. The result is a draft you can copy, download, and refine.

### Example

For example, given this sample payload:

**Example input**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Generated schema**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### Tips

- Use representative sample data, especially inside arrays, so optional fields are easier to infer.
- Disable “Infer required properties” if your input is only a partial example.
- Disable “Allow additional properties” when you want a stricter schema by default.
- Keep string-format detection enabled to infer email, URI, UUID, and date-time values.

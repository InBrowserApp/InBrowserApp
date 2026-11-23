## How to apply a JSON Patch

Paste the original JSON document into the first editor and an RFC 6902 JSON Patch array into the second. Select **Apply patch** to preview and copy the updated JSON. To generate a patch, compare the original and modified documents in [JSON Diff Path](../json-diff-path/) and copy the **JSON Patch** output. Apply it to the same original document.

## JSON Patch example

The original document contains a status and one tag.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

This patch checks the original status, updates it, and appends a tag.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

The result is `{"status":"published","tags":["api","release"]}`.

## Supported operations and JSON Pointer syntax

- `add` creates or overwrites an object member, inserts an array item, or replaces the document at the root.
- `remove` deletes an existing value. `replace` sets an existing value to a new one.
- `move` takes an existing value from the `from` pointer and inserts it at `path`. `copy` inserts an independent copy.
- `test` checks whether the value at `path` equals the supplied `value` without modifying the document.

Paths use RFC 6901 JSON Pointer. Array indexes start at zero, so `/tags/0` refers to the first tag, and `/tags/-` appends a value when the operation adds to that array. Use `~1` for a slash and `~0` for a tilde inside an object key. For example, `/a~1b` addresses the key `a/b`. An empty path `""` addresses the whole document, and `/` addresses a member whose key is empty.

## Why a JSON Patch operation fails

Operations run in array order, and each operation sees the result of those before it. If a target is missing, an array index is out of bounds, or a `test` value differs, the tool highlights the first failure and stops. It only shows a JSON preview when the whole patch succeeds. An empty patch array `[]` returns the original document.

The browser applies the patch locally. The original JSON and patch stay in your browser.

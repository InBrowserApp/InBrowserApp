## What is UUID v3?

UUID v3 is a name-based UUID format. It takes a namespace UUID and a name,
hashes them with MD5, and formats the result as a standard UUID. The important
behavior is determinism: the same namespace and name always produce the same
UUID.

This tool runs entirely in your browser. The namespace, name, and generated UUID
stay on your device unless you copy the result elsewhere.

## When to use it

- Use UUID v3 when you need a stable identifier for a known name, such as a DNS
  name, URL, object path, or username.
- Pick the namespace that matches the kind of name you are identifying. DNS and
  URL are the most common presets.
- Reuse the same namespace consistently. Changing the namespace changes every
  generated UUID, even when the name stays the same.
- Prefer UUID v5 or another modern identifier when you have a choice and need a
  name-based UUID with a stronger hash. UUID v3 exists for compatibility with
  systems that specifically expect MD5-based UUIDs.

## Notes on safety

UUID v3 is not a random ID and is not secret. Anyone who knows the namespace and
name can regenerate the same UUID. Do not use it for passwords, session tokens,
API keys, or other values that must be unpredictable.

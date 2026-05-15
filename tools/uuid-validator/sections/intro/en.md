## What Is a UUID Validator?

A UUID validator checks whether an identifier is written in the standard 36-character UUID shape, such as `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. It is useful when you need to verify IDs copied from logs, APIs, databases, test fixtures, or user input before relying on them in code.

### Supported Input

This tool validates canonical UUID text with five hexadecimal groups in the `8-4-4-4-12` layout. Uppercase letters are accepted and normalized to lowercase. The nil UUID (`00000000-0000-0000-0000-000000000000`) and max UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) are treated as valid special values.

### Validation Details

For standard UUIDs, the validator checks the version nibble and the variant bits. Versions 1 through 8 are recognized, covering legacy RFC 4122 UUIDs and newer RFC 9562 layouts such as UUID v6, v7, and v8. The result panel also breaks the UUID into its five segments so you can inspect the exact bytes being validated.

### Privacy

Validation runs entirely in your browser. The UUID you paste is not uploaded, so the tool is safe to use with internal identifiers, database keys, and sample production logs that should stay local.

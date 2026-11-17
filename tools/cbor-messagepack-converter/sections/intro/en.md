## Inspect binary API payloads

CBOR and MessagePack are compact binary serialization formats for structured data. Use this converter to inspect API responses, WebSocket messages, or cached values as JSON, or create binary payloads from JSON for debugging. Everything is processed in your browser; inputs are not uploaded or saved.

## Encode JSON or decode bytes

Choose the binary format and conversion direction. To encode, enter JSON and choose Hex, Base64, or Base64URL for the output. To decode, paste bytes and select their input encoding. Changing the input encoding reinterprets the text already in the editor.

Open a JSON file when encoding, or a raw `.cbor`, `.msgpack`, or `.bin` file when decoding. Encoded text such as Hex or Base64 should be pasted into the editor. Convert, then copy the displayed text or download the result. Binary downloads contain the actual bytes and can be imported again.

## Preserve values and understand the limits

Integer literals keep every digit within the format’s supported 64-bit range. Values JSON cannot represent, such as binary fields, CBOR tags, and MessagePack extensions, appear as explicit typed wrappers. Enable Extended JSON to encode those wrappers back into binary; leave it off for ordinary JSON objects that happen to use wrapper keys.

For example, with Extended JSON enabled, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` encodes an exact integer and two binary bytes.

Each conversion handles one value, with an input limit of 1 MiB. Formatted JSON bytes counts the displayed, pretty-printed JSON rather than the original input. Re-encoding preserves supported values but may change map ordering or the choice of binary encoding. Open “Formats and type fidelity” above for wrapper syntax and unsupported types.

## Convert a binary Plist file to JSON

Choose **Open binary Plist** or drop an Apple binary `.plist` file. Review the formatted JSON, copy it, or download it as a `.json` file. Binary property lists start with the `bplist00` signature and appear in Apple app bundles, preferences, and archived data. The example shows how property-list values appear in JSON.

## Convert JSON to an Apple binary property list

Choose **JSON to Plist**, paste JSON or open a `.json` file, then choose **Convert to binary Plist**. Download the resulting `.plist` file. Strings, booleans, numbers, arrays, and objects map to the corresponding property-list types. Replace `null` with a value or omit its key. Files and pasted text are processed in your browser.

## Preserve dates, bytes, and large integers

JSON has no native date, byte data, or keyed-archive UID type. This converter uses explicit `$plist` tags so those values can travel in both directions without losing their meaning.

| Plist value                   | JSON example                                           |
| ----------------------------- | ------------------------------------------------------ |
| Date in UTC                   | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Bytes as Base64               | `{"$plist":"data","value":"AQID"}`                     |
| Large integer as decimal text | `{"$plist":"integer","value":"9007199254740993"}`      |
| Keyed-archive UID             | `{"$plist":"uid","value":42}`                          |

Keep the tags when converting back to Plist. Use a quoted decimal value with the integer tag for values outside JSON's safe integer range. A dictionary that has the same shape as a tag is wrapped with a `dictionary` tag to preserve its keys. Conversion preserves structure and supported values. Plist object ordering, numeric storage width, and the original binary bytes can change.

[Apple property list structure and types](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)

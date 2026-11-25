## 将二进制 Plist 文件转换为 JSON

选择**打开二进制 Plist**，或拖放一个 Apple 二进制 `.plist` 文件。你可以查看格式化后的 JSON，也可以复制内容或下载为 `.json` 文件。二进制属性列表以 `bplist00` 开头，常见于 Apple 应用程序包、偏好设置和归档数据。试用示例即可了解属性列表中的值在 JSON 中如何表示。

## 将 JSON 转换为 Apple 二进制属性列表

选择 **JSON 转 Plist**，粘贴 JSON 或打开 `.json` 文件，再选择**转换为二进制 Plist**，即可下载生成的 `.plist` 文件。字符串、布尔值、数字、数组和对象会转换为对应的属性列表类型。请将 `null` 替换为其他值，或省略对应的键。文件和粘贴的文本均在浏览器中处理。

## 保留日期、字节数据和大整数

JSON 没有表示日期、字节数据或键控归档 UID 的原生类型。转换器使用显式的 `$plist` 标签，让这些值在双向转换时保留原意。

| Plist 值                 | JSON 示例                                              |
| ------------------------ | ------------------------------------------------------ |
| UTC 日期                 | `{"$plist":"date","value":"2025-01-01T00:00:00.000Z"}` |
| Base64 编码的字节数据    | `{"$plist":"data","value":"AQID"}`                     |
| 以十进制文本表示的大整数 | `{"$plist":"integer","value":"9007199254740993"}`      |
| 键控归档 UID             | `{"$plist":"uid","value":42}`                          |

转回 Plist 时请保留这些标签。对于超出 JSON 安全整数范围的值，请使用整数标签，并用引号包裹十进制值。结构与标签相同的字典会用 `dictionary` 标签包裹，以保留其键。转换会保留数据结构和受支持的值。Plist 对象的顺序、数值的存储位宽以及原始二进制字节可能发生变化。

[Apple 属性列表的结构和类型](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFPropertyLists/CFPropertyLists.html)

## 打开 IPA 并查看主应用的元数据

拖放 iOS `.ipa` 文件，或选择**打开 IPA 文件**。查看器会读取主应用的属性列表，路径类似 `Payload/Trail Notes.app/Info.plist`。也可以先试用示例 IPA，了解会显示哪些字段。解包和属性列表解析都在浏览器中完成。

## 了解捆绑包标识符、版本和平台

捆绑包标识符存储在 `CFBundleIdentifier` 中，用于标识应用捆绑包。`CFBundleShortVersionString` 是发布版本，`CFBundleVersion` 用于标识构建。通过 `MinimumOSVersion` 和 `CFBundleSupportedPlatforms`，可以查看安装包中记录的最低系统版本和平台名称。显示名称来自 `CFBundleDisplayName` 或 `CFBundleName`。

## 检查并导出 Info.plist

选择 **Info.plist**，可以用可读的 XML 格式查看完整属性列表，包括概览未列出的键。查看器支持二进制和 XML 格式的属性列表。选择**复制 XML**，可将可读版本用于其他工具。选择**下载 Info.plist**，可保存原始文件内容。界面显示的归档路径会指出元数据来自哪个应用捆绑包。

[Apple 信息属性列表参考文档](https://developer.apple.com/documentation/bundleresources/information-property-list)

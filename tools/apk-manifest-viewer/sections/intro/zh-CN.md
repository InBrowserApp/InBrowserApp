## 打开 APK 查看应用清单

拖放 Android `.apk` 文件，或选择**打开 APK 或清单**。查看器会读取包内的 `AndroidManifest.xml`，包括大多数 APK 使用的编译后二进制 XML。你也可以打开已提取的二进制或文本清单。试用示例 APK，即可查看概览和解码后的 XML。文件留在浏览器中处理。

## 了解软件包、版本和 SDK 字段

**软件包名称**用于标识 Android 应用。版本名称是显示给用户的发布版本标识，版本代码则是 Android 用来确定更新顺序的数字。最低 SDK 是清单声明的最低 Android API 级别，目标 SDK 则指应用面向的 API 级别。清单中省略的字段会显示为“未指定”。

## 查看权限并导出 AndroidManifest.xml

概览会列出软件包声明的权限名称。设备上的实际权限授予情况由 Android 根据系统版本、应用设置和用户选择决定。打开**清单 XML**，即可查看组件、Intent 过滤器和带条件的权限声明。选择**复制 XML** 或**下载 XML**，即可保留解码后的文件。对已编译资源的引用可能以 `@0x7f010001` 之类的 ID 显示。

[Android 应用清单的结构和元素](https://developer.android.com/guide/topics/manifest/manifest-intro)

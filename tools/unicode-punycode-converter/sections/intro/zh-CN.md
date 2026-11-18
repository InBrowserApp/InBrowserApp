## 在 Unicode 域名和 Punycode 之间转换

将 `bücher.com` 之类的域名粘贴到 **Unicode 域名**，即可在 **ASCII 域名** 中得到 `xn--bcher-kva.com`。要查看 `xn--` 域名的原文，将它粘贴到 **ASCII 域名**。输入时，另一个字段会自动更新，两种格式都可以复制。

## 什么时候用哪种格式

Punycode 用 ASCII 字母、数字和连字符表示国际化域名（IDN）中的非 ASCII 字符。转换后的域名标签以 `xn--` 开头，`com` 等普通 ASCII 标签保持原样。如果 DNS 或托管设置要求 ASCII 域名，就复制 ASCII 版本。要看懂日志或配置文件里的域名，可以把它转换成 Unicode。

## 输入主机名即可

例如，若网址为 `https://bücher.com/catalog`，只需粘贴 `bücher.com`。工具也支持子域名，比如 `www.bücher.com` 会转换为 `www.xn--bcher-kva.com`。

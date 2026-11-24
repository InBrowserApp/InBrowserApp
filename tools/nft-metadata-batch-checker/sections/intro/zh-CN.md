## 在铸造前检查 NFT 元数据 JSON

选择 **本地文件**，可检查设备上的单个 JSON 文件或整个系列的文件夹。工具会逐项报告无效 JSON 和常见的元数据问题，例如名称为空、缺少图片、描述无效或属性格式有误。通过 **待核查** 找到需要修正的条目，也可以把完整报告下载为 JSON。

## 批量检查 Token URI

在 **Token URI** 中粘贴元数据地址，每行一个。如果系列使用数字编号，请选择 **URI 模板**，输入带占位符的地址，例如 `https://example.com/metadata/{id}.json`。设置起始 ID 和结束 ID，检查包含两端的范围。十进制格式按输入的写法使用 ID。**ERC-1155 十六进制** 按 ERC-1155 的 `{id}` 替换规则，用前导零将每个 ID 补成 64 个小写十六进制字符。

## 检查 NFT 图片和动画链接

启用 **检查媒体能否访问**，即可检查 `image` 和 `animation_url` 链接。如果元数据通过相对路径引用媒体，请选择整个本地文件夹。浏览器也可以检查 HTTP、IPFS 和 Arweave 资源。遇到网关错误、超时或跨域限制时，链接可能无法确认。请在你使用的网关或交易平台上复核这些链接。本地文件在浏览器中检查，通过 URI 检查则会访问相应的主机或网关。

有关字段定义和 Token URI 替换规则，请参阅 [OpenSea 元数据指南](https://docs.opensea.io/docs/metadata-standards)和 [ERC-1155 元数据规范](https://eips.ethereum.org/EIPS/eip-1155#metadata)。

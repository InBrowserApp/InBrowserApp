## 通过合约地址和 Token ID 查询 NFT 元数据

粘贴以太坊主网的 **合约地址**，输入 **Token ID**，然后点击 **查看元数据**。Token ID 可以是 `1` 这样的十进制数字，也可以是 `0x1` 这样的十六进制数字。点击 **试用示例** 可体验完整的查询流程。工具在浏览器中向以太坊发出只读 RPC 请求，无需连接钱包即可查询公开的 Token。

## 查看 Token URI、图片、特征和 JSON

工具会读取 ERC-721 的 `tokenURI` 或 ERC-1155 的 `uri`。**Token URI** 是合约返回的字符串。工具会读取它指向的元数据，并在相关字段存在时显示图片、名称和特征。在 **原始 JSON** 中可查看或复制未经修改的响应。支持 IPFS、HTTP、Arweave 和内嵌 JSON 的数据 URI。

## ERC-1155 如何替换 Token ID

ERC-1155 合约可以返回多个 Token 共用的模板。工具会将 `{id}` 替换为 64 位小写十六进制 Token ID，在左侧补零，且省略 `0x` 前缀。模板替换后，**解析后的 URI** 会显示实际用于获取该 Token 元数据的地址。图片链接等预览字段也会应用相同的替换规则。

## 为什么有 Token URI 却没有图片？

即使网站主机或 IPFS 网关暂时无法访问，合约仍可能返回 URI。若无法加载元数据，工具仍会保留 URI，供你复制。如果可以读取 JSON，请检查其中的 `image` 字段并直接访问图片来源。HTTP 主机也可能限制跨域请求，影响浏览器能读取的内容。

NFT 应用常用字段的定义见 [ERC-721 标准](https://eips.ethereum.org/EIPS/eip-721)、[ERC-1155 元数据规范](https://eips.ethereum.org/EIPS/eip-1155#metadata)和 [OpenSea 元数据指南](https://docs.opensea.io/docs/metadata-standards)。

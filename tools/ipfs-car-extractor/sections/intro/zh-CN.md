## 在浏览器中打开 IPFS 或 Filecoin 的 CAR 文件

从设备上选择一个 `.car` 文件。工具会在本地读取归档并显示根 CID。如果归档包含多个根 CID，请选择需要的那一个。IPFS 和 Filecoin 使用 CAR（Content Addressable aRchive，即内容寻址归档）格式。Apple 资源目录也使用 `.car` 扩展名，采用的是另一种格式。

## 提取文件或将 CAR 中的文件夹转为 ZIP

打开文件夹可查看其中的内容。选择文件后，点击 **下载文件** 保存原始字节。要一起导出文件夹及其子文件夹，请点击 **下载 ZIP**。ZIP 会保留 UnixFS 的文件夹结构。

## 缺少块是什么意思？

CAR 将内容保存为由 CID 标识的块。归档只包含部分内容时，根 CID 可能指向归档之外的块。如果某个条目需要的块缺失，请从源端获取完整归档，或下载所需块均在归档内的条目。CAR 还可保存其他 IPLD 格式的数据。本工具提取的文件和文件夹采用 UnixFS 格式。[IPLD CAR 格式规范](https://ipld.io/specs/transport/car/)

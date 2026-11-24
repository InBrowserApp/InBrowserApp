## 计算 CAR 归档或文件的 Piece CID

选择你准备发送给 Filecoin 存储提供商的原文件。点击 **计算 Piece CID**，然后复制工作流程所需的标识符。工具也会显示填充后的 Piece 大小，单位为字节。浏览器在本地读取文件并分块处理，文件内容留在你的设备上。

## 应该使用哪种格式？

**Piece CID（v2）** 遵循 [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md)。它通常以 `bafkzci` 开头，并包含较新的 Filecoin 工具所需的载荷大小信息。**旧版 CommP（v1）** 通常以 `baga6ea4` 开头，用于传统的 Filecoin 存储交易。如果流程要求旧版 Piece CID 和填充后的 Piece 大小，请复制旧版承诺值，并使用旁边显示的大小。两种格式都可以粘贴到比较栏，核对文件是否与已有承诺值一致。仅在末尾零字节数量上有差异的文件，可能具有相同的旧版 CommP。

## 为什么 IPFS CID 看起来不一样？

IPFS 根 CID 标识一个块，或文件、目录的根。Filecoin Piece CID 则基于存储载荷的确切字节，按 Filecoin 规则填充并计算哈希后得出。如果载荷是 CAR 归档，请用归档本身计算承诺值。两个 CAR 即使有相同的 IPFS 根 CID，也可能以不同顺序存放数据块，从而产生不同的 Piece CID。提交存储交易时，请使用此前计算的同一份文件。

格式和填充规则见 [Filecoin Piece 规范](https://spec.filecoin.io/systems/filecoin_files/piece/)。

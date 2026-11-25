## 将 Filecoin f410 地址转换为 0x

粘贴 `f410` 或 `t410` 地址，然后点击 **转换地址**。工具会验证 Filecoin 校验和，并显示对应的以太坊格式 `0x` 地址，大小写按 EIP-55 校验和设置。如果钱包或区块浏览器在 Filecoin 上使用以太坊格式的地址，可以复制这个结果。点击 **试用示例** 可直接查看转换结果，无需输入自己的地址。

## 将 0x 地址转换为 Filecoin 地址

粘贴含 40 个十六进制字符的 `0x` 地址。选择 **主网** 可得到 `f410` 地址，选择 **测试网** 可得到 `t410` 地址。Calibration 和其他 Filecoin 测试网使用相同的 `t410` 前缀。`0x` 格式没有网络前缀，同一组字节可以用任一 Filecoin 前缀表示。请选择钱包、区块浏览器或交易所使用的网络。十六进制字符全为小写或全为大写均可，混合大小写时则必须通过 EIP-55 校验。

## f410 和 t410 是什么？

这两种委托地址由 Filecoin 以太坊虚拟机（FEVM）使用。在所选 Filecoin 网络上，`f410` 或 `t410` 地址与对应的 `0x` 形式表示同一个 20 字节地址。Filecoin 原生格式采用 Base32 和自己的校验和。转换只改变地址的表示形式，底层字节保持不变，也不会在网络间转移 FIL。

## 可以转换 f0、f1、f2 或 f3 地址吗？

此工具转换命名空间 `10` 中的 FEVM 委托地址，这些地址以 `f410` 或 `t410` 为前缀。Actor ID 地址、其掩码形式 `0xff0000…` 以及其他类型的 Filecoin 地址不在支持范围内。将某些原生地址类型映射到 Actor 时，需要查询链上状态。此工具在浏览器中完成转换，无需调用 RPC 或连接钱包。

参阅 [Filecoin 地址类型与转账指南](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md)和 [EIP-55 校验和规范](https://eips.ethereum.org/EIPS/eip-55)。

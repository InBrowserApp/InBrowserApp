## 估算 Filecoin Onchain Cloud 存储费用

输入数据大小、**保留期限（天）**和**副本数**。计算器按 Filecoin Warm Storage Service 的费率，估算为每份副本创建并存储一个新数据集的费用。结果包括每月存储与证明费用、所选期限内的支出，以及创建数据集和添加 Piece 的费用。金额以 USDFC 计。Filecoin 按 30 天计为一个计费月。

## 存储费用如何估算

每个活跃数据集按数据大小支付存储费，另需支付一笔固定的数据持有证明（PDP）费用。例如，如果每 TiB 的存储费为 2.50 USDFC、每份副本的证明费为 0.12 USDFC，那么存储 1 TiB 数据的两份副本，每 30 天约需 5.24 USDFC。估算采用你输入的数据大小。Filecoin 根据承载数据的叶节点确定实际计费大小，每个 Piece 最多可能因此增加 31 字节。

## 估算上传费用和可退还的预留金

展开**上传详情**，填写每份副本包含的 Piece 数和上传批次数。默认按每份副本一个批次估算。将 Piece 数留空，可按 Synapse SDK 的 63.5 GiB 上传上限估算所需的最少 Piece 数，也可以手动输入实际数量。每份副本都需支付数据集创建费，添加 Piece 时还需支付每批次的基础费用和每个 Piece 的费用。生命周期预留金是服务为支付操作费用而暂时锁定的余额。页面单独列出预留金，服务结算后会解除锁定未使用的资金。本估算涵盖一次新的上传及其存储期限。检索及后续操作另行收费。参阅 [Synapse SDK 大小限制](https://docs.filecoin.cloud/developer-guides/synapse/#size-constraints)。

## Filecoin 费率来自哪里？

页面使用结果旁标有日期的参考费率进行计算。点击**刷新主网费率**，可通过公开的 Filecoin RPC 读取 Warm Storage 定价合约。浏览器会使用返回的费率，并显示这些费率所在的区块。查询失败时，仍可以使用参考费率计算。

有关实际计费大小、账户所需资金和完整的费用明细，请参阅 [Filecoin 存储费用指南](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/)。

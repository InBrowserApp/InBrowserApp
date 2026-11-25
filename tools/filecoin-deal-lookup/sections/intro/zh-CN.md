## 按交易 ID 查询 Filecoin 存储交易

输入 Filecoin 主网 Storage Market 的 **交易 ID**（数字），然后点击 **查询交易**。点击 **试用示例** 可加载真实的公开记录，查看状态、存储提供商、客户、起止日期及 Piece CID。这里查询的是 Storage Market 交易。Filecoin Onchain Cloud 使用单独的数据集 ID。

## 如何解读 Filecoin 交易状态

已激活表示链上有激活记录，且尚未到计划结束时间。待激活表示交易在计划开始纪元结束前仍可激活。工具也会显示超过开始时间仍未激活、交易已到期，或市场状态记录了罚没的情况。起止纪元来自交易提案，工具按链上的纪元时间表换算为 UTC 日期。

## 将交易的 Piece CID 与本地文件比较

Piece CID 是记录在交易中的 Filecoin Piece 承诺值。复制它，再使用 Filecoin Piece CID 计算器计算本地文件或 CAR 的承诺值进行比较。结果也会显示按 Filecoin 规则填充后的 Piece 大小。已验证的交易带有 Filecoin Plus 验证标记。

## 查找较早的 Filecoin 交易

浏览器先查询 Filecoin 主网当前的市场状态。记录离开当前市场状态后，工具可以显示 Filfox 收录的原始交易条款，并标记为历史记录。这些条款包括计划起止日期和交易各方。点击 **在 Filfox 中查看** 会打开同一交易 ID 的区块浏览器页面。

链上返回的字段见 [Filecoin Storage Market RPC 参考文档](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal)。

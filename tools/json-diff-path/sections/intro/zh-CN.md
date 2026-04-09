## Overview

JSON Diff Path 用于比较两个 JSON 文档，并将每一处结构变更转换为可读的路径记录，同时提供 JSONPath 和 JSON Pointer 两种输出。

## When To Use It

当你需要审查 API 负载变更、检查配置迁移，或为自动化生成符合 RFC 6902 的 JSON Patch 操作时，可以使用它。

## How It Works

该工具会解析两个 JSON 输入，计算 `add`、`remove` 和 `replace` 变更，然后让你筛选这些操作，并在同一结果面板中在路径列表与 JSON Patch 输出之间切换。

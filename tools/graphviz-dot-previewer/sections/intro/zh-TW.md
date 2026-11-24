## 線上預覽 Graphviz DOT 圖形

將檔案、指令碼或文件中的 DOT 原始碼貼到 **DOT 原始碼**，圖形會隨輸入更新。有向邊使用 `digraph` 和 `->`，無向邊使用 `graph` 和 `--`。內建範例展示相依關係、網路和分群的寫法。

## 選擇佈局引擎

分層圖可從 `dot` 開始；無向網路可試用 `neato` 或 `fdp`，大型網路使用 `sfdp`，圓形佈局使用 `circo`，徑向樹使用 `twopi`。`osage` 適合分群圖，`patchwork` 用於樹狀圖。切換引擎不會清除原始碼。

## 了解錯誤與佈局提示

邊運算子與圖形類型不符、缺少大括號或引號都可能報錯；請檢查提示行及其上一行。某些屬性無法套用時仍可能顯示預覽及提示。如果原始碼指定 `layout` 屬性，Graphviz 會使用該引擎。詳見 [DOT 語言參考](https://graphviz.org/doc/info/lang.html)和 [Graphviz 佈局指南](https://graphviz.org/docs/layouts/)。

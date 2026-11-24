## 如何將 TTF 或 OTF 轉換成 WOFF2

選擇一個或多個 TrueType（`.ttf`）或 OpenType（`.otf`）字型檔案，也可將檔案拖曳至轉換區。加入檔案後會立即開始轉換。完成後可比較原始檔案與 WOFF2 檔案的大小，再選擇「**下載 WOFF2**」。例如，`Inter-Regular.ttf` 會轉換成 `Inter-Regular.woff2`。字型轉換全程在瀏覽器內完成，檔案會留在這台裝置上。

## 為什麼網頁字型適合使用 WOFF2？

WOFF2（Web Open Font Format 2）使用 Brotli 壓縮字型資料。用於網站時，WOFF2 通常比原始 TTF 或 OTF 檔案需要傳輸的資料更少，實際可縮減的大小視字型而定。格式轉換會保留所有字形和可變字型的變化軸，因此一個可變字型檔案仍可涵蓋一系列字重。如果網站只會使用一部分字元，可以用[字型子集產生器](../font-subset-generator/)進一步縮小檔案。

## 如何在 CSS 中使用 WOFF2 檔案

將下載的檔案放入網站的字型資料夾，再用 `@font-face` 引用。請讓路徑、字重和樣式與實際提供的字型檔案相符。以下範例從 `/fonts/` 載入一般字重，並在字型載入期間先以備援字型顯示文字。

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Inter", sans-serif;
}
```

如果使用可變字型，請填寫該字型實際支援的字重範圍，例如 `font-weight: 100 900;`。將字型放上網站前，先確認授權條款，並測試頁面會使用的語言和字重。參閱 [MDN 的 @font-face 參考文件](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face)。

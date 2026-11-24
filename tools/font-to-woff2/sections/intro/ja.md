## TTF や OTF を WOFF2 に変換する方法

TrueType（`.ttf`）または OpenType（`.otf`）のフォントファイルを選択するか、変換エリアにドラッグ＆ドロップします。複数のファイルを一度に追加でき、追加するとすぐに変換が始まります。変換が完了したら、変換前と WOFF2 のファイルサイズを比較し、**WOFF2 をダウンロード**を選択します。たとえば、`Inter-Regular.ttf` は `Inter-Regular.woff2` になります。処理はすべてブラウザー内で行われ、ファイルはこのデバイス内にとどまります。

## Web フォントに WOFF2 を使う理由

WOFF2（Web Open Font Format 2）は、Brotli でフォントデータを圧縮する形式です。元の TTF や OTF を配信する場合に比べて、通常は転送量を抑えられます。どの程度小さくなるかはフォントによって異なります。形式を変換しても、すべての字形とバリアブルフォントの軸が保持されるため、引き続き1つのファイルで複数のウェイトを指定できます。サイトで使う文字が限られている場合は、[フォントサブセット生成ツール](../font-subset-generator/)でさらに軽量化できます。

## CSS で WOFF2 ファイルを使う方法

ダウンロードしたファイルをサイトのフォント用フォルダーに置き、`@font-face` で指定します。パス、ウェイト、スタイルは、配信するファイルに合わせてください。次の例では `/fonts/` から標準ウェイトのフォントを読み込み、読み込み中は代替フォントでテキストを表示します。

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

バリアブルフォントでは、`font-weight: 100 900;` のように、そのフォントが実際に対応するウェイトの範囲を指定します。Web サイトで配信する前にフォントのライセンスを確認し、ページで使う言語やウェイトが意図どおりに表示されるかテストしてください。詳しくは [MDN の @font-face リファレンス](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face)を参照してください。

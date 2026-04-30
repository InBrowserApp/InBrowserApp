## Local Font Access とは？

Local Font Access は端末にインストールされたフォントを列挙するブラウザー API です。

このツールでは結果を検索し、近い書体を比較し、選んだフォントの CSS スニペットをコピーできます。

安全なコンテキストと対応ブラウザーでのみ動作し、ユーザー権限（local-fonts）が必要です。

API は family、fullName、postscriptName、style を含む FontData を返します。

### ポイント

- 現在の端末で CSS `font-family` スタックに必要な正確な名前を確認するのに使えます。
- 呼び出しはユーザー操作で行う必要があります。
- Permissions Policy によりブロックされる場合があります。
- このツールは端末内で動作し、フォントをアップロードしません。

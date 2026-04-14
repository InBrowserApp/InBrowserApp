## What It Does

HTTP Basic Authorization ヘッダーをデコードして、Base64 からユーザー名とパスワードを抽出します。デバッグや API テストに有用.

## Accepted Input

次のように貼り付け: Basic dXNlcjpwYXNz
This tool also accepts a full `Authorization: Basic ...` line.

## Notes

- Base64 only encodes credentials; it does not protect them.
- The decoder splits on the first `:` and keeps the rest in the password.
- Everything runs locally in your browser.

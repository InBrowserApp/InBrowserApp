## Unicode ドメインと Punycode を相互に変換する

**Unicode ドメイン**に `bücher.com` と入力すると、**ASCII ドメイン**に `xn--bcher-kva.com` が表示されます。`xn--` を含むドメイン名は **ASCII ドメイン**に貼り付けると Unicode 表記で確認できます。入力するともう一方の欄が更新され、どちらの表記もコピーできます。

## Unicode と Punycode の使い分け

Punycode は、国際化ドメイン名（IDN）に含まれる非 ASCII 文字を、ASCII の英字、数字、ハイフンで表します。変換されたラベルは `xn--` で始まり、`com` など元から ASCII のラベルはそのままです。DNS やホスティングの設定で ASCII 表記が求められるときは Punycode を使います。ログや設定ファイルにあるドメイン名を読むときは、Unicode に戻すと確認しやすくなります。

## 入力するのはホスト名

`https://bücher.com/catalog` を変換する場合は、ホスト名の `bücher.com` を貼り付けます。サブドメインにも対応しており、`www.bücher.com` は `www.xn--bcher-kva.com` に変換されます。

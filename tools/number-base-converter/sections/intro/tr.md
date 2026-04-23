## Sayı tabanları ortaya çıktığında

İkili, sekizli, ondalık ve onaltılı sistem, bit maskeleri ve günlük çıktısından protokol belgelerine ve bellek adreslerine kadar her yerde görünür. İnsanların okuyabileceği bir sayıyı bir programın beklediği biçimle karşılaştırmanız gerektiğinde, hızlı bir temel dönüştürme, zamandan tasarruf sağlar ve tek tek hataları önler.

## Bu dönüştürücü ne işe yarar?

Bu sayı tabanı dönüştürücü, ortak geliştirici tabanlarını, daha yüksek radikalleri ve bir özel tabanı doğrudan tarayıcınızda senkronize halde tutar. İkili, sekizli, ondalık, onaltılı, base32, base36, base62, base64 veya 2'den 64'e kadar herhangi bir tabana bir değer yapıştırabilir ve ardından eşleşen sonucu hemen kopyalayabilirsiniz.

## Ne zaman kullanılmalı?

Maskeleri kontrol ederken, paket yakalamalarını okurken, kodlanmış kimliklerde hata ayıklama yaparken veya kökler arasında atlayan kodu doğrularken bunu kullanın. 36'nın üzerindeki tabanlar için harf büyüklüğü önemlidir ve buradaki sayısal base64 alanı `A-Z a-z 0-9 + /` alfabesini takip eder.

## Base32 nedir?

Base32, yalnızca metin kabul eden veya büyük/küçük harfe duyarsız bir kanalın OTP sırları, DNS için güvenli belirteçler ya da dışa aktarılan yapılandırma değerleri gibi ikili verileri taşıması gerektiğinde yararlıdır. Bu bir kodlama katmanıdır, bir güvenlik katmanı değildir.

## Ne zaman kullanılmalı

- Yalnızca metin kabul eden kanallara göndermeden önce baytları, metni veya dosyaları Base32 olarak kodlamak.
- Base32 girişi bekleyen sistemler için OTP sırlarını, dışa aktarılan ayarları veya ikili verileri hazırlamak.
- Ham dosya baytlarını aktarım, kayıt veya elle giriş için kopyalanabilir bir dizeye dönüştürmek.

## Dikkat edilmesi gerekenler

- Base32, veriyi Base64'ten daha fazla büyütür.
- Özgün değeri şifrelemez veya gizlemez.
- Bazı sistemler `=` dolgusunu zorunlu tutar, bazıları ise dolgusuz çıktıyı kabul eder; bu yüzden alıcının beklentisine uyun.

## Base32 nedir?

Base32, yalnızca metin kabul eden veya büyük/küçük harfe duyarsız bir kanalın OTP sırları, DNS için güvenli belirteçler ya da dışa aktarılan yapılandırma değerleri gibi ikili verileri taşıması gerektiğinde yararlıdır. Bu bir kodlama katmanıdır, bir güvenlik katmanı değildir.

## Ne zaman kullanılmalı

- Base32 sırlarını veya belirteçlerini özgün baytlara geri çözmek için.
- TOTP kurulumu, entegrasyon dışa aktarımları veya yapılandırma dosyalarından kopyalanan değerleri incelemek için.
- Yapıştırılan Base32 verisinin kullanımdan önce geçerli karakterlere ve doğru dolguya sahip olup olmadığını kontrol etmek için.

## Dikkat edilmesi gerekenler

- Base32, veriyi Base64'ten daha fazla büyütür.
- Özgün değeri şifrelemez veya gizlemez.
- Bazı sistemler `=` dolgusunu atlar, ancak geçersiz karakterler yine de çözme hatasına yol açar.

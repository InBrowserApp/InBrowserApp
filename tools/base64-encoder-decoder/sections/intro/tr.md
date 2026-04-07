## Base64 nedir?

Base64, metin tabanlı bir kanalın e-posta gövdeleri, JSON blobları veya küçük data URL'leri gibi ikili dosyalara uygun yükleri taşıması gerektiğinde yararlıdır. Bu bir kodlama katmanıdır, bir güvenlik katmanı değil.

## Ne zaman kullanılır

- Bir API Base64 dizeleri döndürdüğünde veya beklediğinde hızlı hata ayıklama için.
- Tarayıcı metnini günlükler veya yükler için güvenli bir taşıma biçimine dönüştürmek için.
- Yapıştırılan bir Base64 blobunun beklediğiniz içeriğe çözülüp çözülmediğini kontrol etmek için.

## Akılda tutulması gerekenler

- Base64, boyutu yaklaşık üçte bir oranında artırır.
- Orijinal değeri şifrelemez veya gizlemez.
- Geçersiz dolgu veya bozuk kopyala-yapıştır genellikle bir kod çözme hatası olarak ortaya çıkar.

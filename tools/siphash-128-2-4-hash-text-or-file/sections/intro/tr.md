## SipHash-128-2-4 nedir?

SipHash-128-2-4, kısa mesajlar ve karma tablosu koruması için tasarlanmış hızlı bir anahtarlı karma işlevidir. 128 bitlik gizli bir anahtar kullanır ve genellikle 32 karakterlik onaltılık değer olarak görüntülenen 128 bitlik bir çıktı üretir.

## Ne zaman kullanılır

- Anahtar gizli kaldığında sunucu tarafındaki karma tablolarını hash-flooding saldırılarına karşı koruyun.
- Önbellek anahtarları, sharding veya dahili arama tabloları için deterministik anahtarlı sağlama toplamları oluşturun.
- Kriptografik kimlik doğrulama gerekmediğinde metin parçalarını veya dosyaları aynı anahtarla karşılaştırın.

## Anahtar biçimi

Anahtarı, `0x000102030405060708090a0b0c0d0e0f` gibi tam olarak 16 baytlık onaltılık veri olarak girin. `0x` öneki isteğe bağlıdır ve araç uzun anahtarların okunmasını kolaylaştırmak için boşlukları, iki nokta üst üste işaretlerini, kısa çizgileri ve alt çizgileri kabul eder.

## Güvenlik notları

SipHash-128-2-4, HMAC, dijital imzalar veya parola karmalamanın yerine geçmez. Kriptografik güvenlik garantileri gerektiren sistemler arasında özgünlüğü kanıtlamak için değil, anahtarlı karma tablosu ve sağlama toplamı iş akışları için kullanın.

## HighwayHash nedir?

HighwayHash, Google tarafından yüksek verimli parmak izi çıkarma ve bütünlük kontrolleri için tasarlanmış hızlı bir anahtarlı karma işlevidir. 256 bitlik bir anahtar kullanır ve aynı metin veya dosya girdisinden 64 bit, 128 bit ya da 256 bit çıktı üretebilir.

## Ne zaman kullanılır

- Önbellek anahtarları, nesne kimlikleri, sharding veya dahili arama tabloları için deterministik anahtarlı sağlama toplamları oluşturun.
- Geniş kriptografik uyumluluktan çok hızın önemli olduğu durumlarda dosyaları veya metin yüklerini aynı anahtarla karşılaştırın.
- Bütünlük iş akışlarında daha büyük bir parola dışı karma gerektiğinde 128 bit veya 256 bit parmak izleri oluşturun.

## Anahtar ve çıktı seçenekleri

Anahtarı, `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f` gibi tam olarak 32 baytlık onaltılık veri olarak girin. `0x` öneki isteğe bağlıdır; araç, uzun anahtarların okunmasını kolaylaştırmak için boşlukları, iki nokta üst üste işaretlerini, kısa çizgileri ve alt çizgileri kabul eder. Anahtarı boş bırakmak, hızlı kontroller için kullanışlı olan ancak gizli kabul edilmemesi gereken kitaplık varsayılan anahtarını kullanır.

## Güvenlik notları

HighwayHash, HMAC, dijital imzalar veya parola karma işleminin yerine geçmez. Standart kriptografik doğrulama gerektiren sistemler arasında özgünlüğü kanıtlamak için değil, hızlı anahtarlı parmak izleri ve sağlama toplamı iş akışları için kullanın.

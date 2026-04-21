## xxHash (XXH64) nedir?

xxHash, iyi dağıtım özelliklerini korurken hız ve performansa odaklanan son derece hızlı bir kriptografik olmayan hash algoritmasıdır. XXH64, tipik olarak 16 karakterlik onaltılık sayı olarak görüntülenen 64-bit (8-bayt) hash değeri üreten 64-bit varyantıdır.

**Temel özellikler:**

- **Son derece hızlı**: Hız için optimize edilmiş, kriptografik hash fonksiyonlarından çok daha hızlı
- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir
- **İyi dağıtım**: Hash tabloları için mükemmel hash dağıtımı sağlar
- **Kriptografik olmayan**: Güvenlik amaçları için uygun değil, performans için tasarlanmış
- **Daha büyük çıktı**: 64-bit hash, 32-bit varyantlardan daha iyi çakışma direnci sağlar
- **Platform optimize**: Maksimum hız için mevcut olduğunda SIMD talimatlarını kullanır

**Yaygın kullanımlar:**

- Hash tabloları ve veri yapıları
- Dosya bütünlüğü kontrolleri (güvenlik dışı)
- Veri tekilleştirme
- Veri iletimi için sağlama toplamları
- Performans kritik uygulamalar
- Veritabanı indeksleme
- Önbellek anahtarı üretimi

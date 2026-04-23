## MurmurHash3 (x86 32-bit) nedir?

MurmurHash3, iyi dağıtım özelliklerini korurken hız ve performansa odaklanan son derece hızlı bir kriptografik olmayan hash algoritmasıdır. MurmurHash3 x86 32-bit, tipik olarak 8 karakterlik onaltılık sayı olarak görüntülenen 32-bit (4-bayt) hash değeri üreten 32-bit varyantıdır.

**Temel özellikler:**

- **Son derece hızlı**: Hız için optimize edilmiş, kriptografik hash fonksiyonlarından çok daha hızlı
- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir
- **İyi dağıtım**: Hash tabloları için mükemmel hash dağıtımı sağlar
- **Kriptografik olmayan**: Güvenlik amaçları için uygun değil, performans için tasarlanmış
- **Küçük çıktı**: 32-bit hash kompakt temsil sağlar
- **Platform optimize**: Maksimum hız için mevcut olduğunda SIMD talimatlarını kullanır

**Yaygın kullanımlar:**

- Hash tabloları ve veri yapıları
- Dosya bütünlüğü kontrolleri (güvenlik dışı)
- Veri tekilleştirme
- Veri iletimi için sağlama toplamları
- Performans kritik uygulamalar
- Veritabanı indeksleme
- Önbellek anahtarı üretimi

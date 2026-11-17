## xxHash (XXH3 64) Nedir?

XXH3, çok yüksek hız ve mükemmel dağılım için tasarlanmış modern xxHash algoritmasıdır. XXH3 64, genellikle 16 karakterlik onaltılık bir dize olarak gösterilen 64 bitlik (8 baytlık) bir özet değeri üretir. Kriptografik olmayan bir özet işlevidir ve tekrarlanabilir özet hesaplamaları için isteğe bağlı tohum değerini destekler.

**Temel özellikleri:**

- **Son derece hızlıdır**: Büyük girdilerde yüksek performans için optimize edilmiştir
- **Belirlenimlidir**: Aynı girdi ve tohum değeri her zaman aynı özeti üretir
- **Kriptografik değildir**: Güvenlik amaçları için uygun değildir
- **İyi dağılım sağlar**: Özet tabloları ve dizinleme için çok uygundur
- **Tohum değeri kullanır**: Özet çıktılarını çeşitlendirmek için isteğe bağlı tohum değeri alır

**Yaygın kullanım alanları:**

- Özet tabloları ve veri yapıları
- Dosya bütünlüğü denetimleri (güvenlik dışı)
- Yinelenen verileri kaldırma ve veriyi parçalara ayırma
- Önbellek anahtarları ve veritabanı dizinleme
- Yüksek hacimli veri işleme akışları

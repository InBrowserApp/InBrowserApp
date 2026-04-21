## xxHash (XXH3 128) nedir?

XXH3, çok yüksek hız ve mükemmel dağılım için tasarlanmış modern xxHash algoritmasıdır. XXH3 128, genellikle 32 karakterlik onaltılık bir dize olarak gösterilen 128 bitlik (16 bayt) bir hash değeri üretir. Kriptografik olmayan bir hash türüdür ve tekrarlanabilir sonuçlar için isteğe bağlı seed desteği sunar.

**Başlıca özellikler:**

- **Son derece hızlı**: Büyük girdilerde yüksek performans için optimize edilmiştir
- **Deterministik**: Aynı girdi ve aynı seed her zaman aynı hash’i üretir
- **Kriptografik değildir**: Güvenlik amaçları için uygun değildir
- **İyi dağılım**: Hash tabloları ve indeksleme için kullanışlıdır
- **Seed desteği**: İsteğe bağlı seed, hash çıktılarının çeşitlenmesine yardımcı olur

**Yaygın kullanım alanları:**

- Hash tabloları ve veri yapıları
- Dosya bütünlüğü kontrolleri (güvenlik dışı)
- Veri tekilleştirme ve parçalara ayırma
- Önbellek anahtarları ve veritabanı indeksleme
- Yüksek aktarım hacimli veri hatları

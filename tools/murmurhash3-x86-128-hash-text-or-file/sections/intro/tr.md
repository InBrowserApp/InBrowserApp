## MurmurHash3 (x86 128-bit) nedir?

MurmurHash3, tekrarlanabilir ve iyi dağılıma sahip sağlama toplamları
için tasarlanmış hızlı, kriptografik olmayan bir hash algoritmasıdır.
x86 128-bit varyantı, genellikle 32 onaltılık karakter olarak gösterilen
16 baytlık bir değer döndürür. Büyük kayıt, dosya veya önbellek anahtarı
kümeleri için daha geniş bir tanımlayıcı istediğinizde bu değer, 32-bit
hash'lerden daha uygundur.

**Nerelerde işe yarar:**

- **Hash tabloları ve sharding**: Kovalar, bölümler veya arama tabloları
  için kararlı anahtarlar oluşturun.
- **Tekilleştirme**: Daha derin kontroller yapmadan önce büyük metin veya
  dosya kümelerini kompakt 128-bit parmak izleriyle karşılaştırın.
- **Önbellek anahtarları**: Derleme çıktıları, dönüştürülmüş veriler veya
  oluşturulmuş içerik için deterministik tanımlayıcılar üretin.
- **Güvenlik dışı bütünlük kontrolleri**: Kriptografik güvenceler
  gerekmediğinde depolama veya aktarım sırasında meydana gelen kazara
  değişiklikleri algılayın.

**Seed davranışı:**

İsteğe bağlı seed, 32-bit işaretsiz bir değerdir. Sonuçların başka bir
sistemle eşleşmesi gerektiğinde aynı seed değerini kullanın; belirli bir
uyumluluk gereksiniminiz yoksa `0` olarak bırakın. Ondalık değerler ve
`0x` onaltılık değerler kabul edilir; daha büyük değerler algoritmanın
kullandığı aynı 32-bit aralığa sarılır.

**Güvenlik notları:**

MurmurHash3, parola hash'leme, imzalama veya kurcalamaya dayanıklı
doğrulama algoritması değildir. Çıktının güvenlik özelliklerine sahip
olması gerektiğinde SHA-256, HMAC veya bir parola hash'leme aracı
kullanın. Bu araç, hızın ve kararlı dağılımın saldırılara karşı
dayanıklılıktan daha önemli olduğu yerel, çevrimdışı ve performans
odaklı hash işlemleri için en uygundur.

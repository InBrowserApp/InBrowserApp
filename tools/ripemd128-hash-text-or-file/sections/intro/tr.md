## RIPEMD-128 nedir?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest), 128 bit (16 bayt) hash değeri üreten kriptografik bir hash fonksiyonudur ve genellikle 32 karakterlik onaltılık sayı olarak gösterilir. MD4/MD5'e alternatif olarak Avrupa'da geliştirilen RIPEMD ailesinin bir parçasıdır.

**Temel özellikler:**

- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir
- **Hızlı hesaplama**: Herhangi bir verilen girdi için hızla hesaplanır
- **Çığ etkisi**: Girdideki küçük değişiklikler büyük ölçüde farklı çıktılar üretir
- **Sabit çıktı boyutu**: Girdi boyutundan bağımsız olarak her zaman 128 bit hash üretir
- **Tek yönlü**: Hash'ten orijinal girdiyi geri elde etmek hesaplamalı olarak mümkün değildir

**Yaygın kullanımlar:**

- Veri bütünlüğü kontrolleri
- Parmak izi çıkarma ve yinelemeyi kaldırma
- Eski sistem uyumluluğu

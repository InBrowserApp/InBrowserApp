## MD4 nedir?

MD4 (Message Digest Algorithm 4), tipik olarak 32 karakterlik onaltılık sayı olarak gösterilen 128-bit (16-bayt) hash değeri üreten yaygın olarak kullanılan kriptografik bir hash fonksiyonudur. 1990 yılında Ron Rivest tarafından tasarlanmıştır.

**Temel özellikler:**

- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir
- **Hızlı hesaplama**: Herhangi bir verilen girdi için hızla hesaplanır
- **Çığ etkisi**: Girdideki küçük değişiklikler büyük ölçüde farklı çıktılar üretir
- **Sabit çıktı boyutu**: Girdi boyutuna bakılmaksızın her zaman 128-bit hash üretir
- **Çarpışma açığı**: Bilinen güvenlik açıkları çarpışma bulmayı mümkün kılar

**Güvenlik durumu:**
⚠️ **MD4 kriptografik olarak kırılmıştır ve güvenlik açısından kritik uygulamalar için kullanılmamalıdır**. Çarpışma saldırıları 1995 yılında gösterilmiş ve modern hesaplama gücü ile pratik çarpışma üretimi mümkün hale gelmiştir.

**Yaygın kullanımlar (mevcut ve tarihsel):**

- Dosya bütünlüğü doğrulama (güvenlik açısından kritik değil)
- Veri bozulması tespiti için kontrol toplamları
- MD4 gerektiren eski sistemler
- Veritabanı anahtar üretimi (kriptografik olmayan)
- Bazı eski protokoller ve sistemler

**Önerilen alternatifler:**

- Yeni uygulamalar için SHA-256 veya SHA-3
- Yüksek güvenlik gereksinimleri için SHA-512
- Yüksek performans uygulamaları için BLAKE2

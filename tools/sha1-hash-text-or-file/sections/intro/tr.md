## SHA-1 nedir?

SHA-1 (Güvenli Hash Algoritması 1), tipik olarak 40 karakterlik onaltılık sayı olarak gösterilen 160-bit (20-bayt) hash değeri üreten kriptografik bir hash fonksiyonudur. NSA tarafından tasarlanmış ve 1995 yılında Dijital İmza Standardının bir parçası olarak NIST tarafından yayınlanmıştır.

**Temel özellikler:**

- **Deterministik**: Aynı girdi her zaman aynı hash'i üretir
- **Hızlı hesaplama**: Herhangi bir verilen girdi için hızla hesaplanır
- **Çığ etkisi**: Girdideki küçük değişiklikler büyük ölçüde farklı çıktılar üretir
- **Geri döndürülemez**: Hash'i tersine çevirerek orijinal girdiyi bulmak hesaplamalı olarak mümkün değildir
- **Çarpışma açığı**: Bilinen güvenlik açıkları çarpışma bulmayı mümkün kılar

**Güvenlik durumu:**
⚠️ **SHA-1 kriptografik olarak kırılmıştır ve güvenlik açısından kritik uygulamalar için kullanılmamalıdır**. Teorik saldırılar 2005 yılında gösterilmiş, pratik çarpışma saldırıları 2017 yılında başarılmıştır.

**Yaygın kullanımlar (tarihsel):**

- Dijital imzalar ve sertifikalar (kullanımdan kaldırıldı)
- Git versiyon kontrol sistemi (uyumluluk için)
- SHA-1 gerektiren eski sistemler
- Dosya bütünlüğü doğrulama (güvenlik açısından kritik değil)
- İş kanıtı algoritmaları (bazı eski kripto para birimleri)

**Önerilen alternatifler:**

- Yeni uygulamalar için SHA-256 veya SHA-3
- Yüksek güvenlik gereksinimleri için SHA-512

## Keccak nedir?

Keccak, SHA-3 (Secure Hash Algorithm 3) standardının temeli olarak hizmet eden kriptografik hash fonksiyonlarının bir ailesidir. Guido Bertoni, Joan Daemen, Michaël Peeters ve Gilles Van Assche tarafından geliştirilmiş ve 2012'de NIST hash fonksiyon yarışmasını kazanmıştır.

**Ana özellikler:**

- **Sünger yapısı**: Emme ve sıkma aşamaları olan yenilikçi sünger fonksiyon tasarımı kullanır
- **Değişken çıktı uzunluğu**: İstenilen herhangi bir uzunlukta hash çıktıları üretebilir
- **Yüksek güvenlik marjı**: Önemli güvenlik rezervleriyle tasarlanmış
- **SHA-1/SHA-2'den farklı**: Tamamen farklı matematiksel ilkelere dayalı
- **Keccak[c=2d] varyantı**: Bu uygulama kapasite c = 2d olan orijinal Keccak spezifikasyonunu kullanır (d çıktı uzunluğudur)

**Keccak vs SHA-3 (FIPS 202) farkları:**
🔍 **Önemli ayrım**: Orijinal Keccak ve standartlaştırılmış SHA-3 **aynı değildir**:

- **Orijinal Keccak**: Kapasite c = 2d ve farklı dolgu kullanır (Keccak dolgusu: 0x01)
- **FIPS 202 SHA-3**: Kapasite c = 2d kullanır ama farklı dolgu (SHA-3 dolgusu: 0x06)
- **Alan ayrımı**: Dolgu farkı Keccak ve SHA-3'ün aynı girdi için farklı çıktılar üretmesini sağlar
- **Bu araç uygular**: Keccak[c=2d] parametrizasyonu ile **orijinal Keccak spezifikasyonu**

**Güvenlik durumu:**
✅ **Keccak oldukça güvenli kabul edilir** bilinen pratik saldırılar olmadan. Mükemmel güvenlik marjları ve çeşitli kriptoanalitik tekniklere karşı direnç sağlar.

**Yaygın kullanımlar:**

- Ethereum blokzinciri (orijinal Keccak-256 kullanır)
- Akademik araştırma ve kriptografik protokoller
- Değişken uzunlukta hash çıktıları gerektiren uygulamalar
- SHA-2 ailesine alternatif gereken sistemler
- Blokzincir ve kripto para uygulamaları

**Geleneksel hash'lere göre avantajları:**

- Temelden farklı tasarım ilgili saldırı riskini azaltır
- Esnek çıktı uzunluğu (sabit boyutlarla sınırlı değil)
- Güçlü teorik güvenlik temeli
- Uzunluk uzatma saldırılarına direnç
- Çeşitli platformlarda mükemmel performans

**Teknik not:**

- **Keccak-256**: 256-bit çıktı üretir (en yaygın varyant)
- **Kapasite formülü**: c = 2d uygun güvenlik seviyesini sağlar
- **Ethereum kullanımı**: Ethereum özellikle orijinal Keccak-256 kullanır, SHA3-256'yı değil

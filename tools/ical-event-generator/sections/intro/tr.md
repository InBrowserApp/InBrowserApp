## Tarayıcıdan çıkmadan takvim dosyaları oluşturun

Bu araç standart `.ics` etkinlik dosyalarını doğrudan tarayıcınızda üretir. Zamanlı ya da tüm gün süren etkinlikler tanımlayabilir, saat dilimi stratejisi seçebilir, hatırlatıcı ekleyebilir ve verileri bir sunucuya senkronize etmeden son takvim kaydını dışa aktarabilirsiniz.

### Neden kullanılır

- Yalnızca bir takvim dosyasına ihtiyaç duyduğunuzda ve tam bir takvim hesabı akışı istemediğinizde uygundur.
- Hassas programları yerelde tutarken yine de standartlara uygun bir etkinlik eki üretir.
- Son `.ics` dosyasını indirmeden önce yineleme kurallarını ve hatırlatıcı zamanlarını ayarlamanızı sağlar.

### Önerilen akış

1. Etkinlik özetini, konumu, notları ve isteğe bağlı referans URL’sini doldurun.
2. Etkinlik aralığını seçin, ardından `UTC` zaman damgaları mı dışa aktaracağınıza yoksa `TZID` ile özgün saat dilimini mi koruyacağınıza karar verin.
3. Yalnızca gerektiğinde yineleme ve hatırlatıcı kuralları ekleyin, ardından dosyayı indirip etkinliği paylaştığınız yerde ek olarak kullanın.

### Notlar

- Geniş takvim uyumluluğu istiyorsanız `UTC` çıktısı genellikle en güvenli seçenektir.
- `TZID` çıktısı, adlandırılmış saat dilimlerini anlayan istemciler için özgün zamanlama bağlamını korur.
- Tüm gün süren etkinliklerde form bitiş tarihini kapsayıcı tutar, ancak ICS dosyası bunu hariç tutulan bir bitiş tarihi olarak saklar.

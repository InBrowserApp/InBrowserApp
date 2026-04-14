## VIN nedir?

Araç Kimlik Numarası (VIN), bir aracı benzersiz şekilde tanımlayan 17 karakterlik bir koddur.

- `1M8GDM9AXKP042788`
- I, O, Q harfleri kullanılmaz
- 9. karakter kontrol basamağıdır

### VIN yapısı

1. **WMI** (1-3. pozisyonlar): Dünya Üretici Tanımlayıcısı
2. **VDS** (4-8. pozisyonlar): Araç Tanımlayıcı Bölümü
3. **Kontrol basamağı** (9. pozisyon): diğer tüm karakterlerden hesaplanır
4. **VIS** (10-17. pozisyonlar): Araç Kimlik Bölümü

### Kontrol basamağı

Her harf bir sayıya dönüştürülür (A=1, B=2, ... I, O, Q atlanır). Her pozisyonun bir ağırlığı vardır. Ağırlıklı toplamın 11'e bölümünden kalan kontrol basamağını verir; 10 değeri X ile gösterilir.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = kontrol basamağı`

Bu araç yalnızca biçimlendirme ve kontrol basamağı kurallarını doğrular. Gerçek dünyada tescil doğrulaması yapmaz.

## IPv6 Link-Local Adresi Nedir?

IPv6 Link-Local adresleri, IPv6 etkin her arayüzde otomatik olarak yapılandırılan özel IPv6 adresleridir. Her zaman fe80::/10 öneki ile başlarlar ve aynı ağ segmentindeki cihazlar arasındaki iletişim için kullanılırlar. Bu adresler yerel bağlantının ötesinde yönlendirilemez ve genellikle komşu keşfi, yönlendirici keşfi ve diğer yerel ağ protokolleri için kullanılır. Link-local adresler, EUI-64 formatını kullanarak bir cihazın MAC adresinden oluşturulabilir.

### Ne zaman kullanılır

Bir cihazın MAC adresinden EUI-64 ile türetilen belirlenmiş link-local adrese ihtiyaç duyduğunuzda bunu kullanın.

### EUI-64 eşlemesi nasıl çalışır

1. MAC adresini 48 bite normalize edin.
2. İlk bayttaki `U/L bit` değerini ters çevirin.
3. Ortaya `ff:fe` ekleyerek 64 bitlik arayüz tanımlayıcısı oluşturun.
4. Başına `fe80::/10` önekini getirin.

### Desteklenen giriş biçimleri

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### İsteğe bağlı arayüz soneki

Yerel bir komutun hangi arayüzü kullanacağını bilmesi gerektiğinde `%eth0`, `%en0` veya başka bir zone index ekleyin.

## IPv6 Link-Local Adresi Nedir?

IPv6 Link-Local adresleri, IPv6 etkin her arayüzde otomatik olarak yapılandırılan özel IPv6 adresleridir. Her zaman fe80::/10 öneki ile başlarlar ve aynı ağ segmentindeki cihazlar arasındaki iletişim için kullanılırlar. Bu adresler yerel bağlantının ötesinde yönlendirilemez ve genellikle komşu keşfi, yönlendirici keşfi ve diğer yerel ağ protokolleri için kullanılır. Link-local adresler, EUI-64 formatını kullanarak bir cihazın MAC adresinden oluşturulabilir.

### Girdi biçimleri

- `00:11:22:33:44:55`
- `00-11-22-33-44-55`
- `0011.2233.4455`
- `001122334455`

### EUI-64 çıktısı

- `fe80::/10`
- flip the U/L bit
- insert `ff:fe`

### Arayüz soneki

- `%eth0`
- `%en0`
- `%wlan0`

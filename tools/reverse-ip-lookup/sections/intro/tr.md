Ters IP Sorgulama, bir IPv4 veya IPv6 adresini ters DNS adına dönüştürür ve karşılık gelen `PTR` kaydını sorgular. Posta sunucuları, ağ cihazları, bulut örnekleri ve sorun giderme notları için adres sahibinin hangi ana makine adını yayınladığını denetlemenize yardımcı olur.

## Neleri Denetler

IPv4 için araç oktetleri ters çevirir ve bir `in-addr.arpa` adını sorgular. IPv6 için adresi 32 onaltılık basamağa genişletir, bunları ters çevirir ve eşleşen `ip6.arpa` adını sorgular. Sonuç, tam ters DNS alan adını, DNS durum kodunu, çözümleyiciyi, adres ailesini ve dönen ana makine adlarını TTL değerleriyle gösterir.

## Sorgu Nasıl Çalışır

Sorgu, DNS-over-HTTPS kullanılarak tarayıcınızdan çalışır. Çözümleyici olarak Cloudflare, Google veya AliDNS seçebilirsiniz; tarayıcı bu uç noktaya standart bir `PTR` sorgusu gönderir. Sunucu tarafında çalışan bir InBrowser.App sorgulama hizmeti kullanılmaz.

## Eksik Sonuçları Okuma

PTR yanıtının olmaması yaygındır. Birçok ev, bulut, özel veya yeni atanmış adres ters DNS kayıtları yayınlamaz. Ana makine adı içermeyen başarılı bir DNS yanıtı, adresin kullanılmadığını kanıtlamaz; yalnızca ters bölgenin seçilen çözümleyici üzerinden kullanılabilir bir `PTR` kaydı döndürmediği anlamına gelir.

## Pratik Notlar

- Ters DNS bir IP adresini bir ana makine adıyla eşler; aynı adreste barındırılan her alan adını bulmaktan farklıdır.
- PTR kayıtları, yalnızca alan adı sahibi tarafından değil, IP adresi sahibi veya üst sağlayıcı tarafından kontrol edilir.
- Posta ve güvenlik sistemleri genellikle ileri ve ters DNS'i karşılaştırır; bu nedenle bir PTR kaydı genellikle aynı adrese geri çözümlenen bir ana makine adına işaret etmelidir.

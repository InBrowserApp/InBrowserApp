## Bu Araç Neleri Gösteriyor?

Bu araç, harici hizmetlerin mevcut tarayıcı oturumunuzdan görebileceği genel IPv4 ve IPv6 adreslerini arar. Tarayıcı yerel arayüz adaylarını WebRTC aracılığıyla da gösterebiliyorsa araç bunları ayrı olarak listeler.

## IPv4, IPv6 ve WebRTC Sonuçları Neden Farklı Olabilir?

IPv4 adresiniz ve IPv6 adresiniz farklı ağ yollarından, İSS'lerden veya tünel kurulumlarından gelebilir. WebRTC adayları, normal web sitelerinin her zaman doğrudan görüntülemediği özel LAN adreslerini, geçici IPv6 arayüz adreslerini veya VPN ile ilgili yolları içerebilir.

## Arama Nasıl Çalışır?

Araç, Cloudflare, geojs.io, ip.sb ve ipify.org gibi genel IP sağlayıcılarını sorgular ve ardından tespit edilen adresi ana bilgisayar adı, ASN, kuruluş, ülke, saat dilimi ve mümkün olduğunda koordinat meta verileriyle zenginleştirir. Bu, aracın aktif bir internet bağlantısına ihtiyaç duyduğu ve bu üçüncü taraf hizmetlerinin yanıt kalitesine bağlı olduğu anlamına gelir.

## Bir Adres Neden Eksik Olabilir?

Ağınız bir protokol ailesini engelliyorsa, VPN'niz veya proxy'niz isteği filtreliyorsa, tarayıcınız WebRTC kullanımını devre dışı bırakıyorsa veya yukarı akış arama hizmeti geçici olarak kullanılamıyorsa bir adres görünmeyebilir. Ağınızda IPv6 kullanılamıyorsa yalnızca IPv4'ün görülmesi normaldir.

## Bu Araç Neleri Sorgular

IP Bilgisi Sorgulama, bir IPv4 adresini, IPv6 adresini, alan adını veya URL'yi çözümler ve internet hizmetlerinin her adres için raporlayabildiği herkese açık meta verileri gösterir. Bir alan adının nereye yöneldiğini, bir adresin hangi ağa ait olduğunu, hangi ters DNS ana makine adının bulunduğunu veya IPv4 ve IPv6 kayıtlarının farklı sağlayıcılara gidip gitmediğini incelemeniz gerektiğinde kullanışlıdır.

## Alan Adı ve URL Sorgulamaları Nasıl Çalışır

Bir alan adı veya URL girdiğinizde araç ana makine adını çıkarır ve seçili DNS-over-HTTPS çözümleyicisinden hem A hem de AAAA kayıtlarını sorgular. Döndürülen her adres ayrı ayrı zenginleştirilir; böylece çift yığınlı alan adları IPv4 ve IPv6 için farklı ülkeler, ASN'ler, ISP'ler, ana makine adları veya saat dilimleri gösterebilir.

## Sonuçlar Ne Anlama Gelir

Konum ve ISP alanları geojs.io ve ip.sb gibi herkese açık IP meta veri sağlayıcılarından gelir; ana makine adları ise mevcut olduğunda ters DNS PTR sorgularından gelir. Bu kayıtlar, herkese açık veritabanlarının adresi nasıl gördüğünü açıklar; bir kişinin veya cihazın tam fiziksel konumunu göstermez.

## Gizlilik ve Doğruluk Notları

Sorgulama tarayıcınızda çalışır ve üçüncü taraf hizmetlere DNS ile IP meta veri istekleri gönderir. VPN'ler, proxy'ler, CDN'ler, mobil ağlar ve bulut platformları, bildirilen konumun veya kuruluşun beklediğiniz son kullanıcıdan ya da sunucudan farklı olmasına neden olabilir. Özel, ayrılmış, yeni tahsis edilmiş veya az belgelenmiş adreslerde boş alanlar normaldir.

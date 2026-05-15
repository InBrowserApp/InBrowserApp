Ağ Araçları, tarayıcı tabanlı ağ görevleri için bir başlangıç noktasıdır. Çözdüğünüz problemin türünü bildiğiniz ancak doğru yardımcı araca daha hızlı ulaşmak istediğinizde kullanın: bir IP aralığını inceleyin, DNS kayıtlarını sorgulayın, uluslararasılaştırılmış bir alan adını çözün, bir portu arayın veya bir sertifika ya da SSH anahtarı parmak izini kontrol edin.

## Neler Yapabilirsiniz

- IPv4, IPv6, CIDR blokları, adres aralıkları ve MAC'ten türetilen link-local adreslerle çalışın.
- Tarayıcı dostu sorgulama araçlarıyla DNS ve ters DNS kayıtlarını sorgulayın.
- HTTP durum kodlarını, MIME türlerini, port numaralarını ve mevcut ağ saatini arayın.
- Kaynak materyali bir sunucuya göndermeden sertifika ve genel anahtar ayrıntılarını inceleyin.

## Doğru Aracı Seçme

Girdi bir adres, aralık, alt ağ veya yönlendirme bloğu olduğunda **IP ve CIDR** ile başlayın. Kayıtlar, PTR sorgulamaları ve IDN/Punycode dönüşümü için **DNS ve Alan Adları** kullanın. Hızlı bir başvuru tablosu gerektiğinde **Protokol Referansları** kullanın. Kaynak materyal bir TLS sertifikası, genel anahtar veya SSH authorized key girdisi olduğunda **Anahtarlar ve Sertifikalar** kullanın.

## Gizlilik Notları

Bu koleksiyondaki araçların çoğu tamamen tarayıcınızda çalışır. DNS sorgulamaları veya IP bilgisi gibi herkese açık ağ verilerine ihtiyaç duyan araçlar, bu sorguyu yanıtlamak için gerekli çözümleyici ya da sorgulama hizmetiyle iletişim kurabilir. Gizli bilgileri genel sorgulama araçlarına yapıştırmaktan kaçının; materyal hassassa sertifika ve anahtar inceleme için yalnızca yerel çalışan araçları tercih edin.

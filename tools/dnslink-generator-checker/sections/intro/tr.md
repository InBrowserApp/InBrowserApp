## IPFS için DNSLink TXT kaydı oluşturma

DNSLink, bir alan adını veya alt alan adını içerik yoluna yönlendirir. Alan adınızı girip bir IPFS CID değeri, IPFS yolu veya IPNS yolu yapıştırın. Oluşturulan **Ad** ve **TXT değeri** bilgilerini DNS sağlayıcınızda yeni bir TXT kaydına kopyalayın. Örneğin, `www.example.com` alan adı için kayıt adı `_dnslink.www.example.com` olur. DNS paneli `example.com` kısmını otomatik ekliyorsa ad alanına `_dnslink.www` yazın.

## DNSLink hedefini kontrol etme

Cloudflare ve Google'ın döndürdüğü TXT yanıtlarını görmek için **Yayımlanan kaydı kontrol et** düğmesine basın. Var olan bir ayarı sorgulamak için hedefi boş bırakın. Yayımlanan değerle karşılaştırmak için beklediğiniz hedefi girin. Kayıt değiştiğinde DNS çözümleyicileri önbellekteki kaydın süresi dolana kadar eski değeri döndürebilir. Görüntülenen TTL, alınan DNS yanıtının önbellekte ne kadar süre kalabileceğini gösterir.

## Özel alan adı kullanan bir IPFS sitesini güncelleme

Dosyalarınızın belirli bir sürümüne doğrudan yönlendirmek için IPFS CID değeri kullanın. Güncellenebilen bir adı izlemek için IPNS yolu kullanın. DNSLink, uyumlu istemcilere ve ağ geçitlerine hangi içeriğin çözümleneceğini bildirir. Bu içeriği kendi alan adınızda HTTPS üzerinden sunmak için DNSLink destekleyen bir ağ geçidi yapılandırın ve alan adınızı oraya yönlendirin. [IPFS belgelerinde özel alan adları ve DNSLink](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)

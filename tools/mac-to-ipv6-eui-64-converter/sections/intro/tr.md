## MAC adresi IPv6 adresine nasıl dönüştürülür?

48 bitlik MAC adresini iki nokta, kısa çizgi veya noktayla ayrılmış ya da ayırıcısız biçimde girin. Kullanmak istediğiniz IPv6 `/64` ağ önekini ekleyin. Araç, kısaltılmış ve tam gösterimi kabul eder. Önekteki ana bilgisayar bitlerinin sıfır olması gerekir. Kopyalayabileceğiniz IPv6 adresi, yazdıkça güncellenir. **Örneği dene** düğmesi iki alanı da örnek değerlerle doldurur.

## Değiştirilmiş EUI-64 adresi nasıl oluşturur?

`/64` alt ağında ilk 64 biti ağ öneki, son 64 biti ise arayüz tanımlayıcısı belirler. Değiştirilmiş EUI-64, MAC adresinin iki yarısı arasına `ff:fe` ekler ve ilk bayttaki evrensel/yerel bitin değerini tersine çevirir. Örneğin, `00:11:22:33:44:55` adresinden `211:22ff:fe33:4455` arayüz tanımlayıcısı elde edilir. `2001:db8:1:2::/64` önekiyle birleştirildiğinde sonuç `2001:db8:1:2:211:22ff:fe33:4455` olur.

## Yaygın IPv6 önekleri

- **Link-local.** Aynı bağlantı üzerindeki cihazlarla iletişim için `fe80::/64` kullanın. **Link-local önekini kullan** düğmesi, MAC adresinizi koruyarak bu öneki girer. Adresin sonuna `%eth0` gibi bir arayüz adı eklemek için [IPv6 link-local dönüştürücüyü](/tr/tools/mac-address-to-ipv6-link-local-address-converter/) kullanın.
- **Benzersiz yerel adres (ULA).** **ULA örneğini kullan** düğmesi, iç ağlar için ayrılmış `fd00::/8` aralığından bir örnek olan `fd12:3456:789a:1::/64` önekini girer. Kendi ağınıza özgü bir önek oluşturmak için [IPv6 ULA oluşturucuyu](/tr/tools/ipv6-ula-generator/) kullanın.
- **Küresel tekil yayın.** İnternet servis sağlayıcınızın, bulut sağlayıcınızın veya ağ yöneticinizin size ayırdığı adres bloğundan bir `/64` alt ağını girin.
- **Dokümantasyon.** `2001:db8:1:2::/64` öneki, dokümantasyon ve örnekler için ayrılan `2001:db8::/32` aralığındadır.

## Sonuç cihazımın IPv6 adresiyle eşleşir mi?

Sonuç, önekiniz ve Değiştirilmiş EUI-64 yöntemiyle oluşturulan adrestir. Cihazınız, gizlilik için oluşturulan sabit veya geçici bir tanımlayıcı gibi başka bir arayüz tanımlayıcısı kullanabilir. Elinizdeki IPv6 adresinin arayüz tanımlayıcısı MAC adresinden türetilmişse [IPv6'dan MAC'e dönüştürücüyle](/tr/tools/ipv6-address-to-mac-address-converter/) MAC adresini bulabilirsiniz.

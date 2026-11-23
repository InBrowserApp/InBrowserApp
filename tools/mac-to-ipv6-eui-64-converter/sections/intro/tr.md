## Adres nasıl oluşturulur?

Değiştirilmiş EUI-64, MAC adresinin iki yarısı arasına `ff:fe` ekler ve ilk bayttaki evrensel/yerel bitin değerini tersine çevirir. Örneğin, `00:11:22:33:44:55` adresinden `211:22ff:fe33:4455` arayüz tanımlayıcısı elde edilir. `2001:db8:1:2::/64` önekiyle birleştirildiğinde sonuç `2001:db8:1:2:211:22ff:fe33:4455` olur.

Link-local adres oluşturmak için `fe80::/64` girin. Adresin sonuna arayüz adını eklemek için [link-local dönüştürücüyü](/tr/tools/mac-address-to-ipv6-link-local-address-converter/) kullanın. Ağınızda kullanılabilir bir tekil yayın adresi oluşturmak için ağınıza atanmış bir /64 önekini girin. Örnekte dokümantasyon için ayrılmış bir önek kullanılır.

## Bu Araç Neleri Normalleştirir?

Bu araç, IPv4 adreslerini, IPv6 adreslerini ve CIDR aralıklarını doğrudan tarayıcıda standart gösterime dönüştürür. Gereksiz IPv4 dolgusunu ortadan kaldırır, IPv6'yı standart kısaltılmış forma sıkıştırır ve orijinal adres ailesini korur.

## CIDR Normalleştirmesi Nasıl Çalışır?

Bir CIDR bloğuna girdiğinizde araç, adresi söz konusu önek için gerçek ağ adresine yeniden yazar. Ana bilgisayar bitleri temizlendiğinden `192.168.0.15/24`, `192.168.0.0/24` olur ve `2001:db8::1234/64`, `2001:db8::/64` olur.

## Bu Ne Zaman Yararlıdır

Güvenlik duvarı kurallarını, ACL'leri, yönlendirme tablolarını, VPN izin verilenler listelerini veya içe aktarılan yapılandırma dosyalarını karşılaştırmadan önce bunu kullanın. Normalleştirilmiş giriş, kopya tespitini, incelemeleri ve ağ araçlarına kopyalayıp yapıştırmayı daha güvenilir hale getirir.

## Giriş Neden Reddedilebilir?

Araç, hatalı biçimlendirilmiş IPv4 veya IPv6 adreslerini, geçersiz CIDR öneklerini ve protokol ailesiyle eşleşmeyen adres veya önek birleşimlerini reddeder. Değer açıkça ayrıştırılamıyorsa, yanlış ağı normalleştirmektense onu reddetmek daha güvenlidir.

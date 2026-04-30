CIDR Parser, `10.24.8.19/21` veya `2001:db8:abcd::123/64` gibi bir bloğu gerçekten kastettiğiniz ağa dönüştürür. Host-adres girişini normalleştirir, kanonik subnet’i gösterir ve firewall kuralları yazarken, aralıkları belgelerken veya bir tahsisin fazla büyük olup olmadığını kontrol ederken gereken sınırları ortaya çıkarır.

## Ne Gösterir

Sonuç hızlı bir özetle başlar, sonra bloğu pratik ayrıntılara böler: kanonik CIDR, toplam ve kullanılabilir adres sayıları, aralık başlangıcı ve sonu, ayrıca bloğun arkasındaki tamsayı değerleri. IPv4 için netmask, wildcard maskesi ve broadcast adresi de gösterilir. IPv6 için aynı akış korunur, ancak geçerli olmayan alanlar gizlenir.

## Kanonikleştirme Neden Önemli

Yapıştırılan birçok CIDR değeri host bitleri içerir. Bu insanlar için sorun değildir, ancak router’lar, ACLs ve dokümantasyon genellikle kanonik ağ adresine ihtiyaç duyar. Kopyalamadan önce bloğu yeniden yazarak araç, off-by-one varsayımlarını config’e sızmadan yakalamayı kolaylaştırır.

## Pratik Notlar

- `/31` ve `/32` IPv4 blokları tamamen kullanılabilir kabul edilir; bu modern point-to-point ve host-route kullanımına uygundur.
- IPv6 blokları, broadcast kavramı uydurmadan tüm adres alanını ve kullanılabilir aralığı bildirir.
- Her şey tarayıcıda yerel çalışır, bu yüzden iç subnet’ler inceleme sırasında sayfadan ayrılmaz.

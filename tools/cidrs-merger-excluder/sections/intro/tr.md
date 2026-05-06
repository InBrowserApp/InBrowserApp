## Bu Araç Ne Yapar

Bu araç CIDR bloklarını eşdeğer en küçük kümeye birleştirir, ardından hariç tutma listesine koyduğunuz CIDR bloklarını çıkarır. IPv4 ve IPv6'yı aynı çalıştırmada destekler ve tüm işlemler tarayıcınızda yerel olarak gerçekleşir.

## Birleştirme ve Hariç Tutma Nasıl Çalışır

Önce birleştirme listesi normalleştirilir: host bitleri temizlenir, çakışan ağlar birlikte katlanır ve bitişik ağlar daha kısa bir CIDR bloğuyla temsil edilebildiklerinde daraltılır. Bundan sonra, hariç tutma listesi birleştirilmiş aralıklardan çıkarılır. Nihai çıktı, geriye kalanı tam olarak kapsayan en küçük CIDR listesine geri genişletilir.

## Ne Zaman Kullanışlıdır

Güvenlik duvarı kurallarını temizlerken, bulut güvenlik grubu girdileri hazırlarken, VPN izin listelerini incelerken, yönlendirme tablolarını özetlerken veya daha büyük bir tahsisten ayrılmış aralıkları çıkarırken kullanın. Kopyalanmış yapılandırma çakışan bloklar içerdiğinde veya geniş bir ağdan birkaç küçük aralığın çıkarılması gerektiğinde özellikle yararlıdır.

## Girdi Notları

Satır başına bir CIDR girin veya birden çok CIDR'yi virgülle ayırın. IPv4 ve IPv6 blokları birlikte yapıştırılabilir, ancak hariç tutmalar yalnızca aynı adres ailesinden bloklara uygulanır. Geçersiz girişler liste ve satır numarasıyla bildirilir, böylece büyük yapıştırılmış girdileri tahmin yürütmeden düzeltebilirsiniz.

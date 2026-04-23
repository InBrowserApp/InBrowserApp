## Bu Araç Ne Yapar?

Bu araç, bir başlangıç ​​IP adresini ve bitiş IP adresini tam olarak tüm aralığı kapsayan en küçük CIDR blokları kümesine dönüştürür. Her şey tarayıcınızda yerel olarak çalışır, böylece adresler asla cihazınızdan ayrılmaz.

## CIDR Kapsamı Nasıl Çalışır?

Bir CIDR bloğu, eşleşen bir sınır üzerinde hizalanmış iki boyutlu bir ağı temsil eder. Bir aralık bu sınırların ortasında başlayıp bittiği zaman, bir blok yeterli değildir. Dönüştürücü, uygun olan en büyük hizalanmış bloğu almaya devam eder ve ardından tüm aralık kaplanana kadar tekrar eder.

## Neden Birden Fazla Blok Görünebilir?

192.168.1.10 ila 192.168.1.25 gibi aralıklar temiz bir ağ sınırında başlamaz ve bir ağ sınırında da bitmez. Bu nedenle kesin sonuç, istenen aralığın dışındaki ekstra adresleri içermeyen, her biri hizalanmış bir kısmı kapsayan kısa bir blok listesidir.

## Bu Ne Zaman Yararlıdır

Ham başlangıç ​​ve bitiş aralığının standart CIDR gösterimi haline gelmesi gereken güvenlik duvarı kuralları, rota özetleri, ACL girişleri, bulut güvenlik grupları veya geçiş kontrol listeleri hazırlarken bunu kullanın.

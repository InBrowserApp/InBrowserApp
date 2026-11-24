## IPFS veya Filecoin CAR dosyası tarayıcıda nasıl açılır?

Cihazınızdan bir `.car` dosyası seçin. Araç arşivi cihazınızda okur ve kök CID değerini gösterir. Arşivde birden fazla kök varsa istediğiniz kökü seçin. IPFS ve Filecoin, içeriğe göre adreslenen CAR (Content Addressable aRchives) arşivlerini kullanır. Apple varlık katalogları aynı uzantıya sahip farklı bir biçim kullanır.

## Dosya çıkarma veya CAR klasörünü ZIP olarak kaydetme

İçeriğini görmek için bir klasörü açın. Bir dosya seçip özgün verilerini kaydetmek için **Dosyayı indir** düğmesine basın. Klasörü alt klasörleriyle birlikte dışa aktarmak için **ZIP indir** düğmesini kullanın. ZIP dosyasında UnixFS klasör yapısı korunur.

## Eksik blok ne anlama gelir?

CAR arşivleri içeriği CID ile tanımlanan bloklar hâlinde saklar. Bir kök, eksik bir arşivin dışında saklanan bloklara başvurabilir. Bir öğe için gerekli blok arşivde yoksa kaynağından eksiksiz bir arşiv alın veya tüm blokları mevcut olan bir öğeyi indirin. CAR dosyaları başka IPLD biçimlerinde de veri barındırabilir. Bu araç UnixFS dosya ve klasörlerini çıkarır. [IPLD CAR biçimi](https://ipld.io/specs/transport/car/)

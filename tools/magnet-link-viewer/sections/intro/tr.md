Magnet bağlantısı, bir BitTorrent torrentini info hash değeriyle tanımlar. Bağlantı ayrıca bir görünen ad, izleyici adresleri, web kaynakları veya bir meta veri kaynağı içerebilir. İstemcinin dosya adlarını ve boyutlarını gösterebilmesi için torrent meta verilerini alması gerekir.

## Magnet bağlantısı nasıl incelenir?

Bir `magnet:?` bağlantısı yapıştırın ve “Meta verileri sorgula” düğmesine basın. Görüntüleyici info hash değerini, ayrıca bağlantıda varsa torrent adını ve izleyici adreslerini gösterir. WebTorrent meta verileri aldığında torrent adını, dosya yollarını ve boyutlarını, toplam boyutu ve parça bilgilerini görebilirsiniz. Dosya listesini filtreleyebilir ve info hash değerini kopyalayabilirsiniz.

## Bazı magnet bağlantıları neden sonuç vermez?

WebTorrent, tarayıcıda erişilebilir ve WebRTC destekleyen eşlere ihtiyaç duyar. Bu eşler genellikle bir WebSocket izleyicisi üzerinden bulunur. Bazı magnet bağlantıları, tarayıcının okuyabileceği bir HTTPS meta veri kaynağı da içerir. Masaüstü torrent istemcisinde çalışan bir bağlantı için bu sorgu yine de zaman aşımına uğrayabilir. Elinizde `.torrent` dosyası varsa bağlantısı verilen Torrent Dosyası Görüntüleyicisi’nde hemen açabilirsiniz.

## Sorgu nerelere bağlanır?

Sorgu tarayıcınızda çalışır. WebTorrent, seçtiğiniz torrentin izleyicilerine, eşlerine veya meta veri kaynağına bağlanabilir. Bu hizmetler IP adresinizi ve hangi torrenti sorguladığınızı görebilir. Görüntüleyici yalnızca meta verileri ister. Magnet bağlantılarının, v2 torrentini de tanımladıkları durumda bile, BitTorrent v1 info hash değerini (`btih`) içermesi gerekir.

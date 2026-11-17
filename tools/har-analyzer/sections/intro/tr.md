## Bir HAR kaydı açın

İncelemek istediğiniz istekleri kaydettikten sonra tarayıcınızın Ağ panelinden bir HAR (HTTP Archive) dosyası dışa aktarın. `.har` veya `.json` dosyasını burada açın ya da buraya bırakın veya örneği yükleyin. Dosya sınırı 20 MiB ve 20.000 girdidir.

## Yavaş veya başarısız istekleri bulun

URL, yöntem, durum veya MIME türüne göre arayın, ardından başlangıç zamanı, süre veya aktarım boyutuna göre sıralayın. İstekler, ilk istekten itibaren ölçülen ortak bir zaman ölçeği kullanır. Üstbilgileri, çerezleri, parametreleri, gövdeleri ve zamanlama aşamalarını incelemek için bir istek seçin.

Başarısız istekler filtresi 0, 4xx ve 5xx durumlarını içerir. Durum 0, hiçbir HTTP yanıtının kaydedilmediği anlamına gelir; 3xx filtresi 304 önbellek yanıtlarını da içerir. TLS, bağlantı süresinin bir parçasıdır.

## Kaydedilen verileri okuyun

İşleme tarayıcınızda gerçekleşir. Mevcut ayrıntılar dışa aktarılan verilere bağlıdır. Bilinmeyen boyutlar toplamlara dahil edilmez; bir isteğin süresi eksikse kayıt süresi gösterilemez. Şelale yine de kaydedilen başlangıçları ve bilinen bitişleri kullanır.

Gövde önizlemeleri kaydedilen metni korur. Önizlemeler ve bunların kopyaları ile her bir alan değeri 100.000 karakterle sınırlıdır. Kodlanmış gövdelerin kodu çözülmez.

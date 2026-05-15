## What this tool does

Bu SVG Optimizer, yerel bir SVG dosyasını veya yapıştırılmış SVG belgesini
tarayıcınızda sıkıştırır. Görünür görüntüyü değiştirmeyen yorumları, meta
verileri, gereksiz öznitelikleri, fazla hassasiyeti ve diğer işaretlemeleri
kaldırmak için SVGO temizleme geçişlerini kullanır.

## Why it helps

Tasarım araçlarından dışa aktarılan SVG dosyaları genellikle düzenleyici meta
verileri, ayrıntılı yollar, kullanılmayan ID'ler ve yorumlar içerir. Bunları
optimize etmek indirme boyutunu azaltabilir, sayfa yüklenmesini iyileştirebilir
ve satır içi SVG kodunu bir web sitesine, uygulamaya, e-postaya veya
dokümantasyon sayfasına gönderilmeden önce incelemeyi kolaylaştırabilir.

## How it works

Bir `.svg` dosyası yükleyin veya SVG işaretlemesi yapıştırın, güvenli ön ayarı
seçin ya da tek tek SVGO geçişlerini ayarlayın, ardından optimizasyonu
çalıştırın. Araç, kopyalayabilmeniz veya bir `.optimized.svg` dosyası
indirebilmeniz için orijinal ve optimize edilmiş önizlemeleri, bayt tasarrufunu
ve son işaretlemeyi gösterir. SVG'nin cihazınızdan ayrılması gerekmez.

## Practical notes

- SVG, kolayca inceleyemeyeceğiniz harici CSS, betikli ID'ler veya symbol
  başvurularına bağlıysa güvenli ön ayarı koruyun.
- Boyutları kaldırmanın ve stilleri satır içine almanın kabul edilebilir olduğu
  basit dışa aktarılmış simgeler, logolar ve illüstrasyonlar için agresif ön
  ayarı kullanın.
- Kaynak görseli değiştirmeden önce, özellikle kaynak maskeler, degradeler,
  filtreler veya bağlantılı varlıklar kullanıyorsa optimize edilmiş görüntüyü
  önizleyin.

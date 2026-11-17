## Bu görüntüleyici neleri gösterir

Medya Bilgisi Görüntüleyici; MP4, MOV, MKV, WebM, AVI, MP3, FLAC ve WAV dahil,
yerel ses ve video dosyalarının teknik meta verilerini okur. Dışa aktarılan bir
dosyanın teknik özelliklerini kontrol etmek, bir filmin ses izlerindeki dil
etiketlerini incelemek veya sorun giderme için teknik bir rapor hazırlamak üzere
kullanabilirsiniz. Bir dosya seçtiğinizde veya sürükleyip bıraktığınızda analiz
hemen başlar.

## Dosya, video, ses ve altyazı ayrıntıları

- **Dosyaya genel bakış:** mevcut olduğunda gerçek kapsayıcı biçimi, dosya boyutu,
  süre, toplam bit hızı, başlık ve kodlama uygulaması.
- **Video izleri:** kodek, profil ve bit hızı, çözünürlük, kare hızı ve kare hızı
  modu, en boy oranı, döndürme, bit derinliği, renk uzayı, renk alt örneklemesi
  ve HDR biçimi.
- **Ses izleri:** kodek, bit hızı, dil, iz başlığı, kanal sayısı ve düzeni,
  örnekleme hızı, bit derinliği ve varsayılan veya zorunlu işaretleri. Her ses izi
  ayrı ayrı listelendiğinden özgün ses, dublaj ve yorum izleri birbirinden ayrı
  tutulur.
- **Altyazı izleri:** dosyada yer aldığında biçim, dil, başlık, süre ve varsayılan
  veya zorunlu işaretleri.

Temel teknik özellikler hemen görünür. Ek alanları görmek için bir izdeki
**Teknik ayrıntılar** bölümünü açın veya belirli bir türdeki ilk ize gitmek için
iz sayısını gösteren bağlantıyı seçin. Kullanılabilir alanlar, dosya biçimine ve
meta verilerine bağlıdır.

## Bir dosya nasıl incelenir

1. Yerel bir ses veya video dosyası seçin ya da dosyayı dosya alanına sürükleyin.
2. Özeti kontrol edin, ardından video, ses ve altyazı izlerini tek tek inceleyin.
3. Bir ileti veya destek talebine eklemek üzere okunabilir raporu kopyalayın ya
   da bir varlık envanteri, betik veya ek analiz için JSON dosyasını indirin.
   Her iki çıktı da arayüzde daraltılmış bölümlerdeki teknik alanları içerir.
4. Başka bir dosyayı incelemek için **Dosyayı değiştir** seçeneğini, sonuçları
   temizlemek için **Dosyayı kaldır** seçeneğini kullanın. Başka bir dosya seçmek
   veya mevcut dosyayı kaldırmak, devam eden analizi de durdurur.

## Sayısal değerleri anlama

- **Kapsayıcı ve kodek farklı şeyleri tanımlar.** MP4 ve Matroska birer
  kapsayıcıdır; AVC/H.264, HEVC/H.265 ve AAC ise akışların nasıl kodlandığını
  belirtir. Tek bir kapsayıcı birden çok ses veya altyazı izi içerebilir.
- **Toplam bit hızı dosyanın tamamını kapsar.** Tüm akışları ve kapsayıcının ek
  yükünü içerir. Bir izin bit hızı yalnızca o akış için geçerlidir. Bit hızları
  kb/s veya Mb/s; dosya boyutları ise B, KiB, MiB, GiB veya TiB birimleriyle
  gösterilir.
- **Süre milisaniyeleri içerir.** Gösterimde `HH:MM:SS.mmm` biçimi kullanılır.
  Kare hızı fps, ses örnekleme hızı ise kHz birimiyle gösterilir. CFR sabit kare
  hızını, VFR ise değişken kare hızını belirtir.
- **İz işaretleri, amaçlanan seçimi belirtir.** Varsayılan işareti tercih edilen
  bir izi belirtir; zorunlu işareti ise genellikle tam bir altyazı izi seçilmeden
  gösterilmesi amaçlanan altyazılar için kullanılır. Bunlar dosyadan okunan ayrı
  işaretlerdir.

Bazı kapsayıcılar her akış için ayrı bir bit hızı sağlamaz. Mevcut olmayan
değerler boş bırakılır veya bilgi olmadığı belirtilir; dosya adından tahmin
edilmez. Dosyaya gömülü kapak görselleri video izi olarak sayılmaz.

## Yaygın kullanım alanları

Bir videoyu dışa aktardıktan sonra çözünürlük ve kare hızını kontrol edin, ses
düzenlemeye başlamadan önce kanalları ve örnekleme hızını inceleyin, farklı
dillerdeki izleri veya yorum izlerini belirleyin ya da bir oynatma sorununu
araştırırken kodek ayrıntılarını toplayın. Rapor, medya dosyasını göndermeden
ilgili teknik özellikleri paylaşmanızı sağlar.

## Yerel işleme ve raporları dışa aktarma

Analiz tarayıcınızda gerçekleşir: medya dosyası sunucuya yüklenmez ve içeriği
değiştirilmez. Analiz aracı gerektiğinde dosyanın bölümlerini okur; böylece
tarayıcı kapsayıcıyı veya kodeği oynatamasa bile meta verileri inceleyebilir.

**Raporu kopyala**, okunabilir bir metin özeti oluşturur. **JSON indir**, analiz
aracının döndürdüğü meta verileri dosya adı ve boyutuyla birlikte dışa aktarır.
JSON içinde `Duration` saniye, `BitRate` ve `OverallBitRate` saniye başına bit,
`SamplingRate` ise hertz birimini kullanır. Arayüz bunları daha okunabilir
birimlerle biçimlendirir. Dışa aktarılan dosya, iz kartlarında gösterilenlerin
yanı sıra ek meta veri alanlarını da içerir.

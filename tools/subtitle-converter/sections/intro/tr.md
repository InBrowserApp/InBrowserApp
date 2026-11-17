## Altyazı dönüştürücü hakkında

Mevcut altyazı dosyalarını 19 zamanlı metin biçimi arasında dönüştürün veya düz metin dökümü dışa aktarın. Sık kullanılan işlemler arasında web videoları için SRT'yi VTT'ye dönüştürmek, ASS veya SSA diyaloglarını SRT'ye çevirmek, bir video platformu için altyazı hazırlamak ve dönüştürülen birkaç bölümü tek bir ZIP dosyasında toplamak bulunur. Dönüştürme tarayıcınızda gerçekleşir; altyazı dosyaları ve yapıştırılan içerikler sunucuya yüklenmez.

Araç, altyazı metni ve zamanlamasıyla çalışır. Dosyaları seçin veya altyazıları yapıştırın, bir çıktı biçimi seçin ve indirmeden önce sonucu önizlemede inceleyin. Yapıştırdığınız girdiyi düzenleyip cihazınızdaki özgün dosyayı değiştirmeden yeniden dönüştürebilirsiniz.

## Altyazılar nasıl dönüştürülür?

1. Bir veya daha fazla altyazı dosyası açmak için **Dosyaları seç** düğmesini kullanın, dosyaları giriş paneline sürükleyin veya altyazı metnini düzenleyiciye yapıştırın. **Örnek dene**, iki altyazı satırı içeren kısa bir SRT örneği yükler.
2. Normal kullanımda **Girdi biçimi** ayarını **Otomatik algıla** olarak bırakın. Algılama yalnızca dosya adına dayanmaz, içeriği inceler. Dosyanın biçimi belirsizse kaynak biçimini kendiniz seçin.
3. Bir **Çıktı biçimi** seçin. Tipik bir web sitesi altyazı parçası için WebVTT'yi; SRT dosyası isteyen bir oynatıcı veya düzenleyici için SubRip'i seçin.
4. Farklı bir dosya kodlaması, kare hızı veya zaman kaydırma değeri gerektiğinde **Dönüştürme ayarları** bölümünü açın. Bu ayarları dönüştürmeden önce değiştirin.
5. **Altyazıları dönüştür** düğmesini seçin. Sonuçta kaynak ve çıktı biçimleri, çıktı dosyasının adı ve dönüştürülen altyazı satırlarının sayısı gösterilir.
6. **Önizleme** ve **Dosya içeriği** arasında geçiş yapın, ardından dönüştürülen metni kopyalayın veya dosyayı indirin. Tablo en fazla 100 altyazı satırı gösterir; dosya içeriği ve indirilen dosyalar sonucun tamamını içerir.

**Temizle**, mevcut girdiyi ve sonuçları sayfadan kaldırır. Yeni bir dosya grubu seçmek önceki seçimin yerini alır. Dönüştürücü altyazı geçmişi tutmaz; saklamak istediğiniz sonuçları indirin.

## Desteklenen biçimler ve çıktı hassasiyeti

Aşağıdaki tüm biçimler, okunabilir metin dökümlerini dışa aktarmak için kullanılan TXT dışında hem okuma hem yazmayı destekler. Biçimler zamanı farklı şekillerde saklar; daha düşük hassasiyetli bir biçim seçmek, zaman damgalarını o biçimin desteklediği birimlere yuvarlar.

| Biçim                                   | Uzantı    | Yazılan zamanlama                      |
| --------------------------------------- | --------- | -------------------------------------- |
| SubRip                                  | `.srt`    | Milisaniye                             |
| WebVTT                                  | `.vtt`    | Milisaniye                             |
| Advanced SubStation Alpha               | `.ass`    | Saniyenin yüzde biri                   |
| SubStation Alpha                        | `.ssa`    | Saniyenin yüzde biri                   |
| YouTube SubViewer                       | `.sbv`    | Milisaniye                             |
| MicroDVD                                | `.sub`    | Video kareleri                         |
| SubViewer 2.0                           | `.sub`    | Saniyenin yüzde biri                   |
| SAMI                                    | `.smi`    | Milisaniye                             |
| LRC şarkı sözleri                       | `.lrc`    | Başlangıçlar için saniyenin yüzde biri |
| Timed Text                              | `.ttml`   | Milisaniye                             |
| Distribution Format Exchange Profile    | `.dfxp`   | Milisaniye                             |
| YouTube SRV3                            | `.srv3`   | Milisaniye                             |
| YouTube metin dökümü XML                | `.xml`    | Milisaniye hassasiyetinde saniye       |
| MPL2                                    | `.mpl`    | Saniyenin onda biri                    |
| Spruce Subtitle, metin biçimi           | `.stl`    | Video kareleri                         |
| QuickTime Text                          | `.qt.txt` | Milisaniye                             |
| JSON                                    | `.json`   | Milisaniye cinsinden sayılar           |
| CSV                                     | `.csv`    | Milisaniye cinsinden sayılar           |
| TSV                                     | `.tsv`    | Milisaniye cinsinden sayılar           |
| Düz metin dökümü, yalnızca dışa aktarma | `.txt`    | Zaman damgası yok                      |

TTML girdisi, uyumlu iTT dosyalarını da kabul eder. DFXP, TTML ailesine aittir. TTML dışa aktarımı, platforma özgü tüm profilleri, yerleşimleri veya stil kurallarını yeniden oluşturmaz.

Burada `.sub` uzantısı, metin tabanlı MicroDVD veya SubViewer anlamına gelebilir. İkili VobSub farklı bir biçimdir. Benzer şekilde, desteklenen `.stl` biçimi, ikili EBU STL değil, metin tabanlı Spruce STL'dir. Bu uzantılar belirsiz olduğunda biçimi tam adına göre seçin.

## SRT, VTT, ASS ve düz metin arasında seçim yapma

**SRT**, bir video oynatıcı, düzenleyici veya yükleme formu SubRip altyazıları istediğinde kullanışlı bir seçimdir. **VTT**, HTML videolarının metin parçalarında kullanılan biçimdir ve web'e özgü altyazı ayarlarını da taşıyabilir. Bu biçimler arasında dönüştürme, dosya sözdizimini yeniden oluştururken altyazı metnini ve milisaniye hassasiyetindeki zamanlamayı korur.

Numaralandırılmış bir SRT altyazısı, milisaniyelerden önce virgül kullanır:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Aynı altyazının WebVTT biçiminde bir dosya başlığı ve ondalık noktalı zaman damgaları bulunur:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS ve SSA**, sonraki uygulamanız bunları gerektirdiğinde kullanışlı aktarım seçenekleridir. Desteklenen kalın, italik ve altı çizili biçimlendirme, bunları temsil edebilen biçimler arasında aktarılabilir. Yazı tipleri, ekran konumlandırması, çizim komutları, karaoke animasyonu ve diğer gelişmiş sunum özellikleri sadeleştirilir; okunabilir diyalog içermeyen grafik ASS olayları atlanır. Dönüştürücü, hazırlanmış bir animasyonu veya yerleşimi yeniden üretmekten çok okunabilir altyazılara odaklanır.

**TXT**, zaman damgası veya stil içermeyen okunabilir diyalogları çıkarır. Önizlemesinde zamanlama tablosu yerine dışa aktarılan metin gösterilir. TXT dışa aktarımı altyazı zamanlamaları oluşturmaz, konuşmayı yazıya dökmez veya konuşulan dili başka bir dile çevirmez.

## Dosya kodlaması ve okunabilir metin

Otomatik dosya çözümlemesi UTF-8'i, bayt sırası işaretiyle tanımlandığında ise UTF-16'yı kullanır. Eski dosyalarda karakterler yanlış görünüyorsa veya dosya çözümlenemiyorsa özgün kodlamayı seçin. Açıkça seçilebilen UTF-8 ve UTF-16 seçeneklerinin yanı sıra Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS ve EUC-KR de mevcuttur.

Örneğin, GB18030 kodlamasıyla kaydedildiğini bildiğiniz Çince bir altyazı için GB18030'u veya eski bir uygulamadan alınmış Japonca bir dosya için Shift_JIS'i deneyin. Kodlama, mevcut baytların nasıl okunacağını değiştirir; anlamlarını başka bir dile çevirmez. Farklı bir kodlama seçtikten sonra yeniden dönüştürün. İndirilen altyazı dosyaları, girdi kodlamasından bağımsız olarak UTF-8 kullanır.

## Zamanlamayı ve kare hızını ayarlama

### Tüm altyazıları daha erken veya daha geç gösterme

Zaman kaydırma değeri milisaniye cinsindendir. `1500` değeri her altyazıyı 1,5 saniye geciktirir; `-500` ise altyazıları yarım saniye önce gösterir. `00:00:01.250` zamanında başlayan bir altyazı için bu ayarlar sırasıyla `00:00:02.750` ve `00:00:00.750` sonucunu verir.

Kaydırma, başlangıcı ve bitişi birlikte değiştirir ve zaman çizelgesinin başına ulaşılana kadar süreyi korur. Tamamı sıfırdan önceye kaydırılan altyazılar kaldırılır; kısmen sıfırın öncesine geçen bir altyazı sıfırdan başlar. Zaman kaydırma, sabit bir gecikmeyi düzeltir. Video boyunca kayması değişen bir altyazı parçasını düzeltmez.

### Kare tabanlı zaman damgaları için kare hızını kullanma

MicroDVD ve Spruce STL video karelerini kullanır; dolayısıyla kare hızları, karelerin geçen süreyle nasıl eşleştirileceğini belirler. TTML de kare tabanlı zamanlama içerebilir. Girdiyi yorumlamak için gerektiğinde kaynak videonun `23.976`, `24`, `25` veya `29.97` gibi kare hızını kullanın.

Biçim gömülü bir girdi kare hızı sağlıyorsa bu değer önceliklidir. Kare tabanlı çıktıda seçilen ayar, yazılan kare hızını belirler. Bu ayarı değiştirmek, normal SRT veya VTT saat biçimindeki zaman damgalarını yeniden ölçeklemez; kare tabanlı zaman damgalarının nasıl yorumlandığını veya yazıldığını değiştirir.

### Yuvarlamayı ve eksik bitiş zamanlarını anlama

SRT ve VTT milisaniye hassasiyetini korur. ASS, SSA, SubViewer ve LRC saniyenin yüzde birine; MPL2 onda birine; kare tabanlı çıktı ise karelere yuvarlar. Çok kısa bir altyazı, yuvarlamadan sonra da pozitif bir süreye sahip olur. Önizleme, yuvarlanmamış girdi zaman damgalarını göstermek yerine dışa aktarılan biçimin zamanlamasını yansıtır.

LRC, bitiş zamanları olmadan başlangıç zamanları sağlayabilir. Eksik bitişler için bir sonraki farklı başlangıç zamanı, son altyazı içinse iki saniye kullanılır. LRC dışa aktarımı, özgün boşlukları ve örtüşen bitiş zamanlarını koruyamaz; çok satırlı altyazılar tek bir şarkı sözü satırına dönüşür. QuickTime Text zaman çizelgesi işaretçilerini kullanır; SAMI ve QuickTime, örtüşen altyazıları her zamanlama sınırında birleştirilmiş metin olarak yeniden oluşturabilir. Bu nedenle sonuçta farklı sayıda altyazı parçası bulunabilir.

## Toplu dönüştürme ve ZIP indirmeleri

Birkaç dosyayı aynı çıktı biçimi ve ayarlarla dönüştürmek için dosyaları seçin veya bırakın. Bir sonucu incelemek için dosya adı menüsünden seçin. Dönüştürülemeyen dosyaların her biri kendi hatasını gösterirken başarılı sonuçlar ayrı ayrı indirilebilir durumda kalır.

En az iki dosya başarıyla dönüştürüldüğünde **Tümünü ZIP olarak indir**, bu çıktıları bir araya toplar. Arşiv yalnızca başarılı dönüştürmeleri içerir. Görünen hataları inceleyin, girdi biçimini veya kodlamayı gerektiği gibi ayarlayın ve kalan dosyalar için yeniden dönüştürün.

Çıktı dosyası adları, kaynak dosyanın temel adını korur ve seçilen uzantıyı kullanır: örneğin `episode01.srt`, `episode01.vtt` olur. Birkaç sonuç aynı ada sahip olacaksa ` (2)` gibi bir son ek, ZIP girdilerini birbirinden ayırır. ZIP burada bir indirme seçeneğidir; girdi olarak altyazı dosyalarının kendisini seçin.

## JSON, CSV ve TSV ile veri aktarımı

JSON, milisaniye cinsinden `start` ve `end` değerleriyle bir `text` dizesi içeren altyazı nesnelerinden oluşan bir dizi kullanır:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Okuyucu, bir `segments` dizisi içeren Whisper tarzı JSON'u da kabul eder; burada parçaların `start` ve `end` değerleri saniye cinsindendir. Bu ayrı bir girdi kuralıdır; normal JSON dışa aktarımı milisaniye kullanmaya devam eder.

CSV ve TSV, `start`, `end` ve `text` sütun adlarını kullanır. Girdi zamanları, milisaniye cinsinden sayılar veya saat biçiminde zaman damgaları olabilir. CSV, virgül, tırnak veya satır sonu içeren alanları tırnak içine alır; TSV, sütunlar arasında sekme kullanır. Her iki dışa aktarım da milisaniye cinsinden sayılar yazar. Altyazıları bir elektronik tabloya veya başka bir altyazı işleme akışına aktarırken bu biçimleri kullanın.

## Sık sorulan sorular

### Önizleme ile indirilen metin neden farklı görünüyor?

Önizleme tablosu, okunabilir altyazı metnini ve hedef biçimin zamanlamasını gösterir. Dosya içeriği ise başlıklar, numaralandırma, ayırıcılar ve desteklenen biçimlendirme sözdizimi dahil, dosyaya yazılan gerçek içeriği gösterir. Tablo ilk 100 altyazı satırında dursa bile indirilen dosyalar bu içeriğin tamamını barındırır.

### Stil veya konumlandırma neden değişti?

Biçimler aynı stil modelini paylaşmaz. Desteklenen temel biçimlendirme, temsil edilebildiği yerlerde korunur; gelişmiş stiller, web altyazılarının konumlandırması, animasyon ve platform meta verileri bütünüyle yeniden üretilmez. Dışa aktarımı incelemek için dosya içeriği görünümünü kullanın ve dosyayı kullanacağınız oynatıcı veya düzenleyicide deneyin.

### Bu araç bir videodan veya görüntü tabanlı bir parçadan altyazı çıkarabilir mi?

Mevcut bir metin tabanlı altyazı dosyasıyla başlayın. Gömülü altyazı parçalarını önce videodan çıkarın. Görüntü tabanlı PGS/SUP ve VobSub/IDX parçalarının metne dönüşmesi için OCR gerekir; ikili EBU STL için bu biçimi okuyabilen bir altyazı düzenleyici gerekir.

### Biçim belirtimlerini nereden kontrol edebilirim?

Dosya sözdizimleri ve platform gereksinimleri için [WebVTT belirtimine](https://www.w3.org/TR/webvtt1/), [TTML belirtimine](https://www.w3.org/TR/ttml2/) ve [YouTube'un desteklediği altyazı biçimlerine](https://support.google.com/youtube/answer/2734698) bakın.

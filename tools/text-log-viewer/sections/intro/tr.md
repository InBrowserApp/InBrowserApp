## Metinleri ve günlükleri yerel olarak okuyun

Satır numaraları, ayarlanabilir metin boyutu, isteğe bağlı satır kaydırma ve odaklı okumayla okumak için bir .txt, .text veya .log dosyası açın. Bir satıra atlayın, başa veya sona gidin ya da dosyanın tamamında aramak için Metin bul işlevini kullanın. Arama birebirdir ve büyük/küçük harfe duyarlıdır; sonraki ve önceki eşleşme aramaları dosyanın diğer ucundan devam eder.

## Büyük dosyalar ve uzun satırlar

Okuyucu, büyük dosyaların kullanılabilirliğini korumak için bir seferde tek bölüm gösterir. Çok uzun satırların devamı dahil her bölüme erişilebilir. Seçim ve tarayıcınızın Bul komutu geçerli bölümü kapsar; okuyucunun Metin bul işlevi ise bölüm sınırlarını aşan eşleşmeler dahil çözülen dosyanın tamamında arama yapar. Dosya boyutu veya satır sayısı sınırı uygulanmaz. Kullanılabilir tarayıcı belleği yine de pratik bir sınır oluşturur.

Boş satırlar, sekmeler, karışık CRLF/CR/LF satır sonları ve Unicode metin korunur. Satır sonları, satır geçişleri olarak gösterilir. İşaretleme ve terminal kaçış dizileri, işlem görmeyen metin olarak kalır. Bazı kontrol karakterlerinin görünür bir simgesi yoktur; NUL karakterleri içeren dosyalar için ikili dosya bildirimi gösterilir.

## Doğru kodlamayı seçin

Otomatik mod, UTF-8 ve UTF-16 bayt sırası işaretlerini tanır; bunlar yoksa katı UTF-8 çözümlemesi kullanır. UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 veya Shift JIS seçebilirsiniz. Kod çözme hatası, okunamayan karakterleri sessizce değiştirmek yerine önizlemeyi durdurur. Dosya okunamıyorsa veya bozuk görünüyorsa başka bir kodlama deneyin; görüntüleyici her dosyanın özgün kodlamasını belirleyemez.

Dosyalar cihazınızda; yükleme, uzak kaynak veya otomatik depolama olmadan işlenir. Bir dosyanın kapatılması veya değiştirilmesi okuma oturumunu sonlandırır. Bu görüntüleyici dosyaları düzenlemez, HTML veya terminal komutlarını yorumlamaz ya da canlı bir günlüğü takip etmez.

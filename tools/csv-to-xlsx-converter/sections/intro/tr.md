## Ayırıcılarla ayrılmış metni Excel’e dönüştürün

Yerel bir CSV veya TSV dosyası açın veya buraya bırakın, hücreleri inceleyin ve Sheet1 adlı tek bir çalışma sayfası içeren bir XLSX çalışma kitabı indirin. Otomatik algılama dosyayla eşleşmiyorsa ayırıcıyı ve metin kodlamasını seçin. TSV dosyaları varsayılan olarak sekme karakterlerini kullanır. Önizleme penceresi dışa aktarılan verileri sınırlamaz.

## Tanımlayıcıları ve özgün metni koruyun

CSV ve TSV, elektronik tablo hücre türlerini saklamaz. Bu dönüştürücü baştaki sıfırlar, uzun tanımlayıcılar, ondalık sayıya benzeyen değerler, tarihler ve eşittir işaretiyle başlayan metinler dahil tüm alanları metin olarak korur. Alanları sayı veya tarih olarak yorumlamaz ve formülleri çalıştırmaz. Tırnak içindeki ayırıcılar, kaçış uygulanmış tırnak işaretleri, Unicode, alan içindeki satır sonları, boş alanlar ve boş kayıtlar korunur. Daha kısa satırlarda eksik hücreler boş bırakılır. Sondaki satır sonu yeni bir satır eklemek yerine son kaydı bitirir.

İlk satır ayarı, normal veri veya Excel filtreleri içeren bir başlık satırı seçeneklerini sunar. Her iki seçenek de yinelenen veya boş başlıklar dahil satırı yazıldığı gibi korur. Otomatik kodlama UTF-8 ve bayt sırası işareti içeren UTF-16 kodlamalarını destekler. Diğer kodlamalar elle seçilebilir. Baştaki sep= yönergesi yalnızca otomatik ayırıcı algılama seçildiğinde veya yönergede belirtilen ayırıcı seçili ayırıcıyla eşleştiğinde atlanır.

Hatalı tırnak içine alınmış alanlar, geçersiz metin kodlaması ve Excel’in satır, sütun veya hücre metni sınırlarını aşan veriler, kesilmiş bir çalışma kitabı yerine hataya yol açar. İndirdikten sonra önemli değerleri bir elektronik tablo uygulamasında kontrol edin.

## Yerel işleme

Dönüştürme, dosya sunucuya yüklenmeden bu tarayıcıda yapılır. İçe aktarma ayarlarını değiştirmek, dosyayı değiştirmek veya kapatmak önceki sonucu kaldırır. İptal etmek arka plan görevini durdurur. Dosya boyutu için sabit bir üst sınır yoktur; hangi dosyaların işlenebileceğini kullanılabilir tarayıcı belleği belirler.

Elektronik tablo dosyalarına göz atmak için [Elektronik Tablo Görüntüleyici](../xlsx-viewer/) aracını açın.

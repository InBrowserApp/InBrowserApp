## OpenDocument elektronik tablolarını Excel’e dönüştürün

Yerel bir ODS dosyası açın veya buraya bırakın, hücrelerini inceleyin ve bir XLSX çalışma kitabı indirin. Çalışma sayfası adları ve sırası, gizli çalışma sayfaları, metinler, sayılar, mantıksal değerler, tarihler, kayıtlı formül sonuçları ve birleştirilmiş hücreler dahil edilir. Boş çalışma sayfaları ve hücreler arasındaki boşluklar korunur. Önizleme penceresi dışa aktarılan verileri sınırlamaz.

## Kayıtlı değerler ve uyumluluk

Formüller Excel formüllerine değil, kayıtlı değerlerine dönüştürülür. Kayıtlı sonucu olmayan hücreler boş kalır ve bu durum bildirilir. Tarayıcı formülleri yeniden hesaplamaz veya harici verileri yenilemez. Hatalı sonuçlar genel elektronik tablo hatalarına dönüşür. Baştaki sıfırları olan tanımlayıcılar, Latin alfabesi dışındaki karakterler ve eşittir işaretiyle başlayan metinler dahil, kaynakta metin olan içerik metin olarak kalır.

Tarihler standart bir tarih ve saat biçimi kullanır; saat dilimi açıkça belirtilen tarihler UTC’ye dönüştürülür. Süreler gün sayısı olarak kalır, yüzdeler ise temel bir yüzde biçimi kullanır. Para birimi değerlerinin sayısal kısmı korunur; para birimi etiketi ve özgün biçimlendirme korunmaz. Stiller, satır ve sütun boyutları, grafikler, resimler, yorumlar, bağlantılar, makrolar ve çalışma kitabı ayarları yeniden oluşturulmaz.

Şifrelenmiş dosyalar, geçersiz arşivler, desteklenmeyen veriler ve Excel’in desteklediği sınırların dışındaki değerler veya çalışma sayfası adları açık bir hata mesajıyla bildirilir. Bu dönüştürücü Flat OpenDocument (.fods) dosyalarını kabul etmez. İndirdikten sonra önemli sonuçları elektronik tablo uygulamanızda kontrol edin.

## Yerel işleme

Dönüştürme, belge sunucuya yüklenmeden bu tarayıcıda yapılır. Dosyayı değiştirmek veya kapatmak, indirmek üzere hazırlanan önceki sonucu kaldırır; iptal etmek arka plan görevini durdurur. Dosya boyutu veya çalışma sayfası sayısı için sabit bir üst sınır yoktur. Hangi çalışma kitaplarının işlenebileceğini yine kullanılabilir tarayıcı belleği belirler.

ODS ve diğer elektronik tablo biçimlerine göz atmak için [Elektronik Tablo Görüntüleyici](../xlsx-viewer/) aracını açın.

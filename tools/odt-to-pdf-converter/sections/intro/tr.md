## OpenDocument metin belgelerini yerel olarak dönüştürün

Bir OpenDocument `.odt` belgesi veya `.ott` şablonu açın, PDF’ye dönüştürün, oluşan sayfaları inceleyin ve önizlemede gösterilen PDF’nin aynısını indirin. Dönüştürmeden okumak için [ODT Görüntüleyici](../odt-viewer/) aracını kullanın.

## PDF görünümü ve uyumluluk

Dönüştürme motoru sayfa stillerini, kâğıt boyutlarını, yönü, üstbilgileri, altbilgileri, sütunları, tabloları ve gömülü görselleri işler. Sayfalar, sayfa stillerinin eklediği boş sayfalar dahil olmak üzere oluşturuldukları sırayı korur. Desteklenen metinler seçilebilir; taranmış metne OCR uygulanmaz. Eksik yazı tiplerinin yerine birlikte sunulan yazı tipleri kullanılır; bu nedenle satır sonları, aralıklar ve sayfalandırma değişebilir. Karmaşık düzenler özgün uygulamadan farklı olabilir. PDF’ye güvenmeden önce her sayfayı kontrol edin.

PDF, statik bir dışa aktarma sonucudur. Form denetimleri basılı görünümleriyle gösterilir. Yorumlar ve makrolar korunmaz; dijital imzalar korunmaz veya doğrulanmaz. Gömülü nesneler, medya ve harici belge kaynakları desteklenmez. Korumalı belgeler, hasarlı paketler veya algılanan içerik eksikleri hata oluşturur; eksik bir dosya indirmeye sunulmaz. Dosya uzantısını değiştirmek gerçek biçimi değiştirmez.

## Gizlilik ve tarayıcı kaynakları

Dönüştürme cihazınızda gerçekleşir. İlk dönüştürmede yaklaşık 90 MB motor ve yazı tipi dosyası indirilir; tarayıcınız bunları önbelleğe alabilir. Belgenin kendisi hiçbir zaman sunucuya yüklenmez. Motor yalnızca bir dosya seçtikten sonra yüklenir. WebAssembly ve paylaşılan bellek desteği olan güncel bir tarayıcı gerekir. Büyük veya karmaşık belgeler zaman ve bellek gerektirebilir. Dönüştürmeyi iptal edebilir, dosyayı kapatabilir veya değiştirebilirsiniz. Sabit bir dosya boyutu veya sayfa sayısı sınırı yoktur.

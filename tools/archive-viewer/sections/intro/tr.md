İçeriği çıkarmadan klasörlere göz atmak için bir 7z, RAR, ZIP veya TAR arşivi açın. Önizlemek veya tek başına indirmek istediğiniz dosyayı seçin.

## Ne zaman kullanılır

Sıkıştırılmış bir paket aldığınızda ve tüm arşivi açmadan hızlıca göz atmak istediğinizde kullanın. Sürüm paketlerini, indirilen şablonları, günlük paketlerini, kaynak anlık görüntülerini veya tek dosyalık bir `.gz` ekini kontrol etmek için kullanışlıdır.

## Gizlilik ve dosya işleme

Arşiv içerikleri tarayıcı oturumunuzda yerel olarak okunur. Dosya InBrowser.App'e yüklenmez. Sayfanın yanıt verir kalması için büyük metin girdileri önizlemede sınırlandırılır; dosyanın tamamını incelemeniz gerektiğinde girdiyi indirin.

## Desteklenen arşiv formatları

Görüntüleyici ZIP, 7z, RAR4 ve RAR5, TAR, CPIO, AR (`.deb` paketleri dahil), CAB, ISO 9660 ve LHA arşivlerini açar. Ayrıca GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA veya UNIX compress (`.Z`) ile sıkıştırılmış tek dosyaları ve TAR arşivlerini açar. Örneğin, bir `.tar.zst` sürüm paketini açıp klasörlerine göz atabilir veya bir `.zst` günlük dosyasını açıp sıkıştırması çözülmüş halini indirebilirsiniz.

Şifreli dosyaları, çok parçalı arşivleri, katı RAR4 arşivlerini veya yeni desteklenen formatlarda 512 MiB'ı aşan girdileri çıkarmak için bir masaüstü arşiv programı kullanın. Büyük katı arşivleri açmak veya bu arşivlerden dosya çıkarmak daha uzun sürebilir, çünkü önceki girdilerin de işlenmesi gerekebilir.

## Önizleme davranışı

JSON, Markdown, günlükler, kaynak kodu, CSV, XML, YAML ve TOML gibi metin benzeri dosyalar, eşleşen bir dil mevcut olduğunda söz dizimi vurgulamasıyla önizlenebilir. Yaygın görüntü dosyaları görsel olarak önizlenebilir ve PDF belgeleri mevcut olduğunda tarayıcının yerleşik PDF görüntüleyicisinde açılır. Diğer ikili dosyalar indirilebilir durumda kalır, ancak araç bunları görüntülemeye çalışmaz.

Bir arşiv görüntüleyici, sıkıştırılmış bir dosyayı çıkarmadan önce incelemenizi sağlar. Bu araç ZIP, TAR, GZ, TGZ ve TAR.GZ dosyalarını doğrudan tarayıcıda açar; böylece içinde ne olduğunu doğrulayabilir, klasörlere göz atabilir, okunabilir dosyaları önizleyebilir ve yalnızca ihtiyacınız olan girdiyi indirebilirsiniz.

## Ne zaman kullanılır

Sıkıştırılmış bir paket aldığınızda ve tüm arşivi açmadan hızlıca göz atmak istediğinizde kullanın. Sürüm paketlerini, indirilen şablonları, günlük paketlerini, kaynak anlık görüntülerini veya tek dosyalık bir `.gz` ekini kontrol etmek için kullanışlıdır.

## Gizlilik ve dosya işleme

Arşiv içerikleri tarayıcı oturumunuzda yerel olarak okunur. Dosya InBrowser.App'e yüklenmez. Sayfanın yanıt verir kalması için büyük metin girdileri önizlemede sınırlandırılır; dosyanın tamamını incelemeniz gerektiğinde girdiyi indirin.

## Desteklenen arşiv formatları

Görüntüleyici standart ZIP arşivlerini, sıkıştırılmamış TAR dosyalarını, GZIP ile sıkıştırılmış tek dosyaları ve GZIP içinde paketlenmiş TAR arşivlerini (`.tgz` veya `.tar.gz`) destekler. Parola korumalı veya şifrelenmiş arşivler bu ilk yeniden yazım aşamasında desteklenmez.

## Önizleme davranışı

JSON, Markdown, günlükler, kaynak kodu, CSV, XML, YAML ve TOML gibi metin benzeri dosyalar, eşleşen bir dil mevcut olduğunda söz dizimi vurgulamasıyla önizlenebilir. Yaygın görüntü dosyaları görsel olarak önizlenebilir ve PDF belgeleri mevcut olduğunda tarayıcının yerleşik PDF görüntüleyicisinde açılır. Diğer ikili dosyalar indirilebilir durumda kalır, ancak araç bunları görüntülemeye çalışmaz.

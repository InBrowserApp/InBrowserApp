## Tarayıcıda Sesi Çevrimdışı Kaydedin

Ses Kaydedici'yi, tarayıcıdan ayrılmadan hızlı bir sesli not, mikrofon testi, anlatım taslağı veya ses örneği yakalamak için kullanın. Araç yalnızca kayıt başlattığınızda mikrofon erişimi ister; ardından sonucu duraklatmanıza, devam ettirmenize, durdurmanıza, önizlemenize ve indirmenize olanak tanır.

## Pratik Kullanımlar

Mikrofonun çalışıp çalışmadığını kontrol etmek, sesli bir hatırlatma almak, geçici bir telaffuz örneği kaydetmek veya başka bir iş akışına eklenecek kısa bir klip oluşturmak için kullanışlıdır. Kaydedici istemci tarafında çalıştığı için, basit bir kayıt için masaüstü ses uygulaması yüklemek istemediğinizde de pratik bir seçenektir.

## Gizlilik ve Tarayıcı Biçimleri

Kayıt, tarayıcının MediaRecorder API'si üzerinden gerçekleşir. Siz kaydedip önizlerken ses sayfada yerel kalır; InBrowser.App mikrofon akışını yüklemez. Son dosya türü tarayıcı desteğine bağlıdır; bu nedenle bir tarayıcı WebM veya OGG dosyası verirken başka biri M4A üretebilir.

## Temiz Kayıt İpuçları

Sessiz bir ortam kullanın, mikrofon giriş seviyesini makul tutun ve önemli bir şeyi kaydetmeden önce kısa bir test kaydı alın. Sayfa kaydı başlatamıyorsa, sitenin HTTPS veya localhost üzerinden açık olduğunu ve geçerli tarayıcı sekmesi için mikrofon iznine izin verilmiş olduğunu kontrol edin.

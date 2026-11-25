## WARC web arşivi açma

Bir `.warc` veya `.warc.gz` dosyası seçin ya da sürükleyip bırakın. Örnek arşivi de deneyebilirsiniz. Görüntüleyici arşiv kayıtlarını listeler ve bulduğu ilk kayıtlı HTML sayfasını açar. Bir kaydı bulmak için URL’ye veya kayıt türüne göre filtreleyin, ardından sayfa önizlemesiyle kayıt ayrıntıları arasında geçiş yapın. Büyük arşivlerin dizine eklenmesi biraz zaman alabilir. Dosya tarayıcınızda kalır.

## Arşivleme tarihlerini ve başlıkları okuma

Web ARChive (WARC) dosyası, bir web tarama robotu veya arşivleme aracı bir siteyi ziyaret ettiğinde toplanan kayıtları içerir. Aynı URL’ye ait birden fazla kayıt olabilir. Kayıtları ayırt etmek için UTC cinsinden arşivlenme zamanına ve özgün HTTP durumuna bakın. Yanıt kaydı, sunucunun yanıtını içerir. İstek kaydı, robotun ne gönderdiğini gösterir. Yeniden ziyaret kaydı, sayfayı tekrar saklamadan başka bir kayda başvurabilir. Sayfa önizlemesi bulunmadığında da bu kayıtları inceleyebilirsiniz.

## Önizlemede neler var?

Statik önizleme, aynı arşivdeki HTML’yi ve desteklenen görsellerle stil dosyalarını kullanır. Eksik kaynaklar sayfa düzenini değiştirebilir veya boşluklara yol açabilir. Betikler devre dışıdır ve önizleme özgün siteye istek göndermez. Bu yüzden oturum açma ve video oynatma gibi etkileşimli özellikler kullanılamaz. Görüntüleyici, gzip ile sıkıştırılmış kayıtlar dâhil WARC 1.0 ve 1.1 dosyalarını açar.

[WARC biçiminin teknik tanımı](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)

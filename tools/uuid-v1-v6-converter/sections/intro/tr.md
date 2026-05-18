UUID v1 ve UUID v6 aynı temel bilgileri içerir: zaman damgası, saat dizisi ve düğüm tanımlayıcısı. UUID v1 zaman damgasını tarihsel UUID alan sırasıyla saklarken, UUID v6 bu zaman damgası bitlerini yeniden sıralar; böylece basit sözlük sıralaması oluşturma zamanını daha doğal biçimde izler.

Bu aracı, farklı zamana dayalı UUID düzenleri bekleyen sistemler arasında tanımlayıcıları taşımanız gerektiğinde kullanın. UUID v6 eşdeğerini almak için bir UUID v1 yapıştırın veya UUID v1 gösterimini geri elde etmek için bir UUID v6 yapıştırın. Dönüşüm deterministiktir ve saat dizisi ile düğüm baytlarını değiştirmeden korur.

## Ne zaman kullanılır

- Kimlik meta verilerini korurken kayıtları eski UUID v1 depolamasından UUID v6'ya taşırken.
- UUID v1 ve UUID v6 değerlerini birlikte kullanan veritabanları, günlükler veya kuyruklarda hata ayıklarken.
- Bir UUID v6 değerinin, eski bir entegrasyonun beklediği UUID v1 değerine geri eşlenip eşlenmediğini kontrol ederken.

## Girdi biçimi

Dönüştürücü; tireli kanonik UUID dizelerini, kompakt 32 karakterlik UUID dizelerini, büyük harfli UUID'leri, `urn:uuid:` değerlerini ve süslü parantez içine alınmış UUID'leri kabul eder. Sonuçlar her zaman küçük harfli kanonik UUID biçimine normalleştirilir.

## Gizlilik ve uyumluluk notları

UUID v1 ve UUID v6 oluşturma zamanı ile düğüm bilgilerini kodlayabilir. Bunları gizli bilgi olarak değil, operasyonel tanımlayıcılar olarak ele alın ve zaman damgası ya da düğüm meta verileri hassas olabilecek durumlarda paylaşmaktan kaçının. Bu araç tarayıcınızda yerel olarak çalışır ve UUID'lerinizi yüklemez.

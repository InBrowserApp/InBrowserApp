DNS Sorgulama, bir alan adı için döndürülen herkese açık DNS kayıtlarını denetler. Yeni bir site yayına alma sürecini doğrularken, e-posta teslimini hata ayıklarken, CDN veya yük dengeleyici değişikliklerini kontrol ederken ya da DNSSEC ile ilgili yanıtların çözümleyiciler arasında farklı görünüp görünmediğini onaylarken kullanışlıdır.

## Ne Zaman Kullanılır

Yaygın DNS kayıt türleri için tarayıcı tarafında hızlı bir yanıt gerektiğinde bu aracı kullanın. A ve AAAA kayıtları IPv4 ve IPv6 hedeflerini gösterir, CNAME kayıtları takma adları gösterir, MX kayıtları posta değiştiricilerini tanımlar, TXT kayıtları genellikle SPF veya doğrulama belirteçleri içerir ve NS/SOA/CAA/SRV/HTTPS/SVCB kayıtları yetki devri, yetkili sunucu, sertifika, hizmet ve modern uç nokta ipuçlarını ortaya çıkarır.

## Nasıl Çalışır

Sorgu, DNS over HTTPS ile tarayıcınızda çalışır. Bir çözümleyici seçin, bir veya daha fazla kayıt türü belirleyin ve bir alan adı ya da URL gönderin. URL'ler sorgu gönderilmeden önce ana makine adına normalleştirilir; bu yüzden `https://www.example.com/path` yapıştırıldığında `www.example.com` sorgulanır.

## Sonuçları Okuma

Her kayıt türü DNS yanıt kodu, çözümleyici bayrakları, yanıt satırları ve ham JSON ile ayrı ayrı gösterilir. `NoError`, DNS sunucusunun başarıyla yanıt verdiği anlamına gelir, ancak belirli bir tür için yine de yanıt satırı döndürmeyebilir. `NXDomain`, `ServFail` veya `Refused` genellikle adın var olmadığı, çözümleyicinin sorguyu tamamlayamadığı ya da çözümleyici politikasının isteği engellediği anlamına gelir.

## Gizlilik ve Sınırlamalar

Sorgular InBrowser.App sunucusuna değil, seçilen DNS over HTTPS çözümleyicisine gönderilir. Çözümleyici davranışı, önbellek durumu, DNSSEC doğrulaması ve yerel ağ filtrelemesi sonuçları etkileyebilir. Bu araç, birden çok ağdan yapılan yetkili `dig` denetimlerinin yerini almaz; ancak mevcut tarayıcınızdan herkese açık DoH çözümleyicilerinin ne döndürdüğünü hızlıca incelemenin pratik bir yoludur.

## SPF kaydı nasıl denetlenir?

`v=spf1` ile başlayan tek bir DNS TXT kaydının değerini yapıştırın ve Sözdizimini denetle’yi seçin. DNS, TXT değerini tırnak içinde birden çok metin parçası olarak gösteriyorsa aralarındaki sırayı ve her parçanın içindeki boşlukları koruyarak bunları birleştirin. Araç, her mekanizmayı veya değiştiriciyi gösterir ve sözdizimi hatalarını düzeltilmesi gereken metnin yanında işaretler. Girdi tarayıcınızda kalır.

## SPF mekanizmaları ve niteleyicileri nasıl çalışır?

SPF (Sender Policy Framework), bir alan adının kendi adına hangi sunucuların e-posta gönderebileceğini belirtmesini sağlar. Alıcı sunucu her mekanizmayı sırayla denetler. Örneğin `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` kaydı, sondaki `-all` teriminden önce bir IPv4 bloğunu ve sağlayıcının SPF politikasını denetler. Mekanizma niteleyicileri geçerli (`+`), başarısız (`-`), kesin olmayan başarısızlık (`~`) veya nötr (`?`) sonucu belirtir. Varsayılan niteleyici `+` işaretidir. `redirect=` gibi değiştiriciler eşittir işareti kullanır ve niteleyici almaz.

## DNS sorgusu gerektiren terimlerin sayısı neyi gösterir?

RFC 7208, SPF değerlendirmesinde DNS sorgusu gerektiren en fazla 10 terime izin verir. Buradaki sayı, yapıştırılan kayıttaki `a`, `mx`, `include`, `exists`, `ptr` ve etkin bir `redirect` gibi sorgu gerektirebilecek terimleri kapsar. Bir `include` veya `redirect` başka terimlere yol açabilir. Eşleşen bir mekanizma da değerlendirmeyi erken sonlandırabilir. Yürürlükteki SPF politikasını ve bu terimlerin toplam sayısını doğrulamak için yayımlanan TXT kaydını ve başvurduğu alan adlarını inceleyin.

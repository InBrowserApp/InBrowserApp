## Base85 neden kullanılır

Base85, dört baytı beş yazdırılabilir karaktere sığdırır. Bu sayede onaltılık gösterimden daha yoğundur ama yine de loglar, belgeler, PDF/PostScript akışları ve hata ayıklama araçları içinde taşınması kolaydır.

## Bu kodlayıcı ne sağlar

Bu araç, tarayıcıdaki metni veya yüklenen dosyaları ASCII85 ya da Z85 varyantlarıyla Base85 olarak kodlar. Kodlamadan önce varyantı değiştirebilir, hedef sistemin hangi çıktıyı beklediğini doğrulayabilir ve veriyi sunucuya göndermeden sonucu dışa aktarabilirsiniz.

## Ne zaman kullanılır

İkili veriler için metin açısından güvenli bir gösterim gerektiğinde, bir iş akışının ASCII85 mi yoksa Z85 mi beklediğini kontrol etmek istediğinizde ya da kopyala-yapıştır, dokümantasyon ve çevrimdışı araçlar için yükler hazırlarken kullanın.

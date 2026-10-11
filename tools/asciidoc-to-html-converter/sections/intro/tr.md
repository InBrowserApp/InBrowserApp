## AsciiDoc belgesini yerel olarak dönüştürün

Yerel bir `.adoc` veya `.asciidoc` dosyası açın, oluşturulan belgeyi inceleyin ve bağımsız bir UTF-8 HTML dosyası indirin. Dosya çevrimdışı açılır ve metin seçilebilir durumda kalır. Dönüştürmeden önce kaynak uyarılarını veya kullanılamayan dahil edilmiş dosyaları incelemek için [AsciiDoc Görüntüleyici](../asciidoc-viewer/) aracını kullanın.

## Çıktı ve uyumluluk

Başlıklar, listeler, tablolar, kod blokları, notlar, alıntılar, dipnotlar, bağlantılar ve desteklenen gömülü raster görseller sabit bir okuma temasıyla korunur. Belge içi yer imleri ve dipnotlar belgede kalır; dış bağlantılar yalnızca seçildiğinde açılır. Geniş kod blokları ve tablolar yatay olarak kaydırılır. Önizleme yakınlaştırması indirilen dosyayı değiştirmez. Yazı tipleri ve boşluklar diğer AsciiDoc araçlarından farklı olabilir.

Tüm kaynaklarını içinde barındıran, UTF-8 veya BOM işaretli UTF-16 kodlamalı bir kaynak belge kullanın. Dahil edilen dosyalar ve harici görsel veya stil kaynakları yüklenmez. Kullanılamayan dahil edilmiş dosyalar, ayrıştırma uyarıları, çözümlenmemiş öznitelikler ve eksik veya okunamayan kaynaklar dışa aktarmayı durdurur; kısmi indirme sunulmaz. CSS arka plan resimleri dahil gömülü resimlerin kodunun başarıyla çözülmesi gerekir. Özel makrolar, diyagramlar, uzantılar ve gömülü yazı tipleri desteklenmez. Betikler, formlar, gömülü uygulamalar, SVG ve MathML dahil edilmez. Desteklenmeyen kaynak sözdizimi sıradan metin olarak kalabilir.

## Gizlilik ve tarayıcı kaynakları

Dosyalar bu tarayıcıda kalır. Eksik kaynaklar hiçbir zaman bilgisayarınızdan veya bir web sitesinden alınmaz ve dosya içerikleri hiçbir zaman yüklenmez. Oluşturulan HTML, betikleri ve dış kaynakların otomatik yüklenmesini engeller. Dış bağlantıyı izlemek, ilgili siteyle bağlantı kurabilecek ayrı bir işlemdir. Dönüştürmeyi iptal edebilir, kaynak belgeyi kapatabilir veya değiştirebilirsiniz. Sabit bir dosya boyutu veya sayfa sayısı kotası yoktur; büyük belgeler kullanılabilir tarayıcı belleğine bağlıdır ve kaynak yetersizliği algılanabildiğinde bildirilir.

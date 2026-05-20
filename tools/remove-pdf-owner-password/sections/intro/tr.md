Bir PDF'deki sahip parolası kısıtlamalarını doğrudan tarayıcınızda kaldırın. Araç, düzenleme, yazdırma, kopyalama veya sayfa çıkarma izin bayraklarını artık taşımayan yeni bir PDF oluşturur.

## Ne zaman kullanılır

Zaten normal şekilde açılan bir PDF'niz varsa, ancak belge yazdırma, metni kopyalama, sayfaları düzenleme veya başka bir PDF aracında sayfaları bir araya getirme gibi normal işlemleri engelliyorsa kullanın. Bu durum formlarda, dışa aktarılan raporlarda, eski faturalarda ve kısıtlayıcı PDF izin ayarlarıyla oluşturulmuş belgelerde yaygındır.

## Nasıl çalışır

Bir PDF yükleyin, seçilen dosyayı gözden geçirin, ardından kaldırma adımını çalıştırın. Araç, PDF `--decrypt` işlemiyle qpdf'yi tarayıcıdaki bir arka plan çalışanında çalıştırır ve indirme için yeni bir PDF dosyası döndürür. Özgün dosya değiştirilmeden bırakılır; böylece çıktı ihtiyacınız olan sürüm değilse karşılaştırabilir veya yok sayabilirsiniz.

## Gizlilik ve sınırlamalar

PDF bu tarayıcı oturumunda kalır; bir sunucuya yüklenmez. Bu araç, zaten açılabilen PDF'lerdeki sahip parolası izin kısıtlamalarını kaldırır. Kaybolmuş bir kullanıcı/açma parolasını kurtarmaz ve hasarlı dosyaların veya tarayıcı tarafındaki qpdf derlemesi tarafından desteklenmeyen şifreleme kiplerinin kilidini açamaz.

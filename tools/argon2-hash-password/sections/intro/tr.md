## Argon2 nedir?

Argon2, çevrimdışı parola kırmayı maliyetli hale getirmek için tasarlanmış bir parola hashleme algoritmasıdır. Tekrarlı hesaplamayı yapılandırılabilir bellek maliyetiyle birleştirir; böylece saldırganlar her parola tahmini için hem zamana hem de belleğe ihtiyaç duyar.

**Argon2id neden genellikle varsayılan tercihtir:**

- Çoğu parola saklama sistemi için Argon2i veya Argon2d kullanmaya kıyasla yan kanal saldırılarına ve GPU ile kırmaya karşı direnci daha iyi dengeler
- Kodlanmış çıktı algoritmayı, sürümü, belleği, yinelemeyi, paralelliği, tuzu ve hash değerini tek bir taşınabilir dizede saklar
- Benzersiz rastgele tuz, aynı parolaların aynı saklanan hash değerlerini üretmesini engeller
- Doğrulama ortamınız hızlandıkça bellek ve yineleme ayarları artırılabilir

**Bu araç nasıl kullanılır:**

1. Hash oluşturmak istediğiniz parolayı girin.
2. Oluşturulan tuzu koruyun veya yeni bir rastgele tuz oluşturun.
3. Argon2 varyantını seçin ve hash değerini doğrulayacak sistem için bellek, yinelemeler, paralellik ve hash uzunluğunu ayarlayın.
4. Kodlanmış hash değerini oluşturun ve bu tam dizeyi uygulama veritabanınızda saklayın.

**Güvenlik notları:**

- Düz metin parolayı saklamayın veya günlüğe yazmayın.
- Her parola için yeni bir rastgele tuz kullanın.
- İsteğe bağlı gizli değeri yalnızca doğrulayıcınızda da aynı gizli değer varsa kullanın; aksi halde hash değeri daha sonra doğrulanamaz.
- Gerçek kullanıcılar için oturum açma gecikmesini kabul edilebilir tutan en yüksek bellek ve yineleme ayarlarını tercih edin.

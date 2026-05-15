# PGP Anahtar Oluşturucu

Bu aracı kullanarak doğrudan tarayıcınızda bir OpenPGP anahtar çifti oluşturun. Zırhlı açık anahtar, özel anahtar, iptal sertifikası, anahtar ID'si ve parmak izi üretir; böylece anahtar materyalini bir sunucuya göndermeden şifreli e-posta, dosya şifreleme, sürüm imzalama veya hesap kurtarma iş akışları kurabilirsiniz.

## Ne zaman kullanılır

PGP anahtarları asimetrik kriptografiye ihtiyaç duyduğunuzda kullanışlıdır: diğer kişiler sizin için verileri şifrelemek veya imzaları doğrulamak amacıyla açık anahtarınızı kullanırken, özel anahtarınız verilerin şifresini çözer ve imzalar oluşturur. Tarayıcı tabanlı bir oluşturucu kısa kurulum oturumları, demolar veya sonucu hemen istediğiniz yerel iş akışları için pratiktir.

## Anahtar çifti nasıl oluşturulur

Anahtarın tanınabilir bir kullanıcı ID'si olması için ad, e-posta veya ikisini birden girin. İş, proje veya sürüm imzalama anahtarlarını ayırmak istiyorsanız isteğe bağlı bir yorum ekleyin. Modern OpenPGP yazılımları için ECC'yi, eski araçlarla uyumluluk gerektiğinde RSA'yı seçin. Parola cümlesi isteğe bağlıdır, ancak saklamayı düşündüğünüz her özel anahtar için güçlü şekilde önerilir.

## Anahtar türleri ve süre sonu

ECC, Curve25519 kullanır ve kompakt ve hızlı olduğu için varsayılandır. RSA, uyumluluk için 2048, 3072 ve 4096 bit olarak kullanılabilir. Süre sonu gün cinsinden ayarlanır; 0'ı yalnızca aktif olarak yönettiğiniz ve iptal edebileceğiniz anahtarlar için kullanın. Daha kısa süre sonu dönemleri uzun vadeli riski azaltır ve döndürme alışkanlıklarını kolaylaştırır.

## Özel anahtarları güvenle kullanma

Açık anahtarı, özel anahtarı ve iptal sertifikasını ayrı dosyalar olarak indirin. Özel anahtarı şifreli bir parola yöneticisine veya güvenli çevrimdışı depolamaya yedekleyin ve özel anahtar kaybolur ya da açığa çıkarsa anahtarı devre dışı bırakabilmek için iptal sertifikasını ayrı bir yerde tutun. Bir açık anahtarı yayımlamadan önce parmak izini güvenilir bir kanal üzerinden karşılaştırın.

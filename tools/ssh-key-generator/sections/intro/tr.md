## SSH anahtar çifti nedir?

SSH anahtar çifti, sunuculara, Git barındırıcılarına, dağıtım sistemlerine ve diğer SSH tabanlı hizmetlere kimlik doğrulamak için kullanılan bir açık anahtar ve özel anahtardan oluşur. Açık anahtar paylaşılabilir. Özel anahtar gizli kalmalıdır.

Bu oluşturucu, OpenSSH biçimli Ed25519 veya RSA anahtar çiftlerini tamamen tarayıcınızda oluşturur. Ayrıca bir anahtarı doğrularken OpenSSH'nin yaygın olarak gösterdiği kompakt değer olan SHA-256 parmak izini de gösterir.

## Bu araç ne zaman kullanılır?

- Test sunucusu, Git uzak deposu, konteyner veya geçici laboratuvar ortamı için geliştirme anahtarı oluşturun.
- Yeni SSH erişimi için modern, kompakt bir varsayılan gerektiğinde Ed25519 anahtarı oluşturun.
- Daha eski bir hizmet Ed25519 desteklemediğinde RSA anahtarı oluşturun.
- Özel anahtarı cihazınızda tutarken açık anahtarı `authorized_keys` içine kopyalayın.

## Algoritma nasıl seçilir?

Ed25519, küçük, hızlı ve güncel OpenSSH sürümlerince yaygın olarak desteklendiği için çoğu yeni SSH anahtarı açısından en iyi varsayılandır. RSA, eski cihazlarla, eski Git sunucularıyla veya halen RSA anahtarları bekleyen ilke gereksinimleriyle uyumluluk için yararlıdır.

RSA için 4096 bit temkinli bir varsayılan değerdir. Daha küçük 2048 bit anahtarlar daha hızlıdır ve hala yaygındır, ancak birçok ekip artık uzun süre kullanılacak yeni anahtarlar için 3072 veya 4096 biti tercih ediyor.

## Nelere dikkat edilmeli?

- Burada üretilen özel anahtar şifrelenmemiştir. Gerekirse `ssh-keygen -p -f <key-file>` ile parola ekleyin.
- Özel anahtarı `chmod 600 <key-file>` gibi kısıtlayıcı izinlerle saklayın.
- Özel anahtarları destek taleplerine, sohbete, günlüklere veya bilinmeyen web sayfalarına yapıştırmayın.
- Özel anahtarı içeren bir dizüstü bilgisayar, CI gizli değeri veya yedek açığa çıkmış olabilirse anahtarları yenileyin.

# AES Şifreleme Nedir?

AES simetrik bir şifreleme algoritmasıdır; bu, veriyi şifrelemek ve şifresini çözmek için aynı sırrın kullanıldığı anlamına gelir. Bu araç tamamen tarayıcınızda çalışır ve Web Crypto API kullanır; bu nedenle düz metin, parolalar ve seçilen dosyalar yüklenmez.

Varsayılan mod AES-GCM'dir, çünkü çıktıyı hem şifreler hem de kimliğini doğrular. Kimlik doğrulama önemlidir: Şifreli metin, salt veya IV daha sonra değişirse, şifre çözme değiştirilmiş veri döndürmek yerine başarısız olmalıdır. AES-CBC ve AES-CTR uyumluluk için kullanılabilir, ancak şifreli metnin kimliğini tek başlarına doğrulamazlar.

## Bu Araç Ne Zaman Kullanılır?

Bir notu, token'ı, yapılandırma parçasını veya küçük dosyayı başka bir kanal üzerinden saklamadan ya da paylaşmadan önce korumanız gerektiğinde kullanın. Çıktı; modu, anahtar türetme ayarlarını, salt değerini, IV değerini ve şifreli metni içeren bir JSON zarfıdır. Böylece bu parametreler eşleşen şifre çözme adımı için birlikte kalır.

Parola tabanlı şifrelemede parola PBKDF2 ve rastgele bir salt ile işlenir. Daha yavaş şifreleme ve şifre çözmeyi tolere edebildiğinizde yineleme sayısını artırın. Ham anahtar şifrelemesinde, tam olarak seçilen uzunlukta onaltılık bir anahtar yapıştırın: 128 bit için 32 hex karakter, 192 bit için 48 veya 256 bit için 64.

## Pratik Notlar

Parolayı veya ham anahtarı şifrelenmiş JSON'dan ayrı tutun. Hem JSON'a hem de anahtar materyaline sahip olan herkes verinin şifresini çözebilir. Bir dosyayı şifrelerseniz JSON sonucunu indirin ve bu bağlam önemliyse özgün dosya adını ayrıca saklayın.

Aynı anahtarla manuel bir IV'yi yeniden kullanmayın. Bu araç her çalıştırmada yeni bir IV ve salt üretir; bu daha güvenli varsayılandır. Başka bir sistem özellikle AES-CBC veya AES-CTR gerektirmedikçe AES-GCM'yi tercih edin.

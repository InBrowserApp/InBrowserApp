# CSR Oluşturucu

Certificate Signing Request (CSR), genel anahtarınızı, tanımlayıcı Subject alanlarını, Subject Alternative Names gibi isteğe bağlı uzantıları ve eşleşen özel anahtarla oluşturulmuş bir imzayı içeren bir PKCS#10 iletisidir. Sertifika yetkilileri, özel anahtarınızı hiçbir zaman almadan bir X.509 sertifikası vermek için CSR'yi kullanır.

Bu oluşturucu CSR'leri doğrudan tarayıcınızda oluşturur. Yeni bir RSA veya ECDSA anahtar çifti oluşturabilir ya da zaten dağıtılmış bir anahtar için sertifika yenilemeniz gerektiğinde mevcut şifrelenmemiş PEM özel anahtarını içe aktarabilirsiniz.

## Ne zaman kullanılır

Bir sertifika yetkilisinin TLS, S/MIME, istemci kimlik doğrulaması veya dahili servis sertifikası vermesi ya da yenilemesi gerektiğinde CSR kullanın. CSR, özel anahtara sahip olduğunuzu kanıtlar ve sertifikada görünmesi gereken herkese açık kimlik bilgilerini taşır.

Genel TLS sertifikaları için ana makine adlarını Subject Alternative Names alanına koyun. Common Name, okunabilirlik ve eski sistemler için hâlâ yararlıdır, ancak modern istemciler DNS adlarını ve IP adreslerini SAN'dan doğrular.

## CSR nasıl oluşturulur

Yeni bir anahtar oluşturmayı veya mevcut bir özel anahtarı içe aktarmayı seçin. Sertifika isteğiniz için gerekli Subject alanlarını doldurun, ardından DNS adları, IP adresleri, e-posta adresleri veya URI'ler için SAN girdileri ekleyin. CSR'yi oluşturun ve sertifika yetkilinize yalnızca CSR PEM'i gönderin.

Bu araç yeni bir anahtar oluşturursa, sayfadan ayrılmadan önce özel anahtarı indirin ve saklayın. Bir anahtar içe aktarırsanız araç yalnızca CSR oluşturur ve içe aktarılan özel anahtarı yeniden dışa aktarmaz.

## Anahtar ve biçim notları

RSA 2048 bit yaygın olarak uyumludur; daha uzun ömürlü dahili sertifikalar için 3072 veya 4096 bit tercih edilebilir. ECDSA P-256 kompakt ve geniş desteklidir; P-384 veya P-521 ise daha sıkı ilkeler tarafından gerekli kılınabilir. İçe aktarılan anahtar yolu, şifrelenmemiş PKCS#8, RSA PRIVATE KEY ve EC PRIVATE KEY PEM bloklarını destekler.

Özel anahtarlar hassastır. Bunları güvenilmeyen web sitelerine yapıştırmayın, sertifika yetkililerine göndermeyin ve kaynak kontrolüne işlemeyin. Bu araç tarayıcıda yerel olarak çalışır, ancak operasyonel süreciniz yine de güvenli anahtar saklama ve döndürme gerektirir.

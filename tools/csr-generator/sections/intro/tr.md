## CSR Nedir?

Certificate Signing Request (CSR), bir sertifika otoritesinin (CA) TLS veya kod imzalama sertifikası düzenleyebilmesi için ihtiyaç duyduğu küçük bir PKCS#10 belgesidir. Belge; bir anahtar çiftinin genel yarısını, CA'nın onaylamasını istediğiniz kimliği (Konu / Subject) ve DNS adları ya da IP adresleri gibi ek tanımlayıcıları (Konu Alternatif Adları / SAN) bir araya getirir ve bunların tümü eşleşen özel anahtar tarafından imzalanır.

Bu araç, CSR'ı tamamen tarayıcınızda Web Crypto API ve [`@peculiar/x509`](https://github.com/PeculiarVentures/x509) kullanarak oluşturur. Anahtarınız veya isteğinizle ilgili hiçbir şey bir sunucuya gönderilmez.

## Bu Araç Ne Zaman Kullanılır?

- İş akışları kendi CSR'ınızı yapıştırmanızı istediğinde Let's Encrypt, DigiCert, ZeroSSL, Sectigo gibi genel CA'lardan TLS sertifikası talep etmek için.
- Barındırılan bir forma güvenmeksizin dahili sertifika otoritesi — ACME tabanlı, smallstep, EJBCA, AD CS — için CSR oluşturmak amacıyla.
- Mevcut bir PKCS#8 PEM anahtarını içe aktararak aynı özel anahtarla yalnızca yeni bir CSR imzalayıp sertifikayı yeniden düzenlemek için.

## Form Nasıl Doldurulur?

- **Anahtar kaynağı** — yeni bir anahtar çifti oluşturmak için *Yeni oluştur*'u, şifrelenmemiş bir PKCS#8 PEM anahtarı yapıştırmak için *Mevcut olanı içe aktar*'ı seçin. Şifrelenmiş anahtarlar, eski `RSA PRIVATE KEY` ve `EC PRIVATE KEY` blokları kabul edilmez; önce `openssl pkcs8 -topk8 -nocrypt` komutuyla dönüştürün.
- **Algoritma** — RSA en geniş uyumluluk için varsayılan seçenektir. ECDSA daha küçük imzalar üretir ve modern CA'lar ile TLS istemcileri tarafından yaygın biçimde desteklenir.
- **Konu** — çoğu genel CA, DNS SAN listesini esas alır ve Common Name dışındaki alanları görmezden gelir; ancak özel CA'lar tam DN gerektirebilir.
- **SAN girişleri** — sertifikanın kapsamsına almak istediğiniz ana bilgisayar adlarını, IP adreslerini, e-posta adreslerini veya URI'ları listeleyin. Satır başına bir giriş veya virgülle ayrılmış olarak yazabilirsiniz.

## Dikkat Edilmesi Gerekenler

- CSR'ın yanında gösterilen özel anahtar yerel olarak oluşturulur ve tarayıcınızı asla terk etmez. Sekmeyi kapatmadan önce kaydedin — eşleşen özel anahtar olmadan imzalanmış sertifika kullanılamaz.
- Genel CA'lar, Common Name'in (veya en az bir SAN girişinin) doğrulayabilecekleri bir DNS adı olmasını zorunlu kılar. IP adresi SAN'ları çoğunlukla dahili sertifikalar için kullanışlıdır.
- Oluşturulan özel anahtar şifrelenmemiştir. Saklamadan önce bir parola eklemek istiyorsanız `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` komutunu kullanın.
- Yalnızca RSA (2048/3072/4096) ve ECDSA (P-256/P-384/P-521) desteklenmektedir. EdDSA, tarayıcılar ve CA'lar arasındaki kabul tutarsızlığı nedeniyle kasıtlı olarak dışarıda bırakılmıştır.

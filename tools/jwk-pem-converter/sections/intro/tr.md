## JWK ↔ PEM dönüştürme nedir?

JWK (JSON Web Key), JOSE/JWT sistemlerinde kullanılan JSON tabanlı bir kriptografik anahtar biçimidir. RSA, EC veya OKP anahtarlarını temsil edebilir ve bir JWK Set (JWKS) içinde yer alabilir.

PEM, BEGIN PUBLIC KEY veya BEGIN PRIVATE KEY gibi başlık satırlarına sahip Base64 kodlu ASN.1/DER anahtardır; TLS, OpenSSL ve birçok SDK'da yaygındır.

Bu araç anahtarları iki yönde de dönüştürür; açık (SPKI) veya gizli (PKCS8) çıktı seçilirken anahtar materyalini korur. RSA, EC (P-256/384/521) ve OKP (Ed25519/X25519/Ed448/X448) desteklenir ve her şey tarayıcıda yerel olarak çalışır.

Bir kütüphane, geçit veya CLI OpenSSL tarzı anahtar dosyaları bekliyorsa JWK → PEM seçin. Bir anahtarı JWKS içine koymanız, JSON tabanlı yapılandırma ile aktarmanız veya tarayıcı ya da serverless ortamlarda kullanmanız gerekiyorsa PEM → JWK seçin. Özel anahtar dönüşümü özel materyali korur; bu nedenle karşı tarafın ihtiyacı buysa yalnızca açık çıktıyı paylaşın.

- Yalnızca PEM kabul eden sistemlerde JWK/JWKS anahtarlarını kullanın.
- JWT kütüphaneleri, API ağ geçitleri veya anahtar dağıtımı için PEM anahtarlarını dışa aktarın.
- Özel anahtar verilerini açığa çıkarmadan açık anahtarları güvenle paylaşın.

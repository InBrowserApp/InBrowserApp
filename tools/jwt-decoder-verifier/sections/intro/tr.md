## JWT çözücü ve doğrulayıcı nedir?

JSON Web Token; başlık, payload ve imza olmak üzere üç base64url segmentinden oluşan compact bir dizedir. Bu araç, token yapısını bir sunucuya göndermeden inceleyebilmeniz için başlığı ve payload'ı tarayıcınızda çözer.

İmza doğrulama, token'ın beklediğiniz anahtar ve algoritmayla imzalanıp imzalanmadığını kontrol eder. HS256, HS384 veya HS512 token'ları için paylaşılan bir secret kullanın. RS, PS ve ES token'ları için PEM public key, JWK veya JWKS kullanın.

## Ne zaman kullanılır?

Kimlik doğrulama akışlarında hata ayıklarken, OAuth veya OpenID Connect claim'lerini kontrol ederken, ortamları karşılaştırırken ya da bir backend'in beklenen audience, issuer, subject, expiration ve key identifier değerlerini verdiğini doğrularken çözücüyü kullanın.

Eşleşen secret veya public key elinizdeyken ve başlık, payload ve imzanın hâlâ birlikte olduğunu doğrulamanız gerektiğinde doğrulamayı kullanın. Araç ayrıca yaygın saat ve süre dolumu sorunlarının hemen görünmesi için `exp`, `nbf` ve `iat` alanlarını vurgular.

## Güvenlik notları

JWT payload'ları yalnızca encode edilir, şifrelenmez. Token ayrı bir şifreli JWE değilse, token'a sahip herkes claim'lerini okuyabilir; bu araç JWE işlemez.

Paylaşılan makinelerde production token'larını veya private secret'ları yapıştırmayın. Araç tarayıcınızda yerel olarak çalışır ve token'ı ya da doğrulama materyalini saklamaz, ancak en güvenli iş akışı yine de mümkün olduğunda kısa ömürlü test token'ları ve public key'ler kullanmaktır.

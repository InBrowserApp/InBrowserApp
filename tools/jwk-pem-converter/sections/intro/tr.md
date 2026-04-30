## JWK ↔ PEM dönüştürme nedir?

JWK (JSON Web Key), JOSE/JWT, JWKS uç noktaları ve serverless ya da tarayıcı yapılandırmalarında kullanılan JSON biçimli anahtar materyalidir. Yazılım için okunması kolaydır, ancak anahtar dosyası bekleyen CLI’lar ve altyapılar tarafından daha az kabul edilir.

PEM, DER anahtar verisini BEGIN/END etiketleriyle sarar; OpenSSL, TLS araçları, API gateway’leri ve birçok SDK genellikle bu biçimi ister.

Bu dönüştürücü bu biçimler arasında tarayıcınızda yerel olarak köprü kurar. RSA, EC (P-256/384/521) ve OKP anahtar kapsayıcılarını işler, JWK’den başlarken genel SPKI veya özel PKCS8 PEM seçmenizi sağlar ve desteklenen PEM bloklarını güzel biçimli veya kompakt JWK JSON’a geri dönüştürebilir.

Yalnızca doğrulama veya dağıtım gerekiyorsa genel çıktıyı kullanın. Özel dönüştürmeler özel anahtar materyalini ekranda ve indirmelerde gösterir; bu yüzden sonucu gizli bilgi gibi ele alın ve işiniz bitince sekmeyi kapatın.

- Anahtarları JWKS/JSON yapılandırması ile OpenSSL tarzı PEM dosyaları arasında taşıyın.
- JWT doğrulayıcıları, gateway’ler veya istemcilerle paylaşmadan önce genel anahtarı çıkarın.
- Anahtar materyalini bir sunucuya yüklemeden yerel olarak dönüştürün.

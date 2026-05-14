## What is an X.509 certificate parser?

X.509 sertifikası, bir genel anahtarı etki alanı, hizmet, kuruluş veya kişi gibi bir kimliğe bağlayan imzalı bir belgedir. TLS sertifikaları, sertifika zinciri dosyaları ve birçok S/MIME veya imzalama iş akışı bu biçimi kullanır.

Bu ayrıştırıcı, sertifika ve genel anahtar materyalini doğrudan tarayıcınızda okur. PEM bloklarını, ikili DER dosyalarını ve base64 DER metnini inceleyebilir; ardından konuyu, vereni, seri numarasını, geçerlilik aralığını, imza algoritmasını, genel anahtar algoritmasını, parmak izlerini ve yaygın uzantıları gösterebilir.

Bir sertifika parmak izini karşılaştırmanız, sertifikanın beklenen ana makine için olup olmadığını kontrol etmeniz, Subject Alternative Names alanlarını incelemeniz, anahtar kullanımını doğrulamanız veya TLS ve dağıtım sorunlarını ayıklarken genel anahtar ayrıntılarını çıkarmanız gerektiğinde kullanın.

Araç, güven zincirlerini doğrulamaz veya sertifika yetkilileriyle iletişim kurmaz. Sağladığınız sertifikada veya genel anahtarda kodlananları gösterir; bu nedenle iptal, zincir, ana makine adı veya canlı uç nokta doğrulaması gerektiğinde özel bir TLS tarayıcısı kullanın.

- Sertifikaları kurmadan veya döndürmeden önce SHA-256 ya da SHA-1 parmak izlerini karşılaştırın.
- Sertifika materyalini yüklemeden SAN, anahtar kullanımı, genişletilmiş anahtar kullanımı ve temel kısıtlamaları inceleyin.
- Bir hizmet size yalnızca genel anahtar PEM veya DER dosyası verdiğinde bağımsız SPKI genel anahtarlarını inceleyin.

## SSH ortak anahtar parmak izi nedir?

SSH ortak anahtar parmak izi, ortak anahtar blobunun kısa bir özetidir. Bir anahtara `authorized_keys`, sunucu envanteri veya dağıtım iş akışında güvenmeden önce karşılaştırabileceğiniz kompakt bir değer sağlar.

OpenSSH yaygın olarak `SHA256:...` gibi SHA-256 parmak izleri gösterir. Daha eski dokümantasyon ve bazı denetimler hâlâ iki nokta üst üste ile ayrılmış MD5 parmak izlerini kullanır. Bu araç, anahtarı hiçbir yere göndermeden modern SSH çıktılarıyla ve eski kayıtlarla eşleştirme yapabilmeniz için ikisini de gösterir.

Tek bir ortak anahtar, birkaç `authorized_keys` satırı veya bir SSH2 ortak anahtar bloğu yapıştırın. Ayrıştırıcı yorumları ve authorized_keys seçeneklerini atlar, gerçek SSH anahtar blobunu okur ve parmak izlerini tarayıcınızda yerel olarak hesaplar.

- Kopyalanan bir ortak anahtarın, ekip arkadaşınızın paylaştığı parmak iziyle eşleştiğini doğrulayın.
- `authorized_keys` girdilerini bir sunucu erişim listesiyle karşılaştırın.
- Bir parmak izini kopyalamadan önce anahtar türünü, anahtar boyutunu, eğriyi ve yorumu inceleyin.

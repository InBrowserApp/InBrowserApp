## DMARC toplu raporu nasıl okunur?

DMARC kaydınızdaki `rua` adresine gönderilen toplu raporun ekini açın. Görüntüleyici XML ve GZIP dosyalarını ve tek XML raporu içeren ZIP arşivlerini açar. XML’i yapıştırabilir veya örneği yükleyebilirsiniz. Özette raporu gönderen kuruluş, UTC cinsinden rapor dönemi ve alan adının yayımlanan politikası gösterilir. Dosyalar ve yapıştırılan metin tarayıcınızda işlenir.

## İleti sayıları nasıl yorumlanır?

Her kaynak kaydı, aynı kaynak IP adresine ve değerlendirme sonucuna sahip iletileri gruplandırır. Bir kayıt birden çok iletiyi temsil edebilir ve aynı IP birden çok kayıtta görünebilir. Toplamlar, her satırdaki ileti sayısı toplanarak hesaplanır. Bir ileti, SPF veya DKIM denetiminden geçip ilgili alan adı görünür From alan adıyla uyumluysa DMARC denetiminden geçer. Görüntüleyici, yalnızca iki uyum denetimi de başarısızsa iletiyi başarısız sayar. Hiçbir denetim başarılı değilse ve uyum verileri eksikse sonuç bilinmiyor olarak gösterilir.

## Alan adı uyumu, kimlik doğrulama ve uygulanan işlem neden farklı olabilir?

Raporda belirtilen alan adlarını, sonuçları ve DKIM seçicilerini görmek için Ham kimlik doğrulama sonuçları bölümünü genişletin. SPF veya DKIM doğrulaması başka bir alan adı için başarılı olsa bile DMARC uyum denetimi başarısız olabilir. Uygulanan işlem, alıcının bir ileti grubunu nasıl ele aldığını gösterir. Alıcı bir istisna uyguladığında işlem, yayımlanan politikadan farklı olabilir. Bir göndericiyi incelemek için kaynak IP’ye veya From alan adına göre filtreleyin. Rapor toplamları bu işlemden etkilenmez.

## Hangi DMARC XML biçimleri desteklenir?

Görüntüleyici, RFC 9990’a uygun toplu raporları, bu standardın DMARC ad alanını kullananlar da dahil olmak üzere okur. RFC 7489’u temel alan eski raporları da destekler. RFC 9990, toplu raporlarda kimlik doğrulama sonuçlarını ve uygulanan işlemleri özetlemek için kullanılan XML biçimini açıklar. Posta sisteminiz birden çok raporu tek arşivde topluyorsa incelemek istediğiniz raporu arşivden çıkarıp ayrı açın.

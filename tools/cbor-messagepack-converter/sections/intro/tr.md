## İkili API verilerini inceleme

CBOR ve MessagePack, yapılandırılmış veriler için kompakt ikili serileştirme biçimleridir. API yanıtlarını, WebSocket mesajlarını veya önbelleğe alınmış değerleri JSON olarak incelemek ya da hata ayıklama için JSON'dan ikili veri oluşturmak üzere bu dönüştürücüyü kullanın. Her şey tarayıcınızda işlenir; girdiler yüklenmez veya kaydedilmez.

## JSON kodlama veya baytları çözme

İkili biçimi ve dönüştürme yönünü seçin. Kodlamak için JSON girin ve çıktı için Hex, Base64 veya Base64URL seçin. Çözmek için baytları yapıştırın ve girdi kodlamalarını seçin. Girdi kodlamasını değiştirmek, düzenleyicide bulunan metni yeniden yorumlar.

Kodlama sırasında bir JSON dosyası, çözümleme sırasında ise ham bir `.cbor`, `.msgpack` veya `.bin` dosyası açın. Hex veya Base64 gibi kodlanmış metinler düzenleyiciye yapıştırılmalıdır. Dönüştürdükten sonra görüntülenen metni kopyalayın veya sonucu indirin. İkili indirmeler gerçek baytları içerir ve yeniden içe aktarılabilir.

## Değerleri koruma ve sınırları anlama

Doğrudan yazılan tamsayıların tüm basamakları, biçimin desteklediği 64 bitlik aralık içinde korunur. İkili alanlar, CBOR etiketleri ve MessagePack uzantıları gibi JSON'un temsil edemediği değerler açık tür sarmalayıcıları olarak görünür. Bu sarmalayıcıları yeniden ikili biçimde kodlamak için Genişletilmiş JSON'u etkinleştirin; sarmalayıcı anahtarlarını tesadüfen kullanan sıradan JSON nesneleri için kapalı bırakın.

Örneğin, Genişletilmiş JSON etkinken `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}`, tam bir tamsayıyı ve iki ikili baytı kodlar.

Her dönüşüm, 1 MiB girdi sınırıyla tek bir değeri işler. «Biçimlendirilmiş JSON bayt sayısı», özgün girdiyi değil, görüntülenen ve okunabilir biçimde düzenlenen JSON'u sayar. Yeniden kodlama desteklenen değerleri korur, ancak eşleme sırasını veya ikili kodlama seçimini değiştirebilir. Sarmalayıcı sözdizimi ve desteklenmeyen türler için yukarıdaki «Biçimler ve türlerin korunması» bölümünü açın.

## DNS bölge dosyası nasıl okunur?

BIND biçiminde dışa aktarılmış bir DNS dosyasını açın veya metnini yapıştırın. Bir SOA kaydı, IPv4 ve IPv6 adres kayıtları, posta kayıtları ve bir TXT değeri görmek için örneği yükleyin. Ayrıştırıcı her satırda kaydın adını, sınıfını, türünü, saniye cinsinden geçerlilik süresini ve verisini gösterir. Ada, MX gibi bir türe veya değerin bir bölümüne göre filtreleyin. Ardından envanter ya da taşıma işlemi için görünen kayıtları JSON olarak kopyalayın.

## Alan adı, TTL ve kayıt verileri nasıl işlenir?

$ORIGIN değeri `example.com.` olduğunda ‘www’ göreli adı `www.example.com.` olur. @ geçerli alan adını belirtir. Girintili bir kayıt önceki kaydın adını kullanır. Dosyada $ORIGIN yoksa alan adını Başlangıç alan adı kutusuna girin. Varsayılan $TTL değeri 1h ise 3.600 saniyeye çevrilir. Kendi TTL değeri olan kayıt bu değeri kullanır. Kayıt verisindeki tırnak işaretleri, kaçış karakterleri ve göreli hedefler yazıldığı gibi kalır. Böylece “hello; world” tek bir TXT değeri olarak kalır ve MX verisindeki ‘mail’ değişmez.

## Sonuçlar nasıl yorumlanır?

Ayrıştırıcı yorumları, tırnak içindeki metinleri ve birden çok satıra yayılan kayıtları okur. Notlarda sorunların satır numaraları gösterilir ve okunabilen kayıtlar görüntülenmeye devam eder. Bölge $INCLUDE veya $GENERATE kullanıyorsa tüm kayıtları yapıştırmadan önce bu yönergelerin ürettiği kayıtları hazırlayın. Araç girdiyi tarayıcınızda işler. DNS sunucularına bağlanmaz ve bölgenin belirli bir sağlayıcı tarafından yüklenip yüklenemeyeceğini doğrulamaz.

Kayıtlar, olaylar, günlükler, sabit test verileri ve zamanla sıralanabilir öneklere sahip kompakt tanımlayıcılara ihtiyaç duyan dağıtık sistemler için ULID'leri tarayıcınızda yerel olarak oluşturun. Her değer bu cihazda oluşturulur ve toplu işlem başka bir servise gönderilmeden kopyalanabilir veya indirilebilir.

## Neden ULID Kullanılır

ULID, Universally Unique Lexicographically Sortable Identifier anlamına gelir. 48 bitlik Unix milisaniye zaman damgasını 80 bit rastgelelikle birleştirir, ardından sonucu 26 karakterlik bir Crockford Base32 dizisi olarak kodlar. Bu yapı ULID'leri URL açısından güvenli, veritabanı dostu ve oluşturulma zamanına göre doğal olarak sıralanabilir hale getirir.

## Geçerli Veya Özel Zaman

Normal uygulama kayıtları, içe aktarma anahtarları ve oluşturuldukları zamanı yansıtması gereken test verileri için geçerli zamanı kullanın. Belirli bir anın etrafında sıralanması gereken deterministik görünümlü örneklere, sonradan doldurulan satırlara, yeniden oynatılan olaylara veya sabit test verilerine ihtiyaç duyduğunuzda özel zaman damgasına geçin.

## Monoton Toplu İşlemler

Monoton toplu işlem modu etkinleştirildiğinde, aynı milisaniye için oluşturulan ID'ler rastgele bölümlerini artırır; böylece toplu işlem yukarıdan aşağıya sözlük sırasına göre sıralı kalır. Bunun yerine her satırın yeni bir rastgele bölüm kullanmasını istediğinizde bu modu devre dışı bırakın. Her iki mod da zaman damgasını ilk on karakterde görünür tutar.

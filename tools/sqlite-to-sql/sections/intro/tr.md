## SQLite veritabanı SQL dosyası olarak nasıl dışa aktarılır?

`.db`, `.sqlite` veya `.sqlite3` uzantılı bir SQLite 3 veritabanı dosyasını açın ya da araca sürükleyip bırakın. Araç, SQL dökümünü otomatik olarak oluşturur. Tablo satırları olmadan yalnızca yapıyı dışa aktarmak için **Yalnızca şema** seçeneğini etkinleştirin. Ardından betiğin tamamını kaydetmek için **.sql dosyasını indir** düğmesini kullanın. Çıktının nasıl göründüğünü görmek için örnek veritabanını deneyin.

## SQLite SQL dökümü neleri içerir?

SQL dökümü, bir veritabanını yeniden oluşturmak için kullanılan metin biçiminde bir betiktir. Tabloları, dizinleri, görünümleri ve tetikleyicileri oluşturan `CREATE` ifadelerini içerir. Tam dışa aktarmada tablo satırları için `INSERT` ifadeleri de bulunur. Dökümü Git'te şema değişikliklerini incelemek, okunabilir bir yedek saklamak veya veritabanını başka bir SQLite ortamına taşımak için kullanabilirsiniz.

Kaynak dosya cihazınızda kalır. Kaynak veritabanı ön yazma günlüğü (WAL) kullanıyorsa bağımsız bir kopyasını dışa aktarın. Kopyanın günlükteki onaylanmış değişiklikleri içermesi için veritabanını oluşturan uygulamayı veya SQLite'ın yedekleme komutunu kullanın.

## SQL dökümünden veritabanı nasıl geri yüklenir?

Betiği yeni bir SQLite veritabanına aktarmak için şu komutu çalıştırın.

```sh
sqlite3 restored.sqlite < database.sql
```

`database.sql` yerine indirdiğiniz dosyanın adını yazın. Betik SQLite sözdizimini kullanır. Sanal tablo veya uzantı kullanan veritabanlarını gerekli modüllerin bulunduğu bir SQLite kurulumunda geri yükleyin.

Tablolara göz atmak veya sorgu sonuçlarını CSV ya da JSON olarak dışa aktarmak için [SQLite Görüntüleyici](../sqlite-viewer/) aracını açın. Elektronik tablolardan veritabanı oluşturmak için [CSV ve Excel'den SQLite'a Dönüştürücü](../csv-excel-to-sqlite/) aracını kullanın.

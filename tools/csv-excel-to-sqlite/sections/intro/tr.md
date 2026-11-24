## Elektronik tabloları SQLite veritabanına dönüştürün

Bir veya daha fazla CSV ya da Excel dosyası (.xlsx veya .xls) ekleyin. Her CSV dosyası ve veri içeren her Excel çalışma sayfası, tek bir veritabanında ayrı bir tabloya dönüşür. **SQLite veritabanı oluştur** seçeneğine basmadan önce önizlemede sütunları kontrol edebilir ve tabloları yeniden adlandırabilirsiniz. Dönüştürme tarayıcınızda yapılır ve dosyalarınız cihazınızda kalır.

## Elektronik tablo verileri nasıl tablolara dönüşür?

Varsayılan olarak ilk satır sütun adlarını belirler. Bu satırı veri olarak içe aktarmak ve `column_1` gibi adlar oluşturmak için ilgili tabloda **İlk satırı sütun adları olarak kullan** seçeneğini kapatın. Yinelenen tablo veya sütun adlarına numaralı son ekler eklenir; böylece aynı ada sahip başka bir dosya eklediğinizde her iki tablo da korunur.

Dönüştürücü sayısal sütunları algılarken `00123` gibi metin kimliklerinin başındaki sıfırları korur. Boş hücreler SQL `NULL` değerlerine dönüşür. Excel tarihleri ISO tarih veya zaman damgası metni olarak saklanır ve formül hücrelerinde çalışma kitabına kaydedilmiş sonuçlar kullanılır. Görüntülenen sonuçların yeniden hesaplanması gerekiyorsa önce çalışma kitabını Excel'de kaydedin.

## Sonucu SQL ile sorgulayın

Tablolara göz atmak ve sorgu çalıştırmak için **SQLite Görüntüleyici'de aç** seçeneğini kullanın veya `.sqlite` veritabanını SQLite komut satırında, Python'da ya da başka bir SQLite uygulamasında kullanmak üzere indirin. Örneğin, `orders.csv` dosyasını ve `customers` adlı bir sayfa içeren Excel çalışma kitabını dönüştürdükten sonra müşteri başına sipariş sayısını bulmak için şu sorguyu kullanın:

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Bu örneği uyarlarken kendi önizlemenizdeki tablo ve sütun adlarını kullanın.

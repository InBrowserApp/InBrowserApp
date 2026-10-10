## Bir çalışma sayfasını taşınabilir bir biçime dışa aktarın

Yerel bir .xlsx, .xlsm, .xltx veya .xltm dosyası açın ya da dışa aktarma aracına bırakın. Gizli çalışma sayfaları da dahil olmak üzere özgün adına göre bir çalışma sayfası seçin ve CSV, TSV, JSON veya Markdown biçimini belirleyin. Çıktıyı önizleyin, kopyalayın veya çalışma kitabı ve çalışma sayfasının adını taşıyan bir UTF-8 dosyası indirin. Dosyayı değiştirmek veya kapatmak, tamamlanmamış işlemleri iptal eder ve önceki indirmeleri kaldırır. Elektronik Tablo Görüntüleyici, geçerli sayfa için Çalışma sayfasını dışa aktar işlemini de sunar.

Varsayılan hücre aralığı, kayıtlı değerleri veya formülleri içeren en küçük dikdörtgendir. Bu dikdörtgenin içindeki boş hücreler ve satırlar çıktıda korunur. A1:D20 gibi başka bir aralık girip Aralığı uygula seçeneğini kullanabilirsiniz. Açıkça bir aralık seçmediğiniz sürece boş bir sayfa, boş bir metin dosyası veya boş bir JSON dizisi oluşturur.

## Değerlerin ve başlıkların nasıl gösterileceğini seçin

Biçimlendirilmiş metin, desteklenen sayı biçimlerini izleyerek mümkün olduğunda görüntülenen tarihleri ve başında sıfır bulunan sayı biçimlerini korur. Yerel ayarlara bağlı biçimler Excel’den farklı olabilir. Kayıtlı değerler, sayıları ve mantıksal değerleri korur; tarihlere saat dilimi eklenmez ve tarihler Excel seri numaraları olarak kalır. Metin hücreleri her iki modda da metinlerini korur. Formüller yeniden hesaplanmadan kayıtlı sonuçlarını kullanır. Kayıtlı sonucu olmayan bir hücre boş kalır ve arayüzde bir bildirim gösterilir. Elektronik tablo hataları, #DIV/0! gibi okunabilir dizeler olarak korunur.

CSV ve TSV, ayırıcı, tırnak işareti veya satır sonu içeren alanları tırnak içine alır. JSON, satır dizilerinden oluşan bir dizidir: ilk satır verilerin içinde kalır, yinelenen veya boş başlıklar nesne anahtarlarına dönüşmez ve boş hücreler için null kullanılır. Markdown, ilk satırı tablo başlığı olarak kullanabilir veya tüm veri satırlarının üzerine boş bir başlık ekleyebilir. Markdown noktalama işaretleri, HTML, dikey çizgiler ve hücre içindeki satır sonları kaçış karakterleriyle veya başka güvenli yöntemlerle temsil edilir. İndirilen dosyalar bayt sırası işareti olmadan UTF-8 kullanır; başka bir uygulamaya içe aktarırken UTF-8’i seçin.

## Yerel işleme ve uyumluluk

Çalışma kitabınız bu tarayıcıda kalır; araç tarafından yüklenmez veya kaydedilmez. Makrolar ve betikler çalıştırılmaz, harici veri bağlantıları yenilenmez. Seçili aralıktaki gizli satırlar ve sütunlar dahil edilir. Birleştirilmiş hücreler, yinelenen değerlere genişletilmez. Grafikler, resimler, yorumlar ve çalışma kitabı stilleri bu metin biçimlerine dahil değildir.

Şifrelenmiş, hasarlı ve desteklenmeyen çalışma kitapları için açık bir hata mesajı gösterilir. Dosya boyutu, çalışma sayfası, satır veya sütun sayısı için sabit sınırlar yoktur; ancak büyük bir dışa aktarma işlemi tarayıcının bellek kapasitesini aşabilir. Bu araç kayıtlı verileri dışa aktarır; çalışma kitabını düzenlemez ve başka bir elektronik tablo uygulamasının düz metin alanlarını aynı şekilde yorumlayacağını garanti etmez.

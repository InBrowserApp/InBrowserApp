## Jupyter not defteri PDF’ye nasıl dönüştürülür?

Jupyter, Google Colab veya VS Code’da kaydettiğiniz bir `.ipynb` dosyasını açın ya da buraya sürükleyip bırakın. Önizlemeyi kontrol edin, A4 veya US Letter kağıt boyutunu seçin ve **PDF olarak kaydet** düğmesine basın. Tarayıcınızın yazdırma penceresinde hedef olarak **PDF olarak kaydet** seçeneğini belirleyin. Aynı pencereden bir yazıcı da seçebilirsiniz. Örneğin, `analysis.ipynb` dosyasını e-postaya ekleyebileceğiniz veya bir raporla birlikte teslim edebileceğiniz bir PDF’ye dönüştürebilirsiniz.

## PDF dosyasına neler dahil edilir?

PDF dosyasında not defterindeki hücre sırası korunur. Markdown başlıkları ve tabloları, kaynak kodu ve konsol metni, tablolar, gömülü grafik görselleri gibi desteklenen kayıtlı çıktılar PDF’ye dahil edilir. Uzun kod satırları sayfa genişliğine sığacak şekilde alt satıra geçer. Uzun hücreler bir sonraki sayfada devam edebilir ve PDF’deki metin seçilebilir kalır.

En güncel sonuçları dahil etmek için dönüştürmeden önce not defterini çıktılarıyla birlikte kaydedin. Dönüştürücü kayıtlı dosyayı cihazınızda okur ve hücreleri çalıştırmaz. Widget’lar, statik bir sürümleri kaydedilmişse görünür. LaTeX kaynak kodu metin olarak kalır. Uzak sunuculardaki görseller ve diğer harici kaynaklar yüklenmez.

## Not defterini kullanmanın diğer yolları

Hücreler ve kaydedilmiş çıktılar arasında gezinmek için [Jupyter Notebook Görüntüleyici’yi](../notebook-viewer/) kullanın. HTML, Markdown veya bir kod betiğine ihtiyacınız varsa [Jupyter Notebook Dönüştürücü’yü](../notebook-export/) kullanın.

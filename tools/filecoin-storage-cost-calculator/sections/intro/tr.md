## Filecoin Onchain Cloud depolama maliyeti nasıl tahmin edilir?

Veri boyutunu, **Saklama süresi (gün)** değerini ve **Kopya sayısı** değerini girin. Hesaplayıcı, Filecoin Warm Storage Service üzerinden her kopya için yeni bir veri kümesi saklamanın maliyetini tahmin eder. Aylık depolama ve ispat maliyetini, seçilen süreye ait harcamayı, veri kümelerini oluşturma ve parça ekleme ücretlerini gösterir. Tutarlar USDFC cinsindendir. Filecoin tarifelerinde bir ay 30 gündür.

## Depolama maliyeti nasıl hesaplanır?

Her etkin veri kümesi için boyuta bağlı bir depolama ücreti ve Veri Bulundurma İspatı (Proof of Data Possession, PDP) için sabit bir ücret alınır. Örneğin depolama tarifesi TiB başına 2,50 USDFC ve ispat ücreti kopya başına 0,12 USDFC ise bir TiB veriyi iki kopya hâlinde saklamak 30 günde yaklaşık 5,24 USDFC tutar. Tahmin, girdiğiniz veri boyutunu kullanır. Filecoin, ücretlendirilen kesin boyutu veri içeren yaprak düğümlerden hesaplar. Bu, parça başına 31 bayta kadar ekleyebilir.

## Yükleme ücretlerini ve iade edilebilir rezervi planlama

Her kopyanın kaç parça ve yükleme grubundan oluşacağını belirtmek için **Yükleme ayrıntıları** bölümünü açın. Varsayılan değer, bir grupta bir parçadır. Her kopya için ayrı bir veri kümesi oluşturma ücreti alınır. Parça eklerken grup başına taban ücrete parça başına ücret de eklenir. Yaşam döngüsü rezervi, hizmetin işlemleri karşılamak için tuttuğu bakiyedir. Rezerv, tahmini harcamadan ayrı gösterilir. Kullanılmayan bakiye hesaplaşma tamamlandıktan sonra serbest bırakılır. Tahmin, yeni bir yüklemeyi ve saklama süresini kapsar. Veri alma ve sonraki işlemler ayrı ücretlendirilir.

## Filecoin tarifeleri nereden gelir?

Sayfa hesaplamada sonucun yanında tarihiyle gösterilen referans tarifeleri kullanır. Warm Storage fiyatlandırma sözleşmesini herkese açık bir Filecoin RPC üzerinden okumak için **Ana ağ tarifelerini yenile** seçeneğini kullanın. Tarayıcı gelen tarifeleri kullanır ve bunların okunduğu bloğu gösterir. İstek tamamlanamazsa referans tarifelerle hesaplamaya devam edebilirsiniz.

Ücretlendirilen kesin boyut, hesaba özel fon gereksinimleri ve tüm ücretler için [Filecoin depolama maliyeti kılavuzuna](https://docs.filecoin.cloud/developer-guides/storage/storage-costs/) bakın.

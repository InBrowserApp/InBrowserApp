## Filecoin depolama anlaşması kimlikle nasıl sorgulanır?

Filecoin ana ağındaki Storage Market anlaşmasının sayısal **Anlaşma kimliği** değerini girin, ardından **Anlaşmayı sorgula** düğmesine basın. **Örnek dene** düğmesi, durumunu, sağlayıcısını, istemcisini, tarihlerini ve Piece CID değerini görebileceğiniz herkese açık bir kayıt yükler. Bu araç Storage Market anlaşmalarını sorgular. Filecoin Onchain Cloud ayrı bir veri kümesi kimliği kullanır.

## Filecoin anlaşma durumu nasıl okunur?

Etkin bir anlaşmanın etkinleştirildiği kayda geçmiştir ve planlanan bitiş zamanı henüz gelmemiştir. Bekleyen bir anlaşma planlanan başlangıçtan önce etkinleştirilmeyi bekler. Araç ayrıca etkinleştirme olmadan başlangıç zamanı geçen, süresi dolan veya piyasa durumunda ceza uygulandığı görülen anlaşmaları gösterir. Başlangıç ve bitiş epokları anlaşma teklifinden alınır. UTC tarihleri zincirin epok takvimine göre hesaplanır.

## Anlaşmanın Piece CID değerini dosyanızla karşılaştırma

Piece CID, Filecoin parçası için kaydedilen kriptografik taahhüttür. Bu değeri kopyalayıp Filecoin Piece CID Hesaplayıcısı ile yerel dosyanız veya CAR arşiviniz için hesapladığınız taahhütle karşılaştırın. Sonuç, Filecoin dolgu kuralları uygulandıktan sonraki parça boyutunu da gösterir. Doğrulanmış bir anlaşmada Filecoin Plus doğrulama işareti bulunur.

## Eski Filecoin anlaşmaları nasıl bulunur?

Tarayıcı önce Filecoin ana ağındaki piyasanın güncel durumunu sorgular. Kayıt artık orada bulunmuyorsa araç Filfox'un dizine eklediği ilk koşulları bir geçmiş kayıt olarak gösterebilir. Bu koşullar arasında planlanan tarihler ve anlaşmanın tarafları bulunur. **Filfox'ta görüntüle** düğmesi gezginde aynı anlaşma kimliğine ait kaydı açar.

Zincirin döndürdüğü alanlar için [Filecoin Storage Market RPC başvuru kılavuzuna](https://docs.filecoin.io/reference/json-rpc/state#statemarketstoragedeal) bakın.

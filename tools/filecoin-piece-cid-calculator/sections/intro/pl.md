## Jak obliczyć Piece CID dla archiwum CAR lub pliku

Wybierz dokładnie ten plik, który chcesz przekazać dostawcy usług przechowywania danych w sieci Filecoin. Kliknij **Oblicz Piece CID**, a następnie skopiuj identyfikator w wymaganym formacie. Narzędzie pokazuje też rozmiar fragmentu po dopełnieniu w bajtach. Przeglądarka odczytuje plik na Twoim urządzeniu i przetwarza go partiami. Zawartość pozostaje na urządzeniu.

## Którego formatu użyć?

**Piece CID (v2)** jest zgodny z [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md). Zwykle zaczyna się od `bafkzci` i zawiera informację o rozmiarze danych, której potrzebują nowsze narzędzia Filecoin. **CommP w starszym formacie (v1)** zwykle zaczyna się od `baga6ea4` i jest używany w tradycyjnych umowach o przechowywanie danych w Filecoin. Jeśli potrzebujesz Piece CID w starszym formacie i rozmiaru fragmentu po dopełnieniu, skopiuj CommP i użyj rozmiaru wyświetlonego obok niego. Wklej identyfikator w dowolnym z tych formatów, aby zweryfikować istniejące zobowiązanie na podstawie swojego pliku.

## Dlaczego mój CID z IPFS wygląda inaczej?

Główny CID w IPFS identyfikuje blok lub element główny pliku albo folderu. Piece CID Filecoin stanowi zobowiązanie kryptograficzne odpowiadające dokładnej sekwencji bajtów przesyłanych do przechowania po dopełnieniu i haszowaniu zgodnie z regułami Filecoin. Jeśli przesyłasz archiwum CAR, oblicz zobowiązanie na podstawie samego archiwum. Dwa archiwa CAR mogą mieć ten sam główny CID w IPFS i przechowywać bloki w różnej kolejności, co może zmienić Piece CID. Zgłaszając umowę o przechowywanie, użyj dokładnie tego pliku, dla którego obliczono Piece CID.

Reguły formatu i dopełniania opisuje [specyfikacja Filecoin Piece](https://spec.filecoin.io/systems/filecoin_files/piece/).

## Jak przekonwertować adres Filecoin f410 na 0x

Wklej adres `f410` lub `t410` i wybierz **Konwertuj adres**. Konwerter sprawdzi sumę kontrolną Filecoin i wyświetli odpowiedni adres `0x` w formacie Ethereum z sumą kontrolną EIP-55. Skopiuj wynik do portfela lub eksploratora bloków, który używa formatu adresów Ethereum w sieci Filecoin. Wybierz **Wypróbuj przykład**, aby zobaczyć konwersję bez podawania własnego adresu.

## Jak przekonwertować adres 0x na format Filecoin

Wklej adres `0x` zawierający 40 cyfr szesnastkowych. Wybierz **Sieć główna**, aby uzyskać adres `f410`, albo **Sieć testowa**, aby uzyskać adres `t410`. Sieć Calibration używa tego samego prefiksu `t410` co inne sieci testowe Filecoin. Format `0x` nie zawiera prefiksu sieci, więc te same bajty można zapisać z dowolnym z tych prefiksów Filecoin. Wybierz sieć używaną przez portfel, eksplorator bloków lub giełdę. Możesz podać adres szesnastkowy zapisany tylko małymi albo tylko wielkimi literami. Adres zawierający oba rodzaje liter musi mieć poprawną sumę kontrolną EIP-55.

## Co oznaczają f410 i t410?

To adresy delegowane używane przez maszynę wirtualną Ethereum w Filecoin (FEVM). Adres `f410` lub `t410` i jego postać `0x` oznaczają ten sam 20-bajtowy adres w wybranej sieci Filecoin. Natywny format Filecoin używa Base32 i własnej sumy kontrolnej. Konwersja zmienia jedynie sposób zapisu adresu. Bajty adresu pozostają takie same, a środki FIL pozostają w tej samej sieci.

## Czy można przekonwertować adresy f0, f1, f2 lub f3?

Narzędzie konwertuje adresy delegowane FEVM w przestrzeni nazw `10`. Adresy te rozpoznasz po prefiksie `f410` lub `t410`. Adresy kodujące ID aktora, ich maskowane odpowiedniki `0xff0000…` i inne typy adresów Filecoin nie są obsługiwane. Przypisanie niektórych natywnych adresów do aktora wymaga sprawdzenia stanu łańcucha. Konwersja odbywa się w przeglądarce bez zapytań RPC i podłączania portfela.

Zobacz [przewodnik Filecoin po typach adresów i transferach](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) oraz [specyfikację sum kontrolnych EIP-55](https://eips.ethereum.org/EIPS/eip-55).

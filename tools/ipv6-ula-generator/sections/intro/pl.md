## Czym jest unikalny adres lokalny IPv6?

Unikalny adres lokalny IPv6 (ULA) jest przeznaczony do komunikacji wewnątrz lokalizacji, sieci prywatnych i połączonych organizacji. Pełna przestrzeń ULA to `fc00::/7`. Jej ósmy bit to **bit L**: wartość `1` wybiera używany przez ten generator, przydzielany lokalnie zakres `fd00::/8`, natomiast połowa `fc00::/8` pozostaje zarezerwowana dla innej metody przydziału.

Adresy ULA nie są domyślnie osiągalne globalnie, ale „lokalny” nie znaczy tajny ani automatycznie bezpieczny. Mogą przekraczać routowane granice lokalizacji, sieci VPN i prywatne połączenia między sieciami, jeśli operatorzy skonfigurują takie ścieżki.

## Jak ten generator RFC 4193 tworzy prefiks /48

Ten generator RFC 4193 pobiera z Web Crypto API dokładnie 40 losowych bitów i łączy je z `fd`. Wynikiem jest statystycznie unikalny 48-bitowy prefiks lokalizacji, taki jak `fd12:3456:789a::/48`. Generowanie odbywa się w przeglądarce: narzędzie nie zbiera adresu MAC, znacznika czasu, identyfikatora urządzenia ani odpowiedzi serwera.

Istnieje `2^40` możliwych identyfikatorów globalnych — około 1,1 biliona. Bezpieczna losowość sprawia, że przypadkowe ponowne użycie jest mało prawdopodobne, ale nie gwarantuje, że dwa niezależnie wygenerowane prefiksy nigdy nie będą ze sobą kolidować. Zapisz wybrany prefiks `/48` w dokumentacji sieci i konsekwentnie używaj go ponownie.

## Planowanie 65 536 dostępnych podsieci /64

Po prefiksie lokalizacji `/48` następuje 16-bitowy identyfikator podsieci. Wartości od `0000` do `ffff` dają 65 536 możliwych sieci `/64`. Na przykład identyfikator podsieci `00a0` zamienia `fd12:3456:789a::/48` w kanoniczną sieć `fd12:3456:789a:a0::/64`.

Pozostałe 64 bity to identyfikator interfejsu. To narzędzie służy wyłącznie do planowania prefiksów sieci; nie generuje adresów hostów `/128` ani nie wyprowadza identyfikatorów interfejsu z adresów MAC.

## Gdzie używać ULA — a gdzie nie

Adresy ULA dobrze sprawdzają się w stabilnym adresowaniu wewnętrznym, lokalizacjach połączonych przez VPN, sieciach laboratoryjnych oraz usługach, które powinny zachować prefiks wewnętrzny, korzystając jednocześnie z globalnych adresów unicast IPv6. Nie stanowią zapory ani samoistnej granicy bezpieczeństwa. Stosuj standardową kontrolę dostępu, filtruj niepożądany ruch ULA na granicach lokalizacji i nie umieszczaj wewnętrznych rekordów ULA w publicznym DNS.

Host może jednocześnie używać ULA i globalnego adresu unicast. Używaj adresu globalnego do komunikacji z Internetem, a trwałego prefiksu ULA na prywatnych ścieżkach, które go potrzebują.

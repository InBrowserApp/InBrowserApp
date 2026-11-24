## Jak sprawdzić rekord SPF

Wklej wartość pojedynczego rekordu DNS TXT zaczynającą się od `v=spf1` i wybierz Sprawdź składnię. Jeśli DNS pokazuje wartość TXT w kilku ujętych w cudzysłowy ciągach, połącz je w tej samej kolejności, zachowując spacje w ich treści. Narzędzie pokazuje każdy mechanizm i modyfikator oraz wskazuje błędy składni przy fragmencie do poprawienia. Wklejone dane pozostają w przeglądarce.

## Jak działają mechanizmy i kwalifikatory SPF

SPF (Sender Policy Framework) pozwala wskazać, które serwery mogą wysyłać pocztę w imieniu domeny. Serwer odbiorcy sprawdza mechanizmy po kolei. Na przykład `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` sprawdza blok IPv4 i politykę SPF dostawcy przed końcowym `-all`. Kwalifikatory mechanizmów określają wynik pozytywny (`+`), negatywny (`-`), łagodny wynik negatywny (softfail) (`~`) lub wynik neutralny (`?`). Domyślny kwalifikator to `+`. Modyfikatory, takie jak `redirect=`, używają znaku równości i nie mają kwalifikatora.

## Co oznacza liczba elementów wywołujących zapytania DNS

RFC 7208 dopuszcza podczas oceny SPF maksymalnie 10 elementów wywołujących zapytania DNS. Podana liczba obejmuje takie elementy we wklejonym rekordzie, w tym `a`, `mx`, `include`, `exists`, `ptr` i aktywny `redirect`. Elementy `include` i `redirect` mogą prowadzić do kolejnych, a dopasowany mechanizm może wcześniej zakończyć ocenę. Aby sprawdzić opublikowaną politykę SPF i pełną liczbę takich elementów, przeanalizuj opublikowany rekord TXT i wskazane w nim domeny.

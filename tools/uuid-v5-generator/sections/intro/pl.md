Generuj identyfikatory UUID v5 z UUID przestrzeni nazw i nazwy bez wysyłania żadnej z tych wartości na serwer. UUID v5 przydaje się, gdy potrzebujesz stabilnego identyfikatora, który można później odtworzyć z tych samych danych wejściowych, na przykład jako ID dla nazwy domeny, adresu URL, ścieżki obiektu, uchwytu konta lub rekordu testowego.

## Jak Działa UUID v5

UUID v5 łączy UUID przestrzeni nazw z ciągiem nazwy, haszuje te bajty za pomocą SHA-1, a następnie stosuje bity wersji i wariantu RFC 4122. Ponieważ dane wejściowe są deterministyczne, `example.com` w przestrzeni nazw DNS zawsze daje ten sam UUID: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Wybór Przestrzeni Nazw

Użyj `ns:DNS` dla nazw domen, `ns:URL` dla adresów URL, `ns:OID` dla identyfikatorów obiektów oraz `ns:X.500 DN` dla nazw wyróżniających X.500. Możesz też wkleić własną przestrzeń nazw UUID, gdy aplikacja potrzebuje identyfikatorów ograniczonych do produktu, dzierżawcy, zestawu danych lub migracji.

## Kiedy Go Używać

Wybierz UUID v5, gdy odtwarzalność jest ważniejsza niż losowość. Dobrze sprawdza się przy deterministycznych importach, rekordach testowych, rekordach z przestrzenią nazw oraz systemach, które wymagają, aby ten sam logiczny element otrzymywał to samo ID przy kolejnych uruchomieniach. W przypadku tajnych tokenów lub nieprzewidywalnych publicznych ID użyj zamiast tego generatora losowego.

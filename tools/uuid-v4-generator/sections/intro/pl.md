Generuj UUID v4 lokalnie w przeglądarce, gdy potrzebujesz nowego identyfikatora dla rekordów testowych, wierszy bazy danych, przykładów API, ładunków zdarzeń, danych pomocniczych do testów lub plików konfiguracyjnych. Narzędzie tworzy za każdym razem jeden kanoniczny UUID zapisany małymi literami, dzięki czemu pozostaje skupione na pracy z pojedynczą wartością i nie nakłada się na oddzielny generator masowy.

## Co oznacza UUID v4

UUID v4 to 128-bitowy identyfikator, w którym bity wersji i wariantu są stałe, a pozostałe 122 bity pochodzą z danych losowych. Dzięki temu sprawdza się, gdy potrzebujesz identyfikatorów, które nie ujawniają czasu utworzenia, informacji o maszynie, liczników sekwencji ani szczegółów dotyczących użytkownika.

## Kiedy go używać

Używaj UUID v4 do identyfikatorów generowanych po stronie klienta, atrap obiektów, rekordów tymczasowych, publicznych przykładów i systemów rozproszonych, w których koordynowanie centralnego licznika byłoby niewygodne. To dobry wybór domyślny, gdy kolejność sortowania nie ma znaczenia i potrzebujesz tylko identyfikatora o niskim prawdopodobieństwie kolizji.

## Prywatność i niezawodność

Generowanie odbywa się w tej karcie przeglądarki przy użyciu Web Crypto, więc UUID nie jest wysyłany do InBrowser.App ani do innej usługi. Skopiuj wartość, gdy wygląda poprawnie, a potem wygeneruj nową, kiedy potrzebujesz nowego identyfikatora dla kolejnego rekordu lub przykładu.

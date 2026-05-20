Animowany WebP może zachować ruch GIF, często tworząc mniejsze pliki dla stron internetowych, podglądów produktów, dokumentacji i zasobów wygodnych do czatu. Ten konwerter działa lokalnie i, gdy zachowasz domyślne ustawienia skali, szybkości i pętli, przekazuje oryginalny GIF przez bezstratny enkoder minimalnego rozmiaru `gif2webp`, a następnie eksportuje pliki `.webp`.

## Kiedy go używać

Użyj tego narzędzia, gdy masz animowane GIF-y, które wymagają bardziej nowoczesnego formatu webowego, zwłaszcza na stronach, gdzie znaczenie mają rozmiar pliku i szybkość ładowania. Animowany WebP jest obsługiwany przez aktualne główne przeglądarki i może zachować przezroczystość, tempo oraz zachowanie pętli.

## Opcje konwersji

Skalowanie zmienia każdą klatkę przed kodowaniem, co jest przydatne, gdy GIF jest większy niż miejsce, w którym będzie wyświetlany. Szybkość zmienia taktowanie odtwarzania bez pomijania klatek. Zachowanie pętli może być zgodne ze źródłowym GIF, wymuszać nieskończone odtwarzanie albo używać własnej liczby dla zasobów, które powinny zatrzymać się po określonej liczbie odtworzeń. Zachowanie skali 100%, szybkości 1x i ustawienia pętli Zgodnie z GIF używa domyślnej bezstratnej ścieżki minimalnego rozmiaru.

## Prywatność i ograniczenia

Konwersja działa w Twojej przeglądarce. Bezstratny WebP zwykle kompresuje animacje w stylu GIF lepiej, ale nie może zagwarantować, że każdy wynik będzie mniejszy; bardzo małe lub już zoptymalizowane GIF-y mogą urosnąć, ponieważ kontener WebP nadal ma własny narzut. Zmiana skali, szybkości lub zachowania pętli wymaga dekodowania klatek i może używać znacznej ilości pamięci przy bardzo dużych GIF-ach. Jeśli źródłowy GIF nie zawiera metadanych pętli, domyślny eksport odtwarza się raz, chyba że wybierzesz nieskończone lub własne zapętlenie.
